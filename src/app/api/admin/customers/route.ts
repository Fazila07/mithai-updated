import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'

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

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('name email phone image createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ])

    // Enrich each customer with order stats
    const customers = await Promise.all(
      users.map(async (c) => {
        const orderStats = await Order.aggregate([
          { $match: { userId: c._id.toString() } },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalSpent: { $sum: '$total' },
              lastOrderDate: { $max: '$createdAt' },
            },
          },
        ])

        const stats = orderStats[0] || { totalOrders: 0, totalSpent: 0, lastOrderDate: null }

        return {
          _id: c._id.toString(),
          name: c.name,
          email: c.email,
          phone: c.phone,
          createdAt: c.createdAt?.toISOString?.() ?? c.createdAt,
          totalOrders: stats.totalOrders,
          totalSpent: stats.totalSpent,
          lastOrderDate: stats.lastOrderDate?.toISOString?.() ?? stats.lastOrderDate ?? null,
        }
      })
    )

    return NextResponse.json({
      customers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
