import mongoose from 'mongoose';



export async function connect(): Promise<void> {

    try {
        console.log('init: connect to mongo');
        await mongoose.connect(process.env.MONGO_URL as string,)
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

