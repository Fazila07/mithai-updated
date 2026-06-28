// scripts/seed-products.js
// Run with: node scripts/seed-products.js
// Seeds categories + products into MongoDB using the correct schema

const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env.local')
  process.exit(1)
}

// ─── Schemas (must match src/models) ─────────────────────────

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: null },
    image: { type: String, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema)

const ProductSchema = new mongoose.Schema(
  {
    uniqueId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
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
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

// ─── Data ────────────────────────────────────────────────────

const CATEGORIES = [
  {
    name: 'Brownies',
    slug: 'brownies',
    description: 'Rich, fudgy brownies made with clean ingredients. No refined sugar, no maida.',
    image: '/images/walnut brownie.jpg',
    active: true,
  },
  {
    name: 'Cookies',
    slug: 'cookies',
    description: 'Crunchy, wholesome cookies baked with love. No preservatives.',
    image: '/images/chocochip cookies.jpg',
    active: true,
  },
  {
    name: 'Cacao Bites',
    slug: 'cacao-bites',
    description: 'Bite-sized cacao treats packed with flavour and goodness.',
    image: '/images/cocoa.jpeg',
    active: true,
  },
]

// Products grouped by category slug
const PRODUCTS_BY_CATEGORY = {
  brownies: [
    {
      uniqueId: 'BRO001',
      name: 'Dark Chocolate Fudge Brownie',
      slug: 'dark-chocolate-fudge-brownie',
      description: 'Intensely rich and fudgy brownie made with premium dark chocolate, sweetened with dates and jaggery. No refined sugar, no maida — just pure chocolate bliss.',
      shortDescription: 'Rich fudgy brownie with premium dark chocolate & dates',
      price: 349,
      comparePrice: 449,
      stock: 50,
      sku: 'MTH-BRO-001',
      weight: '200g',
      tags: ['brownies', 'chocolate', 'fudgy', 'sugar-free', 'no-maida'],
      ingredients: ['Dark Chocolate (70%)', 'Almond Flour', 'Dates', 'Eggs', 'Coconut Oil', 'Cocoa Powder', 'Vanilla Extract'],
      benefits: ['Zero refined sugar', 'No maida', 'Rich in antioxidants', 'PCOS friendly'],
      images: ['/images/walnut brownie.jpg'],
      bestSeller: true,
      featured: true,
      active: true,
      rating: 4.9,
      reviewCount: 42,
      popularTags: ['Best Seller', 'Must Try'],
    },
    {
      uniqueId: 'BRO002',
      name: 'Walnut Fudge Brownie',
      slug: 'walnut-fudge-brownie',
      description: 'Decadent fudge brownie loaded with crunchy walnuts, made with ragi flour and sweetened with jaggery. Every bite is a perfect balance of crunch and fudge.',
      shortDescription: 'Fudgy brownie loaded with premium walnuts',
      price: 399,
      comparePrice: 499,
      stock: 40,
      sku: 'MTH-BRO-002',
      weight: '200g',
      tags: ['brownies', 'walnut', 'fudgy', 'healthy'],
      ingredients: ['Dark Chocolate', 'Walnuts', 'Ragi Flour', 'Jaggery', 'Eggs', 'Coconut Oil', 'Cocoa Powder'],
      benefits: ['Rich in Omega-3', 'No refined sugar', 'No maida', 'Brain-boosting walnuts'],
      images: ['/images/walnut brownie.jpg'],
      bestSeller: true,
      featured: false,
      active: true,
      rating: 4.8,
      reviewCount: 35,
      popularTags: ['Best Seller'],
    },
    {
      uniqueId: 'BRO003',
      name: 'Brookie (Brownie + Cookie)',
      slug: 'brookie-brownie-cookie',
      description: 'The best of both worlds — a crispy cookie base topped with a fudgy brownie layer. Made with almond flour, dark chocolate, and sweetened naturally with dates.',
      shortDescription: 'Half brownie, half cookie — all delicious',
      price: 379,
      comparePrice: 479,
      stock: 35,
      sku: 'MTH-BRO-003',
      weight: '200g',
      tags: ['brownies', 'cookies', 'brookie', 'fusion', 'chocolate'],
      ingredients: ['Dark Chocolate', 'Almond Flour', 'Oat Flour', 'Dates', 'Butter', 'Eggs', 'Vanilla Extract'],
      benefits: ['No refined sugar', 'No maida', 'High protein', 'Unique fusion treat'],
      images: ['/images/chocochip cookies.jpg'],
      bestSeller: false,
      featured: true,
      active: true,
      rating: 4.7,
      reviewCount: 22,
      popularTags: ['New', 'Must Try'],
    },
  ],

  cookies: [
    {
      uniqueId: 'COO001',
      name: 'Almond Butter Cookie',
      slug: 'almond-butter-cookie',
      description: 'Crispy on the outside, chewy on the inside. Made with cold-pressed almond butter, jaggery, and a hint of vanilla. Guilt-free indulgence at its finest.',
      shortDescription: 'Crispy-chewy cookie with cold-pressed almond butter',
      price: 299,
      comparePrice: 399,
      stock: 60,
      sku: 'MTH-COO-001',
      weight: '200g',
      tags: ['cookies', 'almond', 'butter', 'jaggery', 'healthy'],
      ingredients: ['Almond Flour', 'Almond Butter', 'Jaggery', 'Coconut Oil', 'Vanilla Extract', 'Pink Salt', 'Baking Soda'],
      benefits: ['High protein', 'Gluten-free friendly', 'No refined sugar', 'No preservatives'],
      images: ['/images/almond flour.jpg'],
      bestSeller: true,
      featured: true,
      active: true,
      rating: 4.8,
      reviewCount: 28,
      popularTags: ['Best Seller'],
    },
    {
      uniqueId: 'COO002',
      name: 'Walnut Cacao Cookie',
      slug: 'walnut-cacao-cookie',
      description: 'A double delight of crunchy walnuts and rich cacao in every bite. Made with jowar flour and sweetened with dates. The healthiest cookie you will ever love.',
      shortDescription: 'Crunchy walnut cookie with rich cacao',
      price: 329,
      comparePrice: 429,
      stock: 45,
      sku: 'MTH-COO-002',
      weight: '200g',
      tags: ['cookies', 'walnut', 'cacao', 'jowar'],
      ingredients: ['Jowar Flour', 'Walnuts', 'Cacao Nibs', 'Dates', 'Coconut Oil', 'Vanilla Extract'],
      benefits: ['Rich in Omega-3', 'No refined sugar', 'No maida', 'Gut friendly'],
      images: ['/images/walnuts.jpg'],
      bestSeller: false,
      featured: true,
      active: true,
      rating: 4.6,
      reviewCount: 19,
      popularTags: ['Must Try'],
    },
    {
      uniqueId: 'COO003',
      name: 'Butter Chocolate Cookie',
      slug: 'butter-chocolate-cookie',
      description: 'Classic butter cookie meets premium dark chocolate chips. Made with ragi flour and sweetened with jaggery. Melt-in-your-mouth goodness without the guilt.',
      shortDescription: 'Buttery cookie loaded with dark chocolate chips',
      price: 319,
      comparePrice: 419,
      stock: 55,
      sku: 'MTH-COO-003',
      weight: '200g',
      tags: ['cookies', 'butter', 'chocolate', 'chocochip'],
      ingredients: ['Ragi Flour', 'Butter', 'Dark Chocolate Chips', 'Jaggery', 'Eggs', 'Vanilla Extract'],
      benefits: ['No refined sugar', 'No maida', 'Rich in calcium (ragi)', 'PCOS friendly'],
      images: ['/images/chocochip cookies.jpg'],
      bestSeller: true,
      featured: false,
      active: true,
      rating: 4.9,
      reviewCount: 31,
      popularTags: ['Best Seller', 'Must Try'],
    },
  ],

  'cacao-bites': [
    {
      uniqueId: 'CAC001',
      name: 'Rum Raisin Cacao Bites',
      slug: 'rum-raisin-cacao-bites',
      description: 'Luxurious bite-sized treats infused with rum-soaked raisins and coated in premium cacao. Made with dates, nuts, and zero refined sugar. A sophisticated indulgence.',
      shortDescription: 'Luxurious cacao bites with rum-soaked raisins',
      price: 359,
      comparePrice: 459,
      stock: 30,
      sku: 'MTH-CAC-001',
      weight: '150g',
      tags: ['cacao', 'rum', 'raisin', 'bites', 'premium'],
      ingredients: ['Cacao Powder', 'Dates', 'Raisins (rum-soaked)', 'Almonds', 'Coconut Oil', 'Vanilla Extract'],
      benefits: ['No refined sugar', 'Rich in antioxidants', 'Energy boosting', 'No preservatives'],
      images: ['/images/cocoa.jpeg'],
      bestSeller: false,
      featured: true,
      active: true,
      rating: 4.7,
      reviewCount: 15,
      popularTags: ['New', 'Premium'],
    },
  ],
}

// ─── Seed Function ───────────────────────────────────────────

async function seed() {
  console.log('🌱 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB\n')

  // 1. Seed categories
  console.log('📂 Seeding categories...')
  const categoryMap = {} // slug -> ObjectId

  for (const cat of CATEGORIES) {
    const result = await Category.findOneAndUpdate(
      { slug: cat.slug },
      cat,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    categoryMap[cat.slug] = result._id
    console.log(`   ✅ ${cat.name} (${result._id})`)
  }

  // 2. Seed products
  console.log('\n📦 Seeding products...')

  for (const [categorySlug, products] of Object.entries(PRODUCTS_BY_CATEGORY)) {
    const categoryId = categoryMap[categorySlug]
    if (!categoryId) {
      console.log(`   ⚠️  Category "${categorySlug}" not found, skipping...`)
      continue
    }

    console.log(`\n   ── ${categorySlug.toUpperCase()} ──`)

    for (const product of products) {
      const productData = {
        ...product,
        categoryId,
      }

      await Product.findOneAndUpdate(
        { slug: product.slug },
        productData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
      console.log(`   ✅ ${product.name} (₹${product.price})`)
    }
  }

  // 3. Summary
  const totalCategories = await Category.countDocuments()
  const totalProducts = await Product.countDocuments()

  console.log('\n' + '═'.repeat(50))
  console.log('🎉 Seed complete!')
  console.log(`   📂 Categories: ${totalCategories}`)
  console.log(`   📦 Products: ${totalProducts}`)
  console.log('═'.repeat(50))
  console.log('\n🌐 Visit http://localhost:3000 to see your products!')
  console.log('🔧 Admin: http://localhost:3000/admin/products\n')

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
