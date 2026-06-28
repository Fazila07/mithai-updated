import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const product = await Product.findById(params.id)
      .populate('categoryId', '_id name slug')
      .lean()

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const cat = product.categoryId as any
    return NextResponse.json({
      product: {
        ...product,
        _id: product._id.toString(),
        id: product._id.toString(),
        category: cat ? { id: cat._id?.toString(), name: cat.name, slug: cat.slug } : null,
        categoryId: cat?._id?.toString() || product.categoryId?.toString(),
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const body = await req.json()

    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        $set: {
          name: body.name,
          slug: body.slug,
          categoryId: body.categoryId,
          subcategory: body.subcategory,
          description: body.description,
          shortDescription: body.shortDescription,
          price: typeof body.price === 'string' ? parseFloat(body.price) : body.price,
          comparePrice: body.comparePrice ? (typeof body.comparePrice === 'string' ? parseFloat(body.comparePrice) : body.comparePrice) : null,
          stock: typeof body.stock === 'string' ? parseInt(body.stock) : (body.stock ?? 0),
          sku: body.sku,
          weight: body.weight,
          tags: body.tags ?? [],
          ingredients: body.ingredients ?? [],
          benefits: body.benefits ?? [],
          images: body.images ?? [],
          featuredImage: body.featuredImage,
          bestSeller: body.bestSeller ?? false,
          featured: body.featured ?? false,
          active: body.active ?? true,
        },
      },
      { new: true }
    )
      .populate('categoryId', '_id name slug')
      .lean()

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const cat = product.categoryId as any
    return NextResponse.json({
      product: {
        ...product,
        _id: product._id.toString(),
        id: product._id.toString(),
        category: cat ? { id: cat._id?.toString(), name: cat.name, slug: cat.slug } : null,
        categoryId: cat?._id?.toString() || product.categoryId?.toString(),
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    await Product.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
