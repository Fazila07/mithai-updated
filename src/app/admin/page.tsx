'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Package,
  ShoppingBag,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'

interface Stats {
  totalProducts: number
  activeProducts: number
  totalOrders: number
  pendingOrders: number
  packedOrders: number
  deliveredOrders: number
  totalRevenue: number
  totalCustomers: number
  todayOrders: number
  todayRevenue: number
  monthRevenue: number
}

interface Order {
  _id: string
  orderNumber: string
  customer: { name: string; email: string; phone: string }
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  items: { name: string; quantity: number }[]
}

interface LowStockProduct {
  _id: string
  name: string
  stock: number
  category: string
  price: number
  images: string[]
}

interface TopProduct {
  rank: number
  productId: string
  name: string
  image: string
  totalSold: number
  totalRevenue: number
}

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  'In Process': 'bg-orange-100 text-orange-700',
  IN_PROCESS: 'bg-orange-100 text-orange-700',
  Packed: 'bg-purple-100 text-purple-700',
  PACKED: 'bg-purple-100 text-purple-700',
  Shipped: 'bg-cyan-100 text-cyan-700',
  SHIPPED: 'bg-cyan-100 text-cyan-700',
  Delivered: 'bg-green-100 text-green-700',
  DELIVERED: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function SkeletonStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8dcc8] animate-pulse">
          <div className="h-3 bg-[#e8dcc8] rounded w-2/3 mb-3" />
          <div className="h-7 bg-[#e8dcc8] rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return }
        setStats(d.stats)
        setRecentOrders(d.recentOrders)
        setLowStock(d.lowStockProducts)
        setTopProducts(d.topProducts ?? [])
      })
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false))
  }, [])

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-8 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <p className="text-sm text-red-400 mt-1">Make sure your DATABASE_URL is set in .env.local</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-[#3d1c1c] font-serif">Dashboard</h1>

      {/* Top Stats — 4 Columns */}
      {loading ? (
        <SkeletonStatCards />
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8dcc8]">
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#900c00] mb-1">Total Revenue</p>
            <p className="text-2xl lg:text-3xl font-bold text-[#3d1c1c]">{formatCurrency(stats.totalRevenue)}</p>
          </div>

          {/* Today's Revenue */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8dcc8]">
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#900c00] mb-1">Today&apos;s Revenue</p>
            <p className="text-2xl lg:text-3xl font-bold text-[#3d1c1c]">{formatCurrency(stats.todayRevenue)}</p>
            <p className="text-xs text-[#8a7a6a] mt-1">{stats.todayOrders} orders today</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8dcc8]">
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#900c00] mb-1">Total Orders</p>
            <p className="text-2xl lg:text-3xl font-bold text-[#3d1c1c]">{stats.totalOrders}</p>
            {stats.pendingOrders > 0 && (
              <p className="text-xs text-orange-500 font-semibold mt-1">{stats.pendingOrders} pending</p>
            )}
          </div>

          {/* Customers */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8dcc8]">
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#900c00] mb-1">Customers</p>
            <p className="text-2xl lg:text-3xl font-bold text-[#3d1c1c]">{stats.totalCustomers}</p>
          </div>
        </div>
      ) : null}

      {/* Second Row — Active Products & This Month */}
      {!loading && stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8dcc8]">
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#900c00] mb-1">Active Products</p>
            <p className="text-2xl lg:text-3xl font-bold text-[#3d1c1c]">{stats.activeProducts}</p>
            {lowStock.length > 0 && (
              <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                <AlertTriangle size={12} />
                {lowStock.length} low stock
              </p>
            )}
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e8dcc8]">
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#900c00] mb-1">This Month</p>
            <p className="text-2xl lg:text-3xl font-bold text-[#3d1c1c]">{formatCurrency(stats.monthRevenue)}</p>
          </div>
        </div>
      )}

      {/* Main Content — Recent Orders + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Recent Orders — Takes 3 cols */}
        <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-[#e8dcc8] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8dcc8]">
            <h2 className="text-lg font-bold text-[#3d1c1c] font-serif">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-[#900c00] font-medium flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 bg-[#f5efe4] rounded animate-pulse" />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="p-10 text-center text-[#8a7a6a]">
                <ShoppingBag size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-[#faf4e8] text-[11px] text-[#8a7a6a] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Order</th>
                    <th className="px-6 py-3 text-left font-semibold">Customer</th>
                    <th className="px-6 py-3 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e8d8]">
                  {recentOrders.slice(0, 8).map((order) => (
                    <tr key={order._id} className="hover:bg-[#fdf8f0] transition-colors">
                      <td className="px-6 py-3">
                        <Link href="/admin/orders" className="font-mono text-xs text-[#900c00] font-bold hover:underline">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-3">
                        <p className="font-medium text-[#3d1c1c]">{order.customer.name}</p>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {order.status.charAt(0) + order.status.slice(1).toLowerCase().replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Products — Takes 2 cols */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-[#e8dcc8] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8dcc8]">
            <h2 className="text-lg font-bold text-[#3d1c1c] font-serif">Top Products</h2>
            <Link
              href="/admin/products"
              className="text-sm text-[#900c00] font-medium flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-[#f0e8d8]">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-[#f5efe4] rounded animate-pulse" />
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <div className="p-10 text-center text-[#8a7a6a]">
                <Package size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No sales data yet</p>
              </div>
            ) : (
              topProducts.map((product) => (
                <div key={product.productId ?? product.rank} className="flex items-center gap-3 px-6 py-3">
                  {/* Rank Badge */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    product.rank === 1
                      ? 'bg-[#900c00] text-white'
                      : product.rank === 2
                        ? 'bg-[#ffa520] text-white'
                        : 'bg-[#e8dcc8] text-[#3d1c1c]'
                  }`}>
                    {product.rank}
                  </div>

                  {/* Product Image */}
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-[#e8dcc8]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#f5efe4] flex items-center justify-center flex-shrink-0">
                      <Package size={16} className="text-[#8a7a6a]" />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#3d1c1c] truncate">{product.name}</p>
                    <p className="text-xs text-[#8a7a6a]">
                      {product.totalSold} sold · {formatCurrency(product.totalRevenue)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {!loading && lowStock.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8dcc8] overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-[#e8dcc8]">
            <AlertTriangle size={16} className="text-orange-500" />
            <h2 className="text-lg font-bold text-[#3d1c1c] font-serif">Low Stock Alert</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 divide-y sm:divide-y-0 divide-[#f0e8d8]">
            {lowStock.map((p) => (
              <div key={p._id} className="flex items-center gap-3 px-6 py-3">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-[#e8dcc8]" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#f5efe4] flex items-center justify-center flex-shrink-0">
                    <Package size={16} className="text-[#8a7a6a]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#3d1c1c] truncate">{p.name}</p>
                  <span className={`text-xs font-bold ${p.stock === 0 ? 'text-red-600' : 'text-orange-500'}`}>
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-[#e8dcc8]">
            <Link href="/admin/products" className="text-sm text-[#900c00] font-medium flex items-center gap-1 hover:underline">
              Manage products <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}