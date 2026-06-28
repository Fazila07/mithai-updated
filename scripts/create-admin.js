const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect('mongodb://localhost:27017/mithai2')
    console.log('Connected!')

    const db = mongoose.connection.db
    const email = 'fazilashariff786@gmail.com'
    const password = 'Admin@123456'
    const hashed = await bcrypt.hash(password, 12)

    const existing = await db.collection('users').findOne({ email })

    if (existing) {
      await db.collection('users').updateOne(
        { email },
        { $set: { role: 'ADMIN', password: hashed, updatedAt: new Date() } }
      )
      console.log(`✅ Updated existing user "${email}" to ADMIN role`)
    } else {
      await db.collection('users').insertOne({
        name: 'Fazila',
        email,
        password: hashed,
        phone: null,
        image: null,
        emailVerified: null,
        role: 'ADMIN',
        provider: 'credentials',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log(`✅ Created new admin user: ${email}`)
    }

    console.log(`   Password: ${password}`)
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('❌ Failed:', err)
    process.exit(1)
  }
}

createAdmin()
