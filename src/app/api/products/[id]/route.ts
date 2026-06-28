import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import mongoose from 'mongoose'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    // Try to find by MongoDB _id, slug, or uniqueId
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orConditions: any[] = [
      { slug: params.id },
      { uniqueId: params.id },
    ]
    if (mongoose.Types.ObjectId.isValid(params.id)) {
      orConditions.push({ _id: params.id })
    }

    const product = await Product.findOne({
      $or: orConditions,
      active: true,
    })
      .populate('categoryId', '_id name slug')
      .lean()

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Fetch size variants if groupSlug exists
    let sizeVariants: { id: string; slug: string; weight: string | null; price: number; comparePrice: number | null; stock: number }[] = []
    if (product.groupSlug) {
      const variants = await Product.find({
        groupSlug: product.groupSlug,
        active: true,
      })
        .select('_id slug weight price comparePrice stock')
        .sort({ price: 1 })
        .lean()

      sizeVariants = variants.map((v) => ({
        id: v._id.toString(),
        slug: v.slug,
        weight: v.weight,
        price: v.price,
        comparePrice: v.comparePrice,
        stock: v.stock,
      }))
    }

    const cat = product.categoryId as any

    return NextResponse.json({
      product: {
        ...product,
        _id: product._id.toString(),
        id: product._id.toString(),
        category: cat ? { id: cat._id?.toString(), name: cat.name, slug: cat.slug } : null,
        categoryId: cat?._id?.toString() || product.categoryId?.toString(),
        sizeVariants,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}