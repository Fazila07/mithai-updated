import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import Product from '@/models/Product'

export const dynamic = 'force-dynamic'

// ─── Auto-seed: create default categories + products if DB is empty ──

let seedAttempted = false

function generateUniqueId(prefix: string, index: number): string {
  const letters = prefix.toUpperCase().slice(0, 3).padEnd(3, 'X')
  const num = String(index).padStart(3, '0')
  return `${letters}${num}`
}

async function autoSeedIfEmpty() {
  if (seedAttempted) return
  seedAttempted = true

  const count = await Category.countDocuments()
  if (count > 0) return // DB already has categories

  console.log('🌱 Auto-seeding categories and products...')

  // ── Create Categories ────────────────────────────────────
  const categories = await Category.insertMany([
    {
      name: 'Cookies',
      slug: 'cookies',
      description: 'Handcrafted healthy cookies made with premium nuts and cacao',
      image: '/images/categories/cookies.png',
      active: true,
    },
    {
      name: 'Brownies',
      slug: 'brownies',
      description: 'Rich, fudgy brownies made with clean ingredients and no refined sugar',
      image: '/images/categories/brownies.jpg',
      active: true,
    },
    {
      name: 'Cacao Bites',
      slug: 'cacao-bites',
      description: 'Bite-sized cacao treats packed with flavor and nutrition',
      image: '/images/categories/cocoa-bites.jpg',
      active: true,
    },
    {
      name: 'Laddus',
      slug: 'laddus',
      description: 'Traditional Indian laddus reimagined with healthy, wholesome ingredients',
      image: '/images/categories/laddus.jpg',
      active: true,
    },
    {
      name: 'Crackers',
      slug: 'crackers',
      description: 'Crunchy, savory crackers made with nutritious grains and seeds',
      active: true,
    },
  ])

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

  await Product.insertMany(productsData)
  console.log(`✅ Auto-seeded ${categories.length} categories and ${productsData.length} products`)
}

// ─── Slug → local image mapping (for DB records missing the image field) ──
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'cookies': '/images/categories/cookies.png',
  'brownies': '/images/categories/brownies.jpg',
  'cacao-bites': '/images/categories/cocoa-bites.jpg',
  'cocoa-bites': '/images/categories/cocoa-bites.jpg',
  'laddus': '/images/categories/laddus.jpg',
}

// ─── GET /api/categories ──────────────────────────────────────

export async function GET() {
  try {
    await connectDB()

    // Auto-seed if database is empty (first run / fresh deployment)
    await autoSeedIfEmpty()

    const categories = await Category.find({ active: true })
      .sort({ name: 1 })
      .lean()

    // Get product count per category
    const counts = await Product.aggregate([
      { $match: { active: true } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ])
    const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]))

    return NextResponse.json({
      categories: categories.map((cat) => ({
        ...cat,
        _id: cat._id.toString(),
        id: cat._id.toString(),
        // Use DB image if set, otherwise fall back to local image by slug
        image: cat.image || CATEGORY_IMAGE_MAP[cat.slug] || null,
        _count: { products: countMap.get(cat._id.toString()) ?? 0 },
      })),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
