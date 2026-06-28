import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Wishlist from '@/models/Wishlist'

export const dynamic = 'force-dynamic'

// GET: Fetch user's wishlist
export async function GET() {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wishlistItems = await Wishlist.find({ userId: session.user.id })
      .populate({
        path: 'productId',
        populate: { path: 'categoryId', select: '_id name slug' },
      })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      items: wishlistItems.map((item) => {
        const product = item.productId as any
        return {
          id: item._id.toString(),
          product: product
            ? {
                ...product,
                _id: product._id.toString(),
                id: product._id.toString(),
                category: product.categoryId
                  ? { id: product.categoryId._id?.toString(), name: product.categoryId.name, slug: product.categoryId.slug }
                  : null,
                categoryId: product.categoryId?._id?.toString(),
              }
            : null,
        }
      }),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Toggle wishlist item (add if not exists, remove if exists)
export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await req.json()

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    // Check if already wishlisted
    const existing = await Wishlist.findOne({
      userId: session.user.id,
      productId,
    })

    if (existing) {
      // Remove from wishlist
      await Wishlist.deleteOne({ _id: existing._id })
      return NextResponse.json({ wishlisted: false })
    }

    // Add to wishlist
    await Wishlist.create({
      userId: session.user.id,
      productId,
    })

    return NextResponse.json({ wishlisted: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Remove from wishlist
export async function DELETE(req: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await req.json()

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    await Wishlist.deleteOne({ userId: session.user.id, productId })

    return NextResponse.json({ removed: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
