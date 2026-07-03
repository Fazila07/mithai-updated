import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'

// GET — List all reviews for admin (with pagination)
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // 'approved', 'pending', or null for all

    const filter: Record<string, any> = {}
    if (status === 'approved') filter.approved = true
    if (status === 'pending') filter.approved = false

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ])

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        _id: r._id.toString(),
        userId: r.userId.toString(),
        userName: r.userName,
        userImage: r.userImage,
        productId: r.productId?.toString(),
        rating: r.rating,
        title: r.title,
        text: r.text,
        approved: r.approved,
        createdAt: r.createdAt.toISOString(),
      })),
      pagination: { total, pages: Math.ceil(total / limit), page },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH — Approve or reject a review
export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const body = await req.json()
    const { reviewId, approved } = body

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 })
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $set: { approved: !!approved } },
      { new: true }
    ).lean()

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, review: { _id: review._id.toString(), approved: review.approved } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE — Delete a review
export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const reviewId = searchParams.get('id')

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 })
    }

    await Review.findByIdAndDelete(reviewId)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
