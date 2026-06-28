import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import Order from '@/models/Order'
import User from '@/models/User'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const [
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      packedOrders,
      deliveredOrders,
      totalCustomers,
      revenueResult,
      todayOrderCount,
      todayRevenueResult,
      monthRevenueResult,
      recentOrders,
      lowStockProducts,
      topProductsAgg,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ active: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'PENDING' }),
      Order.countDocuments({ status: 'PACKED' }),
      Order.countDocuments({ status: 'DELIVERED' }),
      User.countDocuments({ role: 'CUSTOMER' }),
      Order.aggregate([
        { $match: { paymentStatus: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      Order.aggregate([
        { $match: { paymentStatus: 'PAID', createdAt: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'PAID', createdAt: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Product.find({ stock: { $lte: 10 }, active: true })
        .sort({ stock: 1 })
        .limit(10)
        .lean(),
      // Top products — aggregate from order items
      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            name: { $first: '$items.name' },
            image: { $first: '$items.image' },
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ]),
    ])

    return NextResponse.json({
      stats: {
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        packedOrders,
        deliveredOrders,
        totalRevenue: revenueResult[0]?.total ?? 0,
        totalCustomers,
        todayOrders: todayOrderCount,
        todayRevenue: todayRevenueResult[0]?.total ?? 0,
        monthRevenue: monthRevenueResult[0]?.total ?? 0,
      },
      recentOrders: recentOrders.map((o) => ({
        _id: o._id.toString(),
        orderNumber: o.orderNumber,
        customer: { name: o.customerName, email: o.customerEmail, phone: o.customerPhone },
        total: o.total,
        status: o.status,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((i: { name: string; quantity: number }) => ({ name: i.name, quantity: i.quantity })),
      })),
      lowStockProducts: lowStockProducts.map((p) => ({
        _id: p._id.toString(),
        name: p.name,
        stock: p.stock,
        category: p.categoryId?.toString(),
        price: p.price,
        images: p.images,
      })),
      topProducts: topProductsAgg.map((p, i: number) => ({
        rank: i + 1,
        productId: p._id?.toString(),
        name: p.name,
        image: p.image,
        totalSold: p.totalSold,
        totalRevenue: p.totalRevenue,
      })),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
