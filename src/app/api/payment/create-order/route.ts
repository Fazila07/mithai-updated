import { NextRequest, NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'

export async function POST(req: NextRequest) {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Online payments are not configured. Please use Cash on Delivery.' },
        { status: 503 }
      )
    }

    const { amount } = await req.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (err) {
    console.error('Razorpay create order error:', err)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}