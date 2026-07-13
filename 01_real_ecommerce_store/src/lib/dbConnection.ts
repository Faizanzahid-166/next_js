//src/lib/dbConnection.ts

import mongoose from "mongoose";
import { createRootAdmin } from "@/lib/createRootAdmin";
import dns from "dns";

// Import config to load and validate env vars early
import config from "../config/dotenv";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

function normalizeMongoUri(uri: string): string {
    const hasQuery = uri.includes('?')
    const needsRetryWrites = !uri.includes('retryWrites=')
    const needsWMajority = !uri.includes('w=')

    if (!hasQuery) {
        return `${uri}?retryWrites=true&w=majority`
    }

    let normalized = uri
    if (needsRetryWrites) {
        normalized += '&retryWrites=true'
    }
    if (needsWMajority) {
        normalized += '&w=majority'
    }
    return normalized
}

async function dbConnect(): Promise<void> {

    if (connection.isConnected) {
        console.log('Already connected to database')
        return
    }

    if (process.env.NODE_ENV !== 'production') {
        try {
            dns.setServers(['1.1.1.1', '8.8.8.8']);
            console.log('🌐 DNS override applied in dbConnect (dev only)');
        } catch (err: any) {
            console.warn('Failed to set DNS servers in dbConnect:', err.message || err);
        }
    }

    try {
        const mongoUri = normalizeMongoUri(config.mongoUri!)
        const db = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4,
        })
        connection.isConnected = db.connections[0].readyState
        console.log('DB CONNECTED SUCCESSFULLY')

        // Call root admin creator
        await createRootAdmin()
    } catch (error: any) {
        console.log('DB CONNECTION FAILED')
        console.error('MongoDB connection error:', error?.message || error)

        if (config.mongoUri?.startsWith('mongodb+srv://') && ['ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN'].includes(error?.code)) {
            console.error(
                'MongoDB SRV lookup error. If you are behind a restricted network or DNS server, use a standard mongodb:// connection string or allow Atlas DNS SRV resolution.'
            )
        }

        throw error
    }
}

export default dbConnect
