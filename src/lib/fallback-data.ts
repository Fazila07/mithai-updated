/**
 * ─── Fallback Data ─────────────────────────────────────────
 * Static categories and products used when MongoDB is unreachable.
 * Matches the seed data exactly so the site always renders.
 */

export interface FallbackCategory {
  _id: string
  id: string
  name: string
  slug: string
  description: string
  image?: string
  _count?: { products: number }
}

export interface FallbackProduct {
  _id: string
  id: string
  uniqueId: string
  name: string
  slug: string
  groupSlug: string | null
  categoryId: string
  category: { id: string; name: string; slug: string }
  foodType: string
  popularTags: string[]
  description: string
  shortDescription: string
  price: number
  comparePrice: number | null
  stock: number
  weight: string
  tags: string[]
  ingredients: string[]
  benefits: string[]
  images: string[]
  bestSeller: boolean
  featured: boolean
  active: boolean
  rating: number
  reviewCount: number
  salesCount: number
  createdAt: string
  updatedAt: string
}

// ─── Categories ────────────────────────────────────────────

export const FALLBACK_CATEGORIES: FallbackCategory[] = [
  {
    _id: 'cat-cookies', id: 'cat-cookies',
    name: 'Cookies', slug: 'cookies',
    description: 'Handcrafted healthy cookies made with premium nuts and cacao',
    _count: { products: 3 },
  },
  {
    _id: 'cat-brownies', id: 'cat-brownies',
    name: 'Brownies', slug: 'brownies',
    description: 'Rich, fudgy brownies made with clean ingredients and no refined sugar',
    _count: { products: 3 },
  },
  {
    _id: 'cat-cacao-bites', id: 'cat-cacao-bites',
    name: 'Cacao Bites', slug: 'cacao-bites',
    description: 'Bite-sized cacao treats packed with flavor and nutrition',
    _count: { products: 1 },
  },
  {
    _id: 'cat-laddus', id: 'cat-laddus',
    name: 'Laddus', slug: 'laddus',
    description: 'Traditional Indian laddus reimagined with healthy, wholesome ingredients',
    _count: { products: 0 },
  },
  {
    _id: 'cat-crackers', id: 'cat-crackers',
    name: 'Crackers', slug: 'crackers',
    description: 'Crunchy, savory crackers made with nutritious grains and seeds',
    _count: { products: 0 },
  },
]

// ─── Products ──────────────────────────────────────────────

const now = new Date().toISOString()

