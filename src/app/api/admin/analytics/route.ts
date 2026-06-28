import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') ?? 'week'

    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        break
      case 'week':
      default:
        startDate = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000)
        break
    }

    // Get all orders in the period
    const orders = await Order.find({
      createdAt: { $gte: startDate },
      paymentStatus: 'PAID',
    })
      .select('total createdAt')
      .sort({ createdAt: 1 })
      .lean()

    // Group by period
    const grouped: Record<string, { orders: number; revenue: number }> = {}

    orders.forEach((order) => {
      let key: string
      const d = new Date(order.createdAt)

      switch (period) {
        case 'year':
          key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          break
        case 'month':
          key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          break
        case 'week':
        default: {
          const day = d.getDay()
          const diff = d.getDate() - day + (day === 0 ? -6 : 1)
          const weekStart = new Date(d.getFullYear(), d.getMonth(), diff)
          key = weekStart.toISOString().split('T')[0]
          break
        }
      }

      if (!grouped[key]) grouped[key] = { orders: 0, revenue: 0 }
      grouped[key].orders += 1
      grouped[key].revenue += order.total
    })

    const trendData = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, data]) => ({
        label,
        orders: data.orders,
        revenue: Math.round(data.revenue),
      }))

    // Top selling products
    const topProducts = await Product.find({ active: true })
      .select('name salesCount price images')
      .sort({ salesCount: -1 })
      .limit(10)
      .lean()

    // Today's stats
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const [todayOrders, todayRevenueResult] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart }, paymentStatus: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ])

    // Orders by status
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    return NextResponse.json({
      trendData,
      topProducts: topProducts.map((p) => ({
        _id: p._id.toString(),
        name: p.name,
        salesCount: p.salesCount,
        price: p.price,
        image: p.images?.[0] || null,
      })),
      todayStats: {
        orders: todayOrders,
        revenue: todayRevenueResult[0]?.total ?? 0,
      },
      ordersByStatus: statusCounts.map((s) => ({
        status: s._id,
        count: s.count,
      })),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 })
  }
}
