import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import type { OrderStatusType } from '@/models/Order'

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search') ?? ''
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const skip = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {}
    if (status) filter.status = status
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search } },
      ]
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ])

    return NextResponse.json({
      orders: orders.map((o) => ({
        _id: o._id.toString(),
        orderNumber: o.orderNumber,
        customer: { name: o.customerName, email: o.customerEmail, phone: o.customerPhone },
        shippingAddress: o.shippingAddress ?? { street: '', city: '', state: '', pincode: '' },
        items: o.items,
        subtotal: o.subtotal,
        shippingCharge: o.shippingCharge,
        tax: o.tax,
        discount: o.discount,
        total: o.total,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        razorpayOrderId: o.razorpayOrderId,
        razorpayPaymentId: o.razorpayPaymentId,
        couponCode: o.couponCode,
        notes: o.notes,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const { ids, status } = await req.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No order IDs provided' }, { status: 400 })
    }

    const validStatuses: OrderStatusType[] = ['PENDING', 'CONFIRMED', 'IN_PROCESS', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    await Order.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    )

    return NextResponse.json({ success: true, updated: ids.length })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