export const FALLBACK_PRODUCTS: FallbackProduct[] = [
  // ─── Cookies ─────────────────────────────────────────
  {
    _id: 'prod-almond-butter-cookie', id: 'prod-almond-butter-cookie',
    uniqueId: 'COK001',
    name: 'Almond Butter Cookie',
    slug: 'almond-butter-cookie',
    groupSlug: null,
    categoryId: 'cat-cookies',
    category: { id: 'cat-cookies', name: 'Cookies', slug: 'cookies' },
    foodType: 'Cookie',
    popularTags: ['Best Seller', 'Nutty', 'Guilt-Free'],
    description: 'Crunchy almond butter cookies made with real almond butter, oats, and a touch of honey. No refined sugar, no preservatives — just pure, nutty goodness in every bite.',
    shortDescription: 'Crunchy almond butter cookies with real almonds',
    price: 299, comparePrice: 399, stock: 100, weight: '200g',
    tags: ['cookies', 'almond', 'butter', 'healthy', 'sugar-free'],
    ingredients: ['Almond Butter', 'Oats', 'Honey', 'Coconut Oil', 'Vanilla Extract', 'Baking Soda', 'Sea Salt'],
    benefits: ['No Refined Sugar', 'High in Protein', 'Rich in Healthy Fats', 'No Preservatives'],
    images: [], bestSeller: true, featured: true, active: true,
    rating: 4.8, reviewCount: 124, salesCount: 280,
    createdAt: now, updatedAt: now,
  },
  {
    _id: 'prod-walnut-cacao-cookie', id: 'prod-walnut-cacao-cookie',
    uniqueId: 'COK002',
    name: 'Walnut Cacao Cookie',
    slug: 'walnut-cacao-cookie',
    groupSlug: null,
    categoryId: 'cat-cookies',
    category: { id: 'cat-cookies', name: 'Cookies', slug: 'cookies' },
    foodType: 'Cookie',
    popularTags: ['Chocolatey', 'Crunchy', 'Superfood'],
    description: 'A heavenly combination of crunchy walnuts and rich cacao, baked to perfection. These cookies deliver a deep chocolate experience without the guilt.',
    shortDescription: 'Rich cacao cookies loaded with crunchy walnuts',
    price: 329, comparePrice: 429, stock: 80, weight: '200g',
    tags: ['cookies', 'walnut', 'cacao', 'chocolate', 'healthy'],
    ingredients: ['Walnuts', 'Raw Cacao', 'Whole Wheat Flour', 'Jaggery', 'Coconut Oil', 'Vanilla', 'Sea Salt'],
    benefits: ['Rich in Omega-3', 'Antioxidant-Rich Cacao', 'No Refined Sugar', 'No Maida'],
    images: [], bestSeller: true, featured: true, active: true,
    rating: 4.7, reviewCount: 98, salesCount: 215,
    createdAt: now, updatedAt: now,
  },
  {
    _id: 'prod-butter-chocolate-cookie', id: 'prod-butter-chocolate-cookie',
    uniqueId: 'COK003',
    name: 'Butter Chocolate Cookie',
    slug: 'butter-chocolate-cookie',
    groupSlug: null,
    categoryId: 'cat-cookies',
    category: { id: 'cat-cookies', name: 'Cookies', slug: 'cookies' },
    foodType: 'Cookie',
    popularTags: ['Classic', 'Buttery', 'Indulgent'],
    description: 'Classic butter cookies infused with premium dark chocolate chunks. Made with grass-fed butter and sweetened with coconut sugar for a cleaner indulgence.',
    shortDescription: 'Classic buttery cookies with dark chocolate chunks',
    price: 279, comparePrice: 379, stock: 120, weight: '200g',
    tags: ['cookies', 'butter', 'chocolate', 'classic', 'healthy'],
    ingredients: ['Grass-Fed Butter', 'Dark Chocolate', 'Almond Flour', 'Coconut Sugar', 'Eggs', 'Vanilla Extract', 'Sea Salt'],
    benefits: ['No Refined Sugar', 'Real Dark Chocolate', 'No Artificial Flavors', 'Freshly Baked'],
    images: [], bestSeller: false, featured: true, active: true,
    rating: 4.6, reviewCount: 76, salesCount: 190,
    createdAt: now, updatedAt: now,
  },

  // ─── Brownies ────────────────────────────────────────
  {
    _id: 'prod-dark-chocolate-fudge-brownie', id: 'prod-dark-chocolate-fudge-brownie',
    uniqueId: 'BRW001',
    name: 'Dark Chocolate Fudge Brownie',
    slug: 'dark-chocolate-fudge-brownie',
    groupSlug: null,
    categoryId: 'cat-brownies',
    category: { id: 'cat-brownies', name: 'Brownies', slug: 'brownies' },
    foodType: 'Brownie',
    popularTags: ['Best Seller', 'Fudgy', 'Rich'],
    description: 'Intensely fudgy brownies made with premium dark chocolate and zero refined sugar. Each bite is a rich, melt-in-your-mouth experience that feels indulgent yet stays clean.',
    shortDescription: 'Ultra-fudgy dark chocolate brownies, no refined sugar',
    price: 349, comparePrice: 449, stock: 90, weight: '250g',
    tags: ['brownies', 'dark-chocolate', 'fudge', 'healthy', 'sugar-free'],
    ingredients: ['Dark Chocolate (70%)', 'Almond Flour', 'Coconut Sugar', 'Eggs', 'Cocoa Powder', 'Coconut Oil', 'Vanilla', 'Sea Salt'],
    benefits: ['No Refined Sugar', 'Gluten-Free Option', 'Rich in Antioxidants', 'No Preservatives'],
    images: [], bestSeller: true, featured: true, active: true,
    rating: 4.9, reviewCount: 186, salesCount: 420,
    createdAt: now, updatedAt: now,
  },
  {
    _id: 'prod-walnut-fudge-brownie', id: 'prod-walnut-fudge-brownie',
    uniqueId: 'BRW002',
    name: 'Walnut Fudge Brownie',
    slug: 'walnut-fudge-brownie',
    groupSlug: null,
    categoryId: 'cat-brownies',
    category: { id: 'cat-brownies', name: 'Brownies', slug: 'brownies' },
    foodType: 'Brownie',
    popularTags: ['Nutty', 'Fudgy', 'Premium'],
    description: 'Our signature fudge brownie topped with generous chunks of premium walnuts. The perfect marriage of rich chocolate and crunchy nuts.',
    shortDescription: 'Fudgy chocolate brownie loaded with walnut chunks',
    price: 379, comparePrice: 479, stock: 70, weight: '250g',
    tags: ['brownies', 'walnut', 'fudge', 'chocolate', 'healthy'],
    ingredients: ['Dark Chocolate', 'Walnuts', 'Almond Flour', 'Jaggery', 'Eggs', 'Butter', 'Cocoa Powder', 'Vanilla', 'Sea Salt'],
    benefits: ['Rich in Omega-3', 'No Refined Sugar', 'High in Protein', 'No Artificial Colors'],
    images: [], bestSeller: true, featured: false, active: true,
    rating: 4.8, reviewCount: 134, salesCount: 310,
    createdAt: now, updatedAt: now,
  },
  {
    _id: 'prod-brookie', id: 'prod-brookie',
    uniqueId: 'BRW003',
    name: 'Brookie (Brownie + Cookie)',
    slug: 'brookie-brownie-cookie',
    groupSlug: null,
    categoryId: 'cat-brownies',
    category: { id: 'cat-brownies', name: 'Brownies', slug: 'brownies' },
    foodType: 'Brownie',
    popularTags: ['Unique', 'Best of Both', 'Must Try'],
    description: 'The ultimate hybrid — a crispy cookie base topped with a thick layer of fudgy brownie. Two classics combined into one irresistible treat.',
    shortDescription: 'Half cookie, half brownie — the best of both worlds',
    price: 399, comparePrice: 499, stock: 60, weight: '250g',
    tags: ['brookie', 'brownie', 'cookie', 'hybrid', 'unique', 'healthy'],
    ingredients: ['Dark Chocolate', 'Almond Butter', 'Oats', 'Coconut Sugar', 'Eggs', 'Almond Flour', 'Cocoa Powder', 'Vanilla', 'Sea Salt'],
    benefits: ['No Refined Sugar', 'Best of Both Worlds', 'No Preservatives', 'Freshly Made'],
    images: [], bestSeller: false, featured: true, active: true,
    rating: 4.7, reviewCount: 92, salesCount: 175,
    createdAt: now, updatedAt: now,
  },

  // ─── Cacao Bites ─────────────────────────────────────
  {
    _id: 'prod-rum-raisin-cacao-bites', id: 'prod-rum-raisin-cacao-bites',
    uniqueId: 'CCB001',
    name: 'Rum Raisin Cacao Bites',
    slug: 'rum-raisin-cacao-bites',
    groupSlug: null,
    categoryId: 'cat-cacao-bites',
    category: { id: 'cat-cacao-bites', name: 'Cacao Bites', slug: 'cacao-bites' },
    foodType: 'Cacao Bites',
    popularTags: ['Unique', 'Boozy', 'Premium'],
    description: 'Luxurious cacao bites infused with rum-soaked raisins and coated in rich dark chocolate. A sophisticated treat for the discerning palate — no alcohol retained after baking.',
    shortDescription: 'Premium cacao bites with rum-soaked raisins',
    price: 449, comparePrice: 549, stock: 50, weight: '150g',
    tags: ['cacao-bites', 'rum', 'raisin', 'chocolate', 'premium'],
    ingredients: ['Raw Cacao', 'Raisins', 'Rum Extract', 'Dark Chocolate', 'Coconut Cream', 'Dates', 'Cocoa Butter', 'Sea Salt'],
    benefits: ['Rich in Antioxidants', 'No Refined Sugar', 'Energy Boosting', 'No Preservatives'],
    images: [], bestSeller: true, featured: true, active: true,
    rating: 4.9, reviewCount: 67, salesCount: 145,
    createdAt: now, updatedAt: now,
  },
]

// ─── Helper: filter fallback products by query params ──────

export function filterFallbackProducts(params: {
  category?: string
  search?: string
  bestSeller?: boolean
  featured?: boolean
  limit?: number
}): { products: FallbackProduct[]; total: number } {
  let filtered = [...FALLBACK_PRODUCTS]

  if (params.category) {
    const slugs = params.category.split(',').map(s => s.trim())
    filtered = filtered.filter(p => slugs.includes(p.category.slug))
  }

  if (params.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    )
  }

  if (params.bestSeller) {
    filtered = filtered.filter(p => p.bestSeller)
  }

  if (params.featured) {
    filtered = filtered.filter(p => p.featured)
  }

  const total = filtered.length
  const limit = params.limit ?? 20
  return { products: filtered.slice(0, limit), total }
}

// ─── Helper: find fallback product by slug ─────────────────

export function findFallbackProduct(slugOrId: string): FallbackProduct | undefined {
  return FALLBACK_PRODUCTS.find(
    p => p.slug === slugOrId || p._id === slugOrId || p.uniqueId === slugOrId
  )
}
