
import { User } from '@src/models/user';
import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';

export interface DecodedUser extends Omit<User, '_id'> {
    id: string;
  }

export class AuthMethods {

  static  async hashPassword(password: string, salt = 10): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

  static  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

   static generateToken(payload: object): string {
        return jwt.sign(payload, config.get('App.auth.jwt.secret'), {
            expiresIn: config.get('App.auth.jwt.tokenExpiresIn')
        })
    }

  static  decoderToken(token: string): DecodedUser {
        return jwt.verify(token, config.get('App.auth.jwt.secret')) as DecodedUser;
    }
}



