'use client'

import { useState, useEffect } from 'react'
import { Package, ChevronRight } from 'lucide-react'

interface Order {
  _id: string
  orderNumber: string
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  items: { name: string; quantity: number }[]
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  IN_PROCESS: 'bg-orange-100 text-orange-700',
  PACKED: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-cyan-100 text-cyan-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/orders')
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-[28px] border border-[rgba(107,31,31,0.1)] p-16 text-center">
        <Package size={48} className="mx-auto mb-4 text-slate-300" />
        <h2 className="text-xl font-semibold text-mithai-charcoal mb-2">No orders yet</h2>
        <p className="text-sm text-slate-400">Start shopping to see your orders here!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="bg-white rounded-2xl border border-[rgba(107,31,31,0.08)] p-6 hover:shadow-mithai transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-mono text-sm font-bold text-mithai-maroon">#{order.orderNumber}</span>
              <span className="text-xs text-slate-400 ml-3">
                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
              {order.status.replace('_', ' ')}
            </span>
          </div>
          <div className="text-sm text-slate-500 mb-3">
            {order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-mithai-charcoal">₹{order.total.toLocaleString('en-IN')}</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              Details <ChevronRight size={12} />
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
