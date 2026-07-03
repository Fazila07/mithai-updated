import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'

// GET — Fetch approved reviews (optionally by productId)
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '20')

    const filter: Record<string, any> = { approved: true }
    if (productId) filter.productId = productId

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        _id: r._id.toString(),
        userName: r.userName,
        userImage: r.userImage,
        rating: r.rating,
        title: r.title,
        text: r.text,
        createdAt: r.createdAt.toISOString(),
      })),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST — Create a new review (requires auth)
export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Please sign in to leave a review' }, { status: 401 })
    }

    const body = await req.json()
    const { rating, title, text, productId } = body

    if (!rating || !text) {
      return NextResponse.json({ error: 'Rating and review text are required' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    if (text.length > 1000) {
      return NextResponse.json({ error: 'Review text must be under 1000 characters' }, { status: 400 })
    }

    const review = await Review.create({
      userId: session.user.id,
      userName: session.user.name || 'Anonymous',
      userImage: session.user.image || undefined,
      productId: productId || undefined,
      rating,
      title: title || undefined,
      text,
      approved: false, // Admin must approve
    })

    return NextResponse.json({
      success: true,
      review: {
        _id: review._id.toHexString(),
        rating: review.rating,
        text: review.text,
        approved: review.approved,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
