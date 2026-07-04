import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import NavigationItem from '@/models/NavigationItem'

// Public: fetch all enabled navigation items sorted by order
export async function GET() {
  try {
    await connectDB()

    const items = await NavigationItem.find({ enabled: true })
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
    }))

    return NextResponse.json({ items: serialized })
  } catch (err) {
    console.error('Failed to fetch navigation items:', err)
    return NextResponse.json({ items: [] })
  }
}
