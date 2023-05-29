import mongoose from 'mongoose';



export async function connect(): Promise<void> {

    try {
        await mongoose.connect(process.env.MONGO_URL as string, 
        );
       
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err}`);
    }
}


export async function close(): Promise<void> {
    mongoose.connection.close()
}

