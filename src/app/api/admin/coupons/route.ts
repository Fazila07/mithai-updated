import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import Coupon from '@/models/Coupon'
import { couponSchema } from '@/lib/validators'

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const skip = (page - 1) * limit
    const search = searchParams.get('search') ?? ''

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {}
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const [coupons, total] = await Promise.all([
      Coupon.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Coupon.countDocuments(filter),
    ])

    return NextResponse.json({
      coupons: coupons.map((c) => ({ ...c, id: c._id.toString(), _id: c._id.toString() })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const body = await req.json()
    const result = couponSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || 'Validation failed' }, { status: 400 })
    }

    const data = result.data

    // Check code uniqueness
    const existing = await Coupon.findOne({ code: data.code })
    if (existing) {
      return NextResponse.json({ error: 'A coupon with this code already exists' }, { status: 409 })
    }

    const coupon = await Coupon.create({
      code: data.code,
      description: data.description,
      discountType: data.discountType,
      value: data.value,
      minOrder: data.minOrder,
      maxDiscount: data.maxDiscount,
      usageLimit: data.usageLimit,
      perUserLimit: data.perUserLimit,
      active: data.active,
      expiryDate: data.expiryDate,
    })

    return NextResponse.json({ coupon }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
