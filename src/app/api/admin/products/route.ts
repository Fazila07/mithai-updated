import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import { productSchema } from '@/lib/validators'

/**
 * Generates a unique 6-character product ID: 3 letters + 3 digits
 */
async function generateUniqueProductId(name: string): Promise<string> {
  const letters = name
    .replace(/[^A-Za-z]/g, '')
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, 'X')

  const existing = await Product.find({ uniqueId: { $regex: `^${letters}` } })
    .select('uniqueId')
    .sort({ uniqueId: -1 })
    .limit(1)
    .lean()

  let nextNum = 1
  if (existing.length > 0) {
    const lastNum = parseInt(existing[0].uniqueId.slice(3), 10)
    nextNum = lastNum + 1
  }

  return `${letters}${String(nextNum).padStart(3, '0')}`
}

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? ''
    const category = searchParams.get('category') ?? ''
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const skip = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {}
    if (category) {
      filter.categoryId = category
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { uniqueId: { $regex: search, $options: 'i' } },
      ]
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('categoryId', '_id name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ])

    return NextResponse.json({
      products: products.map((p) => {
        const cat = p.categoryId as any
        return {
          ...p,
          _id: p._id.toString(),
          id: p._id.toString(),
          category: cat ? { id: cat._id?.toString(), name: cat.name, slug: cat.slug } : null,
          categoryId: cat?._id?.toString() || p.categoryId?.toString(),
        }
      }),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const body = await req.json()
    const result = productSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || 'Validation failed' }, { status: 400 })
    }

    const data = result.data

    // Check slug uniqueness
    const existing = await Product.findOne({ slug: data.slug })
    if (existing) {
      return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 })
    }

    // Auto-generate unique 6-char product ID
    const uniqueId = await generateUniqueProductId(data.name)

    const product = await Product.create({
      uniqueId,
      name: data.name,
      slug: data.slug,
      groupSlug: data.groupSlug,
      categoryId: data.categoryId,
      subcategory: data.subcategory,
      foodType: data.foodType,
      popularTags: data.popularTags,
      description: data.description,
      shortDescription: data.shortDescription,
      price: data.price,
      comparePrice: data.comparePrice,
      stock: data.stock,
      sku: data.sku,
      weight: data.weight,
      tags: data.tags,
      ingredients: data.ingredients,
      benefits: data.benefits,
      images: data.images,
      featuredImage: data.featuredImage,
      bestSeller: data.bestSeller,
      featured: data.featured,
      active: data.active,
    })

    const populated = await Product.findById(product._id)
      .populate('categoryId', '_id name slug')
      .lean()

    return NextResponse.json({ product: populated }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
