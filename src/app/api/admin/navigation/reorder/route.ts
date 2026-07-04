import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import NavigationItem from '@/models/NavigationItem'

// Admin: bulk reorder navigation items
export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()
    const body = await req.json()

    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 })
    }

    // Bulk update order for all items
    const bulkOps = body.items.map((item: { id: string; order: number }) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }))

    await NavigationItem.bulkWrite(bulkOps)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
