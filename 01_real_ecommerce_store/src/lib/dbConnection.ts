import mongoose from "mongoose";
import { createRootAdmin } from "@/lib/createRootAdmin";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

    async function dbConnect(): Promise<void> {

        if (connection.isConnected) {
            console.log('Already connected to database');
            return
            
        }

        try {
            const db = await mongoose.connect(process.env.MONGO_URI || '',{})
            connection.isConnected = db.connections[0].readyState
            console.log("DB CONNECTED SUCCESSFULLY");

            
            // Call root admin creator
            await createRootAdmin();
            
        } catch (error) {
            
            console.log('DB CONNECTION FAILED');
             throw error; // <-- don’t exit, let the route handle it
           // process.exit(1)
            
        }
    }

     export default dbConnect
