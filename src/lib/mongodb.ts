import mongoose from 'mongoose'
import dns from 'dns'
import { Resolver } from 'dns/promises'

// ─── Google DNS Resolver ──────────────────────────────────────
// Institutional/college WiFi blocks MongoDB SRV DNS lookups.
// Use Google DNS (8.8.8.8) to resolve SRV records manually.
const resolver = new Resolver()
resolver.setServers(['8.8.8.8', '8.8.4.4'])

// Also set system-wide DNS as fallback
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    '❌ MONGODB_URI is not defined.\n' +
    '   Copy .env.example → .env.local and set your MongoDB Atlas connection string.\n' +
    '   Free tier: https://www.mongodb.com/cloud/atlas/register'
  )
}

/**
 * Resolve a mongodb+srv:// URI to a standard mongodb:// URI
 * using Google DNS to bypass institutional DNS blocking.
 */
async function resolveSrvUri(srvUri: string): Promise<string> {
  // Only process mongodb+srv:// URIs
  if (!srvUri.startsWith('mongodb+srv://')) {
    return srvUri
  }

  try {
    // Parse the SRV URI: mongodb+srv://user:pass@hostname/...
    const url = new URL(srvUri.replace('mongodb+srv://', 'https://'))
    const hostname = url.hostname
    const userInfo = url.username ? `${url.username}:${url.password}@` : ''

    // Resolve SRV records
    const srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${hostname}`)
    const hosts = srvRecords.map(r => `${r.name}:${r.port}`).join(',')

    // Resolve TXT records for connection options
    let txtOptions = ''
    try {
      const txtRecords = await resolver.resolveTxt(hostname)
      txtOptions = txtRecords.flat().join('')
    } catch {
      // TXT records are optional
    }

    // Build the standard connection string
    const existingParams = url.search ? url.search.substring(1) : ''
    const allParams = [txtOptions, existingParams, 'tls=true'].filter(Boolean).join('&')

    const resolvedUri = `mongodb://${userInfo}${hosts}/?${allParams}`
    console.log(`✅ Resolved SRV to ${srvRecords.length} hosts via Google DNS`)
    return resolvedUri
  } catch (err) {
    console.error('⚠️ SRV resolution failed, using original URI:', (err as Error).message)
    return srvUri
  }
}

/**
 * Global cache to prevent multiple connections in development
 * (Next.js hot-reloads cause module re-evaluation)
 */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
  resolvedUri: string | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null, resolvedUri: null }

if (!global.mongooseCache) {
  global.mongooseCache = cached
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    // Resolve SRV on first connection
    if (!cached.resolvedUri) {
      cached.resolvedUri = await resolveSrvUri(MONGODB_URI)
    }

    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
    }

    console.log('🔌 Connecting to MongoDB...')

    cached.promise = mongoose
      .connect(cached.resolvedUri, opts)
      .then((m) => {
        console.log('✅ MongoDB connected successfully')
        return m
      })
      .catch((err) => {
        console.error('❌ MongoDB connection failed:', err.message)
        cached.promise = null
        cached.resolvedUri = null // Reset so it re-resolves next time
        throw err
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// ─── Connection Event Logging ──────────────────────────────

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected')
  cached.conn = null
  cached.promise = null
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message)
})

/**
 * Get the native MongoClient for NextAuth MongoDB Adapter.
 * Returns a Promise<MongoClient> — NextAuth adapter expects this.
 */
export async function getMongoClient() {
  await connectDB()
  return mongoose.connection.getClient()
}

/**
 * Returns a MongoClient promise suitable for NextAuth's MongoDBAdapter.
 * The adapter accepts Promise<MongoClient>, so we return the promise directly.
 */
export function getMongoClientPromise() {
  return connectDB().then(() => mongoose.connection.getClient())
}

export default connectDB

