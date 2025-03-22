import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("MongoDB connected successfully")
    } catch (error: any) {
        console.log("MongoDB connection error", error.message);
        process.exit(1)
    }
}