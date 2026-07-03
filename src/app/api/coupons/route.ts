import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Coupon from '@/models/Coupon'

// GET — Return all active, non-expired coupons for public display
export async function GET() {
  try {
    await connectDB()

    const now = new Date()
    const coupons = await Coupon.find({
      active: true,
      expiryDate: { $gte: now },
    })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      coupons: coupons.map((c) => ({
        id: c._id.toString(),
        code: c.code,
        description: c.description,
        discountType: c.discountType,
        value: c.value,
        minOrder: c.minOrder,
        maxDiscount: c.maxDiscount,
        expiryDate: c.expiryDate.toISOString(),
      })),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
