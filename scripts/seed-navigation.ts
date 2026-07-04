/**
 * Seed default navigation items for the hamburger menu.
 * Run: npx tsx scripts/seed-navigation.ts
 */
import 'dotenv/config'
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set. Copy .env.example → .env.local')
  process.exit(1)
}

// Navigation Item Schema (inline to avoid module resolution issues)
const NavigationItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    destinationType: {
      type: String,
      required: true,
      enum: ['page', 'category', 'collection', 'url', 'filter'],
      default: 'page',
    },
    destinationValue: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
    icon: { type: String, default: null },
  },
  { timestamps: true }
)

const NavigationItem =
  mongoose.models.NavigationItem || mongoose.model('NavigationItem', NavigationItemSchema)

const DEFAULT_NAV_ITEMS = [
  {
    title: 'Home',
    slug: 'home',
    destinationType: 'page',
    destinationValue: '/',
    order: 0,
    enabled: true,
    icon: null,
  },
  {
    title: 'Shop',
    slug: 'shop',
    destinationType: 'page',
    destinationValue: '/shop',
    order: 1,
    enabled: true,
    icon: null,
  },
  {
    title: 'Vegan',
    slug: 'vegan',
    destinationType: 'filter',
    destinationValue: '/shop?tags=vegan',
    order: 2,
    enabled: true,
    icon: null,
  },
  {
    title: 'Best Sellers',
    slug: 'best-sellers',
    destinationType: 'page',
    destinationValue: '/#bestsellers',
    order: 3,
    enabled: true,
    icon: null,
  },
  {
    title: 'Categories',
    slug: 'categories',
    destinationType: 'page',
    destinationValue: '/#categories',
    order: 4,
    enabled: true,
    icon: null,
  },
  {
    title: 'Why Us?',
    slug: 'why-us',
    destinationType: 'page',
    destinationValue: '/#why-us',
    order: 5,
    enabled: true,
    icon: null,
  },
]

async function seed() {
  console.log('🔌 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected')

  // Check if items already exist
  const count = await NavigationItem.countDocuments()
  if (count > 0) {
    console.log(`⚠️  ${count} navigation items already exist. Skipping seed.`)
    console.log('   To re-seed, delete all NavigationItem documents first.')
    await mongoose.disconnect()
    return
  }

  console.log('📝 Seeding default navigation items...')
  await NavigationItem.insertMany(DEFAULT_NAV_ITEMS)
  console.log(`✅ Seeded ${DEFAULT_NAV_ITEMS.length} navigation items:`)
  DEFAULT_NAV_ITEMS.forEach((item, i) => {
    console.log(`   ${i + 1}. ${item.title} → ${item.destinationValue}`)
  })

  await mongoose.disconnect()
  console.log('🔒 Done.')
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
