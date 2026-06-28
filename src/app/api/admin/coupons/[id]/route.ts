import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import Coupon from '@/models/Coupon'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const coupon = await Coupon.findById(params.id).lean()
    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
    }
    return NextResponse.json({ coupon: { ...coupon, id: coupon._id.toString() } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const body = await req.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: any = {}
    if (body.description !== undefined) update.description = body.description
    if (body.discountType !== undefined) update.discountType = body.discountType
    if (body.value !== undefined) update.value = body.value
    if (body.minOrder !== undefined) update.minOrder = body.minOrder
    if (body.maxDiscount !== undefined) update.maxDiscount = body.maxDiscount
    if (body.usageLimit !== undefined) update.usageLimit = body.usageLimit
    if (body.perUserLimit !== undefined) update.perUserLimit = body.perUserLimit
    if (body.active !== undefined) update.active = body.active
    if (body.expiryDate !== undefined) update.expiryDate = new Date(body.expiryDate)

    const coupon = await Coupon.findByIdAndUpdate(
      params.id,
      { $set: update },
      { new: true }
    ).lean()

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
    }

    return NextResponse.json({ coupon: { ...coupon, id: coupon._id.toString() } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    await Coupon.findByIdAndDelete(params.id)
    return NextResponse.json({ deleted: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
