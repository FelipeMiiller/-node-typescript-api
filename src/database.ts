import mongoose from 'mongoose';
import config from 'config'
import logger from './logger';


export async function connect(): Promise<void> {

    try {
        await mongoose.connect(config.get('App.database.mongoUrl'));
    } catch (err) {
        logger.error(`Error connecting to MongoDB: ${err}`);
    }
}


export async function close(): Promise<void> {

    mongoose.connection.close()
   
}

