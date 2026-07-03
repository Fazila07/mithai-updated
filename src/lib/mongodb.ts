import mongoose from 'mongoose'

// ═══════════════════════════════════════════════════════════════
//  Production-Ready MongoDB Connection Layer
//  - Single cached connection with readyState validation
//  - Survives Next.js hot-reload (global cache)
//  - Auto-reconnects on mobile hotspot IP changes
//  - Proper timeouts for flaky networks
//  - No manual SRV resolution — uses native Mongoose driver
// ═══════════════════════════════════════════════════════════════

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    '❌ MONGODB_URI is not defined.\n' +
    '   Copy .env.example → .env.local and set your MongoDB Atlas connection string.\n' +
    '   Free tier: https://www.mongodb.com/cloud/atlas/register'
  )
}

// ─── Connection Options (tuned for Atlas M0 + mobile hotspot) ──

const CONNECTION_OPTIONS: mongoose.ConnectOptions = {
  // ── Pool ────────────────────────────────────────────────────
  maxPoolSize: 5,               // M0 free tier has 500 limit; keep it lean
  minPoolSize: 1,               // Keep at least 1 connection alive
  maxIdleTimeMS: 30_000,        // Close idle sockets after 30s

  // ── Timeouts (generous for mobile hotspot) ─────────────────
  serverSelectionTimeoutMS: 15_000,  // 15s to find a healthy server
  socketTimeoutMS: 45_000,           // 45s socket inactivity timeout
  connectTimeoutMS: 15_000,          // 15s to establish TCP connection
  heartbeatFrequencyMS: 10_000,      // 10s heartbeat to detect dead connections

  // ── Resilience ─────────────────────────────────────────────
  retryWrites: true,            // Retry failed writes automatically
  retryReads: true,             // Retry failed reads automatically

  // ── Buffering ──────────────────────────────────────────────
  bufferCommands: false,        // Fail fast instead of buffering operations

  // ── Auto-reconnect ─────────────────────────────────────────
  // Mongoose 7+ / MongoDB driver 6+: the driver handles reconnection
  // automatically. We just need proper timeouts above.
}

// ─── Global Cache (survives Next.js hot-reload) ────────────────

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
  listenersRegistered: boolean
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = global.__mongooseCache ?? {
  conn: null,
  promise: null,
  listenersRegistered: false,
}

if (!global.__mongooseCache) {
  global.__mongooseCache = cached
}

// ─── Timestamp Helper ──────────────────────────────────────────

function ts(): string {
  return new Date().toLocaleTimeString('en-IN', { hour12: true })
}

// ─── Connection State Names ────────────────────────────────────

const STATE_NAMES: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
  99: 'uninitialized',
}

function getStateName(state: number): string {
  return STATE_NAMES[state] ?? `unknown(${state})`
}

// ─── Register Event Listeners (once per process) ───────────────

function registerListeners(): void {
  if (cached.listenersRegistered) return
  cached.listenersRegistered = true

  const conn = mongoose.connection

  conn.on('connected', () => {
    console.log(`✅ [${ts()}] MongoDB Atlas connected`)
  })

  conn.on('connecting', () => {
    console.log(`🔌 [${ts()}] MongoDB connecting...`)
  })

  conn.on('disconnected', () => {
    console.warn(`⚠️  [${ts()}] MongoDB disconnected — will auto-reconnect on next request`)
    // Clear the cache so the next connectDB() call creates a fresh connection
    cached.conn = null
    cached.promise = null
  })

  conn.on('disconnecting', () => {
    console.log(`🔌 [${ts()}] MongoDB disconnecting...`)
  })

  conn.on('reconnected', () => {
    console.log(`✅ [${ts()}] MongoDB reconnected successfully`)
  })

  conn.on('error', (err: Error) => {
    console.error(`❌ [${ts()}] MongoDB connection error: ${err.message}`)
    // Don't clear cache here — let the driver attempt reconnection.
    // Only clear if the connection is fully dead (handled by 'disconnected').
  })

  conn.on('close', () => {
    console.log(`🔒 [${ts()}] MongoDB connection closed`)
    cached.conn = null
    cached.promise = null
  })
}

// ─── Main Connection Function ──────────────────────────────────

export async function connectDB(): Promise<typeof mongoose> {
  // Register listeners on first call (idempotent)
  registerListeners()

  // ── Fast path: return cached connection if it's still alive ──
  if (cached.conn) {
    const state = mongoose.connection.readyState

    // State 1 = connected → good to go
    if (state === 1) {
      return cached.conn
    }

    // State 2 = connecting → wait for the existing promise
    if (state === 2 && cached.promise) {
      return cached.promise
    }

    // State 0 or 3 = disconnected/disconnecting → stale cache, clear it
    console.warn(
      `⚠️  [${ts()}] Cached connection is stale (state: ${getStateName(state)}). Reconnecting...`
    )
    cached.conn = null
    cached.promise = null
  }

  // ── If there's already a pending connection promise, reuse it ──
  if (cached.promise) {
    try {
      cached.conn = await cached.promise
      return cached.conn
    } catch {
      // Previous attempt failed, clear and retry below
      cached.promise = null
    }
  }

  // ── Create a new connection ──────────────────────────────────
  console.log(`🔌 [${ts()}] Initiating MongoDB connection...`)

  cached.promise = mongoose
    .connect(MONGODB_URI, CONNECTION_OPTIONS)
    .then((m) => {
      console.log(`✅ [${ts()}] MongoDB Atlas connected — readyState: ${getStateName(m.connection.readyState)}`)
      cached.conn = m
      return m
    })
    .catch((err: Error) => {
      console.error(`❌ [${ts()}] MongoDB connection failed: ${err.message}`)
      cached.promise = null
      cached.conn = null
      throw err
    })

  cached.conn = await cached.promise
  return cached.conn
}

// ─── MongoClient Accessors (for NextAuth) ──────────────────────

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
