// src/lib/dbConnect.js
import mongoose from "mongoose";
 import { createRootAdmin } from "@/lib/createRootAdmin";

const connection = {}; // track connection status

async function dbConnect() {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("DB CONNECTED SUCCESSFULLY");

    // Call root admin creator
     await createRootAdmin();
  } catch (error) {
    console.log("DB CONNECTION FAILED");
    throw error; // let the route handle the error
  }
}

export default dbConnect;
