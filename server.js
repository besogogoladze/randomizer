import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "./router/router";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let isConnected = false;

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

app.use((req, res, next) => {
  if (!isConnected) {
    connectToMongoDB();
  }
  next();
});

app.use("/names", router);

export default app;
