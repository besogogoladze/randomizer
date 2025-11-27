import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB already connected.");
    return;
  }

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    console.log("MongoDB already connected (readyState = 1).");
    return;
  }

  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`);
    isConnected = conn.connections[0].readyState === 1;
    console.log("MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
