import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import Hamper from '@/models/Hamper'

// GET — List all hampers for admin
export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()
    const hampers = await Hamper.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean()

    return NextResponse.json({
      hampers: hampers.map((h) => ({
        _id: h._id.toString(),
        name: h.name,
        slug: h.slug,
        description: h.description,
        image: h.image,
        categorySlug: h.categorySlug,
        active: h.active,
        sortOrder: h.sortOrder,
        createdAt: h.createdAt?.toISOString?.() ?? h.createdAt,
      })),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST — Create a new hamper
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()
    const body = await req.json()

    const slug = body.name?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

    const hamper = await Hamper.create({
      name: body.name,
      slug: slug || body.slug,
      description: body.description || '',
      image: body.image || null,
      categorySlug: body.categorySlug || '',
      active: body.active ?? true,
      sortOrder: body.sortOrder ?? 0,
    })

    return NextResponse.json({ success: true, hamper: { _id: hamper._id.toString(), name: hamper.name } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE — Delete a hamper
export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await Hamper.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
