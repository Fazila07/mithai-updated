import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Hamper from '@/models/Hamper'

// GET — Return active hampers for public display
export async function GET() {
  try {
    await connectDB()

    const hampers = await Hamper.find({ active: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean()

    return NextResponse.json({
      hampers: hampers.map((h) => ({
        _id: h._id.toString(),
        name: h.name,
        slug: h.slug,
        description: h.description,
        image: h.image,
        categorySlug: h.categorySlug,
      })),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
