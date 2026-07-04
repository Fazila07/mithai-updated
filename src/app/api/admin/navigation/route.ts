import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import NavigationItem from '@/models/NavigationItem'

// Admin: fetch ALL navigation items (including disabled)
export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const items = await NavigationItem.find()
      .sort({ order: 1 })
      .lean()

    const serialized = items.map((item: any) => ({
      _id: item._id.toString(),
      id: item._id.toString(),
      title: item.title,
      slug: item.slug,
      destinationType: item.destinationType,
      destinationValue: item.destinationValue,
      order: item.order,
      enabled: item.enabled,
      icon: item.icon,
      createdAt: item.createdAt?.toISOString?.() || null,
      updatedAt: item.updatedAt?.toISOString?.() || null,
    }))

    return NextResponse.json({ items: serialized })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Admin: create a new navigation item
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const body = await req.json()

    if (!body.title || !body.destinationValue) {
      return NextResponse.json(
        { error: 'Title and destination are required' },
        { status: 400 }
      )
    }

    // Auto-generate slug from title if not provided
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Get the next order number
    const maxOrder = await NavigationItem.findOne().sort({ order: -1 }).lean()
    const nextOrder = body.order ?? ((maxOrder as any)?.order ?? 0) + 1

    const item = await NavigationItem.create({
      title: body.title,
      slug,
      destinationType: body.destinationType || 'page',
      destinationValue: body.destinationValue,
      order: nextOrder,
      enabled: body.enabled ?? true,
      icon: body.icon || null,
    })

    return NextResponse.json({
      item: {
        _id: item._id.toString(),
        id: item._id.toString(),
        title: item.title,
        slug: item.slug,
        destinationType: item.destinationType,
        destinationValue: item.destinationValue,
        order: item.order,
        enabled: item.enabled,
        icon: item.icon,
      },
    })
  } catch (err: any) {
    console.error(err)
    if (err.code === 11000) {
      return NextResponse.json({ error: 'A menu item with this slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
