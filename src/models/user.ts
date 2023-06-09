import logger from '../logger';
import { AuthMethods } from '../util/authMethods';
import mongoose, { Model, Schema} from 'mongoose';


export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password: string;

}

const schema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);




export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED',
}
schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database.',
  CUSTOM_VALIDATION.DUPLICATED
);

schema.pre('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    return;
  }
  try {
    const hashedPassword = await AuthMethods.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (err) {
    logger.error(`Error hashing the password for the user ${this.name}`, err);
  }
});


export const User: Model<User> = mongoose.model<User>('User', schema);