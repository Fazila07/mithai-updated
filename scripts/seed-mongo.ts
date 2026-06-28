/**
 * ─── MongoDB Seed Script ──────────────────────────────────────
 *
 * Seeds the MongoDB database with:
 *   - 1 Admin user
 *   - 5 Categories (Cookies, Brownies, Cacao Bites, Laddus, Crackers)
 *   - 8 Products
 *   - 3 Coupons
 *
 * Usage:
 *   npm run seed
 *
 * Reads MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD from .env.local
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'
import dns from 'dns'

// Force Google DNS to bypass institutional/college WiFi DNS blocking
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])

// Load .env.local (dotenv doesn't load .env.local by default)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config() // also load .env as fallback

// ─── Import Models ─────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set. Add it to .env.local')
  console.error('   See .env.example for setup instructions.')
  process.exit(1)
}

// ─── Define Schemas Inline (to avoid path alias issues in tsx) ──

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerified: { type: Date, default: null },
    image: { type: String, default: null },
    password: { type: String, default: null },
    phone: { type: String, default: null },
    role: { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
    provider: { type: String, default: null },
  },
  { timestamps: true }
)

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: null },
    image: { type: String, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const ProductSchema = new mongoose.Schema(
  {
    uniqueId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    groupSlug: { type: String, default: null },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: String, default: null },
    foodType: { type: String, default: null },
    popularTags: { type: [String], default: [] },
    description: { type: String, required: true },
    shortDescription: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, default: null },
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, default: null },
    weight: { type: String, default: null },
    tags: { type: [String], default: [] },
    ingredients: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    images: { type: [String], default: [] },
    featuredImage: { type: String, default: null },
    bestSeller: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    discountType: { type: String, required: true },
    value: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
)

// ─── Get or Create Models ──────────────────────────────────

const User = mongoose.models.User || mongoose.model('User', UserSchema)
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema)
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema)

// ─── Helper ────────────────────────────────────────────────

function generateUniqueId(prefix: string, index: number): string {
  const letters = prefix.toUpperCase().slice(0, 3).padEnd(3, 'X')
  const num = String(index).padStart(3, '0')
  return `${letters}${num}`
}

// ─── Main Seed Function ───────────────────────────────────

async function main() {
  console.log('\n🌱 Seeding MongoDB database...\n')

  await mongoose.connect(MONGODB_URI!)
  console.log('✅ Connected to MongoDB\n')

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Coupon.deleteMany({}),
  ])
  console.log('🗑️  Cleared existing data')

  // ── Create Admin User ────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mithai.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456'
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const admin = await User.create({
    name: 'Admin',
    email: adminEmail,
    password: hashedPassword,
    role: 'ADMIN',
    phone: '+91 9876543210',
  })
  console.log(`✅ Admin user created: ${admin.email}`)

  // ── Create Categories ────────────────────────────────────
  const categories = await Category.insertMany([
    {
      name: 'Cookies',
      slug: 'cookies',
      description: 'Handcrafted healthy cookies made with premium nuts and cacao',
      active: true,
    },
    {
      name: 'Brownies',
      slug: 'brownies',
      description: 'Rich, fudgy brownies made with clean ingredients and no refined sugar',
      active: true,
    },
    {
      name: 'Cacao Bites',
      slug: 'cacao-bites',
      description: 'Bite-sized cacao treats packed with flavor and nutrition',
      active: true,
    },
    {
      name: 'Laddus',
      slug: 'laddus',
      description: 'Traditional Indian laddus reimagined with healthy, wholesome ingredients',
      active: true,
    },
    {
      name: 'Crackers',
      slug: 'crackers',
      description: 'Crunchy, savory crackers made with nutritious grains and seeds',
      active: true,
    },
  ])
  console.log(`✅ ${categories.length} categories created`)

  // ── Create Products ──────────────────────────────────────
  let productIdx = 1

  const productsData = [
    // ─── Cookies ─────────────────────────────────────────
    {
      uniqueId: generateUniqueId('COK', productIdx++),
      name: 'Almond Butter Cookie',
      slug: 'almond-butter-cookie',
      categoryId: categories[0]._id,
      foodType: 'Cookie',
      popularTags: ['Best Seller', 'Nutty', 'Guilt-Free'],
      description: 'Crunchy almond butter cookies made with real almond butter, oats, and a touch of honey. No refined sugar, no preservatives — just pure, nutty goodness in every bite.',
      shortDescription: 'Crunchy almond butter cookies with real almonds',
      price: 299,
      comparePrice: 399,
      stock: 100,
      weight: '200g',
      tags: ['cookies', 'almond', 'butter', 'healthy', 'sugar-free'],
      ingredients: ['Almond Butter', 'Oats', 'Honey', 'Coconut Oil', 'Vanilla Extract', 'Baking Soda', 'Sea Salt'],
      benefits: ['No Refined Sugar', 'High in Protein', 'Rich in Healthy Fats', 'No Preservatives'],
      images: [],
      bestSeller: true,
      featured: true,
      active: true,
      rating: 4.8,
      reviewCount: 124,
      salesCount: 280,
    },
    {
      uniqueId: generateUniqueId('COK', productIdx++),
      name: 'Walnut Cacao Cookie',
      slug: 'walnut-cacao-cookie',
      categoryId: categories[0]._id,
      foodType: 'Cookie',
      popularTags: ['Chocolatey', 'Crunchy', 'Superfood'],
      description: 'A heavenly combination of crunchy walnuts and rich cacao, baked to perfection. These cookies deliver a deep chocolate experience without the guilt.',
      shortDescription: 'Rich cacao cookies loaded with crunchy walnuts',
      price: 329,
      comparePrice: 429,
      stock: 80,
      weight: '200g',
      tags: ['cookies', 'walnut', 'cacao', 'chocolate', 'healthy'],
      ingredients: ['Walnuts', 'Raw Cacao', 'Whole Wheat Flour', 'Jaggery', 'Coconut Oil', 'Vanilla', 'Sea Salt'],
      benefits: ['Rich in Omega-3', 'Antioxidant-Rich Cacao', 'No Refined Sugar', 'No Maida'],
      images: [],
      bestSeller: true,
      featured: true,
      active: true,
      rating: 4.7,
      reviewCount: 98,
      salesCount: 215,
    },
    {
      uniqueId: generateUniqueId('COK', productIdx++),
      name: 'Butter Chocolate Cookie',
      slug: 'butter-chocolate-cookie',
      categoryId: categories[0]._id,
      foodType: 'Cookie',
      popularTags: ['Classic', 'Buttery', 'Indulgent'],
      description: 'Classic butter cookies infused with premium dark chocolate chunks. Made with grass-fed butter and sweetened with coconut sugar for a cleaner indulgence.',
      shortDescription: 'Classic buttery cookies with dark chocolate chunks',
      price: 279,
      comparePrice: 379,
      stock: 120,
      weight: '200g',
      tags: ['cookies', 'butter', 'chocolate', 'classic', 'healthy'],
      ingredients: ['Grass-Fed Butter', 'Dark Chocolate', 'Almond Flour', 'Coconut Sugar', 'Eggs', 'Vanilla Extract', 'Sea Salt'],
      benefits: ['No Refined Sugar', 'Real Dark Chocolate', 'No Artificial Flavors', 'Freshly Baked'],
      images: [],
      bestSeller: false,
      featured: true,
      active: true,
      rating: 4.6,
      reviewCount: 76,
      salesCount: 190,
    },

    // ─── Brownies ────────────────────────────────────────
    {
      uniqueId: generateUniqueId('BRW', productIdx++),
      name: 'Dark Chocolate Fudge Brownie',
      slug: 'dark-chocolate-fudge-brownie',
      categoryId: categories[1]._id,
      foodType: 'Brownie',
      popularTags: ['Best Seller', 'Fudgy', 'Rich'],
      description: 'Intensely fudgy brownies made with premium dark chocolate and zero refined sugar. Each bite is a rich, melt-in-your-mouth experience that feels indulgent yet stays clean.',
      shortDescription: 'Ultra-fudgy dark chocolate brownies, no refined sugar',
      price: 349,
      comparePrice: 449,
      stock: 90,
      weight: '250g',
      tags: ['brownies', 'dark-chocolate', 'fudge', 'healthy', 'sugar-free'],
      ingredients: ['Dark Chocolate (70%)', 'Almond Flour', 'Coconut Sugar', 'Eggs', 'Cocoa Powder', 'Coconut Oil', 'Vanilla', 'Sea Salt'],
      benefits: ['No Refined Sugar', 'Gluten-Free Option', 'Rich in Antioxidants', 'No Preservatives'],
      images: [],
      bestSeller: true,
      featured: true,
      active: true,
      rating: 4.9,
      reviewCount: 186,
      salesCount: 420,
    },
    {
      uniqueId: generateUniqueId('BRW', productIdx++),
      name: 'Walnut Fudge Brownie',
      slug: 'walnut-fudge-brownie',
      categoryId: categories[1]._id,
      foodType: 'Brownie',
      popularTags: ['Nutty', 'Fudgy', 'Premium'],
      description: 'Our signature fudge brownie topped with generous chunks of premium walnuts. The perfect marriage of rich chocolate and crunchy nuts.',
      shortDescription: 'Fudgy chocolate brownie loaded with walnut chunks',
      price: 379,
      comparePrice: 479,
      stock: 70,
      weight: '250g',
      tags: ['brownies', 'walnut', 'fudge', 'chocolate', 'healthy'],
      ingredients: ['Dark Chocolate', 'Walnuts', 'Almond Flour', 'Jaggery', 'Eggs', 'Butter', 'Cocoa Powder', 'Vanilla', 'Sea Salt'],
      benefits: ['Rich in Omega-3', 'No Refined Sugar', 'High in Protein', 'No Artificial Colors'],
      images: [],
      bestSeller: true,
      featured: false,
      active: true,
      rating: 4.8,
      reviewCount: 134,
      salesCount: 310,
    },
    {
      uniqueId: generateUniqueId('BRW', productIdx++),
      name: 'Brookie (Brownie + Cookie)',
      slug: 'brookie-brownie-cookie',
      categoryId: categories[1]._id,
      foodType: 'Brownie',
      popularTags: ['Unique', 'Best of Both', 'Must Try'],
      description: 'The ultimate hybrid — a crispy cookie base topped with a thick layer of fudgy brownie. Two classics combined into one irresistible treat.',
      shortDescription: 'Half cookie, half brownie — the best of both worlds',
      price: 399,
      comparePrice: 499,
      stock: 60,
      weight: '250g',
      tags: ['brookie', 'brownie', 'cookie', 'hybrid', 'unique', 'healthy'],
      ingredients: ['Dark Chocolate', 'Almond Butter', 'Oats', 'Coconut Sugar', 'Eggs', 'Almond Flour', 'Cocoa Powder', 'Vanilla', 'Sea Salt'],
      benefits: ['No Refined Sugar', 'Best of Both Worlds', 'No Preservatives', 'Freshly Made'],
      images: [],
      bestSeller: false,
      featured: true,
      active: true,
      rating: 4.7,
      reviewCount: 92,
      salesCount: 175,
    },

    // ─── Cacao Bites ─────────────────────────────────────
    {
      uniqueId: generateUniqueId('CCB', productIdx++),
      name: 'Rum Raisin Cacao Bites',
      slug: 'rum-raisin-cacao-bites',
      categoryId: categories[2]._id,
      foodType: 'Cacao Bites',
      popularTags: ['Unique', 'Boozy', 'Premium'],
      description: 'Luxurious cacao bites infused with rum-soaked raisins and coated in rich dark chocolate. A sophisticated treat for the discerning palate — no alcohol retained after baking.',
      shortDescription: 'Premium cacao bites with rum-soaked raisins',
      price: 449,
      comparePrice: 549,
      stock: 50,
      weight: '150g',
      tags: ['cacao-bites', 'rum', 'raisin', 'chocolate', 'premium'],
      ingredients: ['Raw Cacao', 'Raisins', 'Rum Extract', 'Dark Chocolate', 'Coconut Cream', 'Dates', 'Cocoa Butter', 'Sea Salt'],
      benefits: ['Rich in Antioxidants', 'No Refined Sugar', 'Energy Boosting', 'No Preservatives'],
      images: [],
      bestSeller: true,
      featured: true,
      active: true,
      rating: 4.9,
      reviewCount: 67,
      salesCount: 145,
    },
  ]

  const products = await Product.insertMany(productsData)
  console.log(`✅ ${products.length} products created`)

  // ── Create Coupons ───────────────────────────────────────
  const coupons = await Coupon.insertMany([
    {
      code: 'MITHAI10',
      description: '10% off on your first order',
      discountType: 'percentage',
      value: 10,
      minOrder: 300,
      maxDiscount: 100,
      usageLimit: 1000,
      perUserLimit: 1,
      active: true,
      expiryDate: new Date('2027-12-31'),
    },
    {
      code: 'HEALTHY20',
      description: '₹20 off on orders above ₹500',
      discountType: 'flat',
      value: 20,
      minOrder: 500,
      maxDiscount: null,
      usageLimit: 500,
      perUserLimit: 3,
      active: true,
      expiryDate: new Date('2027-09-30'),
    },
    {
      code: 'SWEET50',
      description: 'Flat ₹50 off on orders above ₹400',
      discountType: 'flat',
      value: 50,
      minOrder: 400,
      maxDiscount: null,
      usageLimit: 200,
      perUserLimit: 2,
      active: true,
      expiryDate: new Date('2027-08-15'),
    },
  ])
  console.log(`✅ ${coupons.length} coupons created`)

  // ── Summary ──────────────────────────────────────────────
  console.log('\n🎉 Database seeded successfully!')
  console.log(`\n📋 Summary:`)
  console.log(`   Admin: ${adminEmail} / ${adminPassword}`)
  console.log(`   Categories: ${categories.length}`)
  console.log(`   Products: ${products.length}`)
  console.log(`   Coupons: ${coupons.length}`)
  console.log(`\n   Categories:`)
  categories.forEach((c: { name: string }) => console.log(`     • ${c.name}`))
  console.log(`\n   Products:`)
  productsData.forEach((p) => console.log(`     • ${p.name}`))
}

// ─── Run ───────────────────────────────────────────────────

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => mongoose.disconnect())
