import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import Address from '@/models/Address'

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? ''
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const skip = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { role: 'CUSTOMER' }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search } },
      ]
    }

    const [customers, total] = await Promise.all([
      User.find(filter)
        .select('name email phone image createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ])

    // Get order counts and addresses for each customer
    const enriched = await Promise.all(
      customers.map(async (c) => {
        const [orderCount, addresses] = await Promise.all([
          Order.countDocuments({ userId: c._id }),
          Address.find({ userId: c._id }).lean(),
        ])
        return {
          id: c._id.toString(),
          name: c.name,
          email: c.email,
          phone: c.phone,
          image: c.image,
          createdAt: c.createdAt,
          _count: { orders: orderCount },
          addresses: addresses.map((a) => ({ ...a, id: a._id.toString() })),
        }
      })
    )

    return NextResponse.json({ customers: enriched, total, page, totalPages: Math.ceil(total / limit) })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
