/**
 * ─── MongoDB Backup Script ──────────────────────────────────────
 * 
 * Exports all collections to JSON files in the backups/ directory.
 * 
 * Usage:
 *   npx tsx scripts/backup-db.ts
 *   OR
 *   npm run backup
 */

import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import dns from 'dns'

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) { console.error('❌ MONGODB_URI missing'); process.exit(1) }

async function main() {
  console.log('\n📦 Starting MongoDB backup...\n')

  await mongoose.connect(MONGODB_URI!)
  console.log('✅ Connected to MongoDB')

  const db = mongoose.connection.db
  if (!db) { console.error('❌ DB connection failed'); process.exit(1) }

  // Create timestamped backup folder
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const backupDir = path.resolve(process.cwd(), 'backups', timestamp)
  fs.mkdirSync(backupDir, { recursive: true })

  // Get all collection names
  const collections = await db.listCollections().toArray()
  console.log(`📋 Found ${collections.length} collections\n`)

  let totalDocs = 0

  for (const col of collections) {
    const name = col.name
    const docs = await db.collection(name).find({}).toArray()
    totalDocs += docs.length

    const filePath = path.join(backupDir, `${name}.json`)
    fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf-8')
    console.log(`  ✅ ${name}: ${docs.length} documents`)
  }

  console.log(`\n🎉 Backup complete!`)
  console.log(`   📁 Location: ${backupDir}`)
  console.log(`   📊 Total: ${totalDocs} documents across ${collections.length} collections`)
}

main()
  .catch((e) => { console.error('❌ Backup error:', e); process.exit(1) })
  .finally(() => mongoose.disconnect())
