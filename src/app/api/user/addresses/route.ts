import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Address from '@/models/Address'
import { addressSchema } from '@/lib/validators'

export async function GET() {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const addresses = await Address.find({ userId: session.user.id })
      .sort({ isDefault: -1 })
      .lean()

    return NextResponse.json({
      addresses: addresses.map((a) => ({
        ...a,
        id: a._id.toString(),
        _id: a._id.toString(),
      })),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const result = addressSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 })
    }

    // If setting as default, unset other defaults
    if (result.data.isDefault) {
      await Address.updateMany(
        { userId: session.user.id },
        { $set: { isDefault: false } }
      )
    }

    const address = await Address.create({
      ...result.data,
      userId: session.user.id,
    })

    return NextResponse.json({
      address: {
        ...address.toObject(),
        id: address._id.toHexString(),
        _id: address._id.toHexString(),
      },
    }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
