'use client'

import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { TrendingUp, ShoppingBag, IndianRupee, Calendar, BarChart3, Loader2 } from 'lucide-react'

interface TrendItem {
  label: string
  orders: number
  revenue: number
}

interface TopProduct {
  _id: string
  name: string
  salesCount: number
  price: number
  image: string | null
}

interface StatusCount {
  status: string
  count: number
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#eab308',
  CONFIRMED: '#3b82f6',
  IN_PROCESS: '#f97316',
  PACKED: '#a855f7',
  SHIPPED: '#06b6d4',
  DELIVERED: '#22c55e',
  CANCELLED: '#ef4444',
}

const PIE_COLORS = ['#eab308', '#3b82f6', '#f97316', '#a855f7', '#06b6d4', '#22c55e', '#ef4444']

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [trendData, setTrendData] = useState<TrendItem[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [todayStats, setTodayStats] = useState({ orders: 0, revenue: 0 })
  const [ordersByStatus, setOrdersByStatus] = useState<StatusCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/analytics?period=${period}`)
      .then((r) => r.json())
      .then((d) => {
        setTrendData(d.trendData || [])
        setTopProducts(d.topProducts || [])
        setTodayStats(d.todayStats || { orders: 0, revenue: 0 })
        setOrdersByStatus(d.ordersByStatus || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [period])

  const totalOrdersInPeriod = trendData.reduce((s, d) => s + d.orders, 0)
  const totalRevenueInPeriod = trendData.reduce((s, d) => s + d.revenue, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Trends</h1>
          <p className="text-sm text-gray-500 mt-1">Track your business performance over time</p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                period === p ? 'bg-white text-[#900c00] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p === 'week' ? 'Weekly' : p === 'month' ? 'Monthly' : 'Yearly'}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#900c00] flex items-center justify-center">
              <Calendar size={18} className="text-white" />
            </div>
            <p className="text-sm text-gray-500">Today&apos;s Orders</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{todayStats.orders}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <IndianRupee size={18} className="text-white" />
            </div>
            <p className="text-sm text-gray-500">Today&apos;s Revenue</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{todayStats.revenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <p className="text-sm text-gray-500">Period Orders</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalOrdersInPeriod}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <p className="text-sm text-gray-500">Period Revenue</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{totalRevenueInPeriod.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-gray-300" />
        </div>
      ) : (
        <>
          {/* Orders Trend Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-[#900c00]" />
              Orders Trend ({period === 'week' ? 'Weekly' : period === 'month' ? 'Monthly' : 'Yearly'})
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #eee', fontSize: 13 }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={((value: any, name: any) => [
                      name === 'revenue' ? `₹${Number(value).toLocaleString('en-IN')}` : value,
                      name === 'revenue' ? 'Revenue' : 'Orders',
                    ]) as any}
                  />
                  <Legend />
                  <Bar dataKey="orders" fill="#900c00" radius={[6, 6, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Trend Line */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              Revenue Trend
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #eee', fontSize: 13 }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={((value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']) as any}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#10b981' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Status Distribution */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Order Status Distribution</h2>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByStatus.map((s) => ({ name: s.status, value: s.count }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {ordersByStatus.map((s, i) => (
                        <Cell key={s.status} fill={STATUS_COLORS[s.status] || PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eee', fontSize: 13 }} />
                    <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Top Selling Products</h2>
              <div className="space-y-3 max-h-[320px] overflow-y-auto">
                {topProducts.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No sales data yet</p>
                ) : (
                  topProducts.map((p, idx) => (
                    <div key={p._id} className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        idx < 3 ? 'bg-[#900c00] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {idx + 1}
                      </span>
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">₹{p.price}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{p.salesCount} sold</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
