import mongoose from 'mongoose';
import config from 'config'


export async function connect(): Promise<void> {

    try {
        console.log('init: connect to mongo');
        await mongoose.connect(config.get('App.database.mongoUrl'));
        console.log('finish: connect to mongo')


    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err}`);
    }
}


export async function close(): Promise<void> {
    console.log('init: close mongo');
    mongoose.connection.close()
    console.log('finish: close mongo')
}

