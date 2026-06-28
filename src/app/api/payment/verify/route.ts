import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import { orderSchema } from '@/lib/validators'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Validate order data
    const result = orderSchema.safeParse(orderData)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || 'Invalid order data' }, { status: 400 })
    }

    const data = result.data

    // Generate order number
    const count = await Order.countDocuments()
    const orderNumber = `MTH${String(count + 1).padStart(5, '0')}`

    // Create order in database
    const order = await Order.create({
      orderNumber,
      userId: body.userId || null,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      subtotal: data.subtotal,
      shippingCharge: data.shippingCharge,
      tax: data.tax,
      discount: data.discount,
      total: data.total,
      paymentMethod: 'razorpay',
      paymentStatus: 'PAID',
      status: 'CONFIRMED',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
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

    // Update stock using atomic $inc
    for (const item of data.items) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity, salesCount: item.quantity } }
      )
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order._id.toHexString(),
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      },
    })
  } catch (err) {
    console.error('Payment verification error:', err)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}