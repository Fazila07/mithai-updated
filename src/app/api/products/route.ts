import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') ?? ''
    const foodType = searchParams.get('foodType') ?? ''
    const popularTagsParam = searchParams.get('popularTags') ?? ''
    const tagsParam = searchParams.get('tags') ?? ''
    const featured = searchParams.get('featured') === 'true'
    const bestSeller = searchParams.get('bestSeller') === 'true'
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const search = searchParams.get('search') ?? ''
    const page = parseInt(searchParams.get('page') ?? '1')
    const sort = searchParams.get('sort') ?? 'recommended'
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const skip = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { active: true }

    // Category filter (by slug, supports comma-separated)
    // Normalizes input: lowercase, trim, replace spaces with hyphens
    // DB slugs are already lowercase so simple $in works
    if (category) {
      const categorySlugs = category.split(',').map((s) =>
        s.trim().toLowerCase().replace(/\s+/g, '-')
      )
      const cats = await Category.find({ slug: { $in: categorySlugs } }).select('_id')
      const catIds = cats.map((c) => c._id)
      if (catIds.length > 0) {
        filter.categoryId = catIds.length === 1 ? catIds[0] : { $in: catIds }
      } else {
        // No matching categories found — return empty set by using impossible filter
        filter.categoryId = null
      }
    }

    // Food type filter (supports comma-separated)
    if (foodType) {
      const foodTypes = foodType.split(',').map((s) => s.trim())
      filter.foodType = foodTypes.length === 1 ? foodTypes[0] : { $in: foodTypes }
    }

    // Popular tags filter (products must have ANY of these tags)
    if (popularTagsParam) {
      const popularTags = popularTagsParam.split(',').map((s) => s.trim())
      filter.popularTags = { $in: popularTags }
    }

    // General tags filter
    if (tagsParam) {
      const tags = tagsParam.split(',').map((s) => s.trim().toLowerCase())
      filter.tags = { $in: tags }
    }

    // Boolean filters
    if (featured) filter.featured = true
    if (bestSeller) filter.bestSeller = true

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {}
      if (minPrice !== undefined) filter.price.$gte = minPrice
      if (maxPrice !== undefined) filter.price.$lte = maxPrice
    }

    // Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [search.toLowerCase()] } },
        { uniqueId: { $regex: search, $options: 'i' } },
      ]
    }

    // Sort mapping
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sortObj: any
    switch (sort) {
      case 'price-asc':
        sortObj = { price: 1 }
        break
      case 'price-desc':
        sortObj = { price: -1 }
        break
      case 'bestseller':
        sortObj = { salesCount: -1 }
        break
      case 'must-try':
        sortObj = { salesCount: -1 }
        if (!popularTagsParam.includes('Must Try')) {
          if (filter.popularTags?.$in) {
            filter.popularTags.$in.push('Must Try')
          } else {
            filter.popularTags = { $in: ['Must Try'] }
          }
        }
        break
      case 'newest':
        sortObj = { createdAt: -1 }
        break
      case 'recommended':
      default:
        sortObj = { featured: -1, bestSeller: -1, rating: -1 }
        break
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('categoryId', 'id name slug')
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ])

    return NextResponse.json({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      products: products.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
        id: p._id.toString(),
        category: p.categoryId
          ? { id: p.categoryId._id?.toString(), name: p.categoryId.name, slug: p.categoryId.slug }
          : null,
        categoryId: typeof p.categoryId === 'object' ? p.categoryId._id?.toString() : p.categoryId?.toString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}