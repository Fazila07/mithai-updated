import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET() {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      orders: orders.map((o) => ({
        _id: o._id.toString(),
        orderNumber: o.orderNumber,
        total: o.total,
        subtotal: o.subtotal,
        shippingCharge: o.shippingCharge,
        tax: o.tax,
        discount: o.discount,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        couponCode: o.couponCode,
        notes: o.notes,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((i: any) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
          productId: i.productId?.toString(),
        })),
        shippingAddress: o.shippingAddress
          ? {
              street: o.shippingAddress.street,
              city: o.shippingAddress.city,
              state: o.shippingAddress.state,
              pincode: o.shippingAddress.pincode,
            }
          : null,
      })),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
