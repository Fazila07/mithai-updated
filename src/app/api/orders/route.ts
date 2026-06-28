import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { orderSchema } from '@/lib/validators'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  return NextResponse.json({ message: 'Orders API — use POST to create an order' })
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()
    const result = orderSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || 'Validation failed' }, { status: 400 })
    }

    const data = result.data
    const session = await getServerSession(authOptions)

    // Generate order number
    const count = await Order.countDocuments()
    const orderNumber = `MTH${String(count + 1).padStart(5, '0')}`

    const order = await Order.create({
      orderNumber,
      userId: session?.user?.id || null,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      subtotal: data.subtotal,
      shippingCharge: data.shippingCharge,
      tax: data.tax,
      discount: data.discount,
      total: data.total,
      paymentMethod: data.paymentMethod,
      couponCode: data.couponCode,
      notes: data.notes,
      items: data.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      shippingAddress: {
        street: data.shippingAddress.street,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        pincode: data.shippingAddress.pincode,
      },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}