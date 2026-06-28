import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedAdmin() {
  console.log('🔐 Seeding admin user...\n')

  const email = 'admin@mithai.com'
  const plainPassword = 'Admin@123'
  const hashedPassword = await bcrypt.hash(plainPassword, 12)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      name: 'Admin',
      email,
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+91 9876543210',
    },
  })

  console.log('✅ Admin user seeded successfully!')
  console.log(`   Email:    ${admin.email}`)
  console.log(`   Password: ${plainPassword}`)
  console.log(`   Role:     ${admin.role}`)
  console.log(`   ID:       ${admin.id}`)
}

seedAdmin()
  .catch((e) => {
    console.error('❌ Admin seed error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
