import mongoose from "mongoose";

const DB_NAME = "video-streaming"

const connectToDB = async () => {
    await mongoose.connect(process.env.DATABASE_URI + DB_NAME);
}


export { connectToDB }