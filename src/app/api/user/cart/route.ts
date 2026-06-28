import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Cart from '@/models/Cart'
import Product from '@/models/Product'

export const dynamic = 'force-dynamic'

// GET: Fetch user's cart with product details
export async function GET() {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartItems = await Cart.find({ userId: session.user.id })
      .populate({
        path: 'productId',
        populate: { path: 'categoryId', select: '_id name slug' },
      })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      items: cartItems.map((item) => {
        const product = item.productId as any
        return {
          id: item._id.toString(),
          quantity: item.quantity,
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

// POST: Add item to cart or update quantity
export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity = 1 } = await req.json()

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    // Check product exists
    const product = await Product.findById(productId)
    if (!product || !product.active) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Upsert: add or update quantity
    const cartItem = await Cart.findOneAndUpdate(
      { userId: session.user.id, productId },
      { $inc: { quantity } },
      { upsert: true, new: true }
    )

    const populated = await Cart.findById(cartItem._id)
      .populate({
        path: 'productId',
        populate: { path: 'categoryId', select: '_id name slug' },
      })
      .lean()

    const pop = populated?.productId as any

    return NextResponse.json({
      item: {
        id: populated?._id.toString(),
        quantity: populated?.quantity,
        product: pop
          ? {
              ...pop,
              _id: pop._id.toString(),
              id: pop._id.toString(),
              category: pop.categoryId
                ? { id: pop.categoryId._id?.toString(), name: pop.categoryId.name, slug: pop.categoryId.slug }
                : null,
              categoryId: pop.categoryId?._id?.toString(),
            }
          : null,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH: Set exact quantity for a cart item
export async function PATCH(req: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity } = await req.json()

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: 'productId and quantity are required' }, { status: 400 })
    }

    if (quantity <= 0) {
      // Remove if quantity is 0 or less
      await Cart.deleteOne({ userId: session.user.id, productId })
      return NextResponse.json({ removed: true })
    }

    await Cart.updateOne(
      { userId: session.user.id, productId },
      { $set: { quantity } }
    )

    return NextResponse.json({ success: true, quantity })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Remove item from cart
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

    await Cart.deleteOne({ userId: session.user.id, productId })

    return NextResponse.json({ removed: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
