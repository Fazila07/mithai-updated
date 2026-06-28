const mongoose = require('mongoose')

async function checkUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mithai2')
    const db = mongoose.connection.db
    
    const users = await db.collection('users').find({}).project({ 
      name: 1, email: 1, role: 1, provider: 1, password: 1 
    }).toArray()
    
    console.log(`\n📋 Found ${users.length} user(s) in database:\n`)
    users.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.email}`)
      console.log(`     Name: ${u.name || '(none)'}`)
      console.log(`     Role: ${u.role || 'CUSTOMER'}`)
      console.log(`     Has password: ${!!u.password}`)
      console.log('')
    })
    
    if (users.length === 0) {
      console.log('  ⚠️  No users found! You need to sign up first or run the seed script.')
    }
    
    await mongoose.disconnect()
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

checkUsers()
