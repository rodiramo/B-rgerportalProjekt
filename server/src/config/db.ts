import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB() {
  await mongoose.connect(env.mongoUrl);
  console.log("Mongo connected:", env.mongoUrl);
}
