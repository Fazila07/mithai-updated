import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import type { OrderStatusType } from '@/models/Order'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const { status } = await req.json()

    const validStatuses: OrderStatusType[] = ['PENDING', 'CONFIRMED', 'IN_PROCESS', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const order = await Order.findByIdAndUpdate(
      params.id,
      { $set: { status } },
      { new: true }
    ).lean()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      order: {
        ...order,
        _id: order._id.toString(),
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
