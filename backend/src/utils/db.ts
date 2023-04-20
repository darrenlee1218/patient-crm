//Import the mongoose module
import mongoose from "mongoose";
import { Logger } from "../config/logger";
import { config } from "../config/config";

//Get the default connection
const db = mongoose.connection;

const start = async () => {
  //Bind connection to error event (to get notification of connection errors)
  db.on("error", (e) => Logger.error("MongoDB connection error:", e));
  if (process.env.NODE_ENV !== "test") {
    Logger.info("Connecting to MongoDB Instance.");
    const e_1 = await mongoose.connect(config.dbUrl);
    Logger.info("Connected to MongoDB Instance.");
    return true;
  }

  return Promise.resolve(null);
};

export const MongoConnector = {
  start,
};
