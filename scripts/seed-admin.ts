import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Load environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mithai2'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mithai.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456'

async function seedAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const db = mongoose.connection.db!

    // Check if admin already exists
    const existing = await db.collection('users').findOne({ email: ADMIN_EMAIL })
    if (existing) {
      console.log(`⚠️  Admin user already exists: ${ADMIN_EMAIL}`)
      await mongoose.disconnect()
      process.exit(0)
    }

    // Create admin user
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12)
    await db.collection('users').insertOne({
      name: 'Admin',
      email: ADMIN_EMAIL,
      password: hashed,
      phone: null,
      image: null,
      emailVerified: null,
      role: 'ADMIN',
      provider: 'credentials',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log(`✅ Admin user created: ${ADMIN_EMAIL}`)
    console.log(`   Password: ${ADMIN_PASSWORD}`)
    console.log('   ⚠️  Change this password after first login!')

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    await mongoose.disconnect()
    process.exit(1)
  }
}

seedAdmin()
