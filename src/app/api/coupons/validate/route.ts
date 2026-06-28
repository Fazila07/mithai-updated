import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Coupon from '@/models/Coupon'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { code, orderTotal } = await req.json()

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() })

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
    }

    if (!coupon.active) {
      return NextResponse.json({ error: 'This coupon is no longer active' }, { status: 400 })
    }

    if (new Date() > coupon.expiryDate) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 })
    }

    if (orderTotal && orderTotal < coupon.minOrder) {
      return NextResponse.json({
        error: `Minimum order value of ₹${coupon.minOrder} required for this coupon`,
      }, { status: 400 })
    }

    // Calculate discount
    let discount = 0
    if (coupon.discountType === 'percentage') {
      discount = (orderTotal || 0) * (coupon.value / 100)
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount
      }
    } else {
      discount = coupon.value
    }

    discount = Math.round(discount * 100) / 100

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon._id.toHexString(),
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        value: coupon.value,
        maxDiscount: coupon.maxDiscount,
        minOrder: coupon.minOrder,
      },
      discount,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
