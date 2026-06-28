import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import Product from '@/models/Product'

export async function GET() {
  try {
    await connectDB()

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
        _count: { products: countMap.get(cat._id.toString()) ?? 0 },
      })),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
