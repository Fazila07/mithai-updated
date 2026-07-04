'use client'

import { useState, useEffect } from 'react'
import { Package, ChevronDown, MapPin, CreditCard, Tag } from 'lucide-react'

interface OrderItem {
  name: string
  quantity: number
  price: number
  image?: string
  productId?: string
}

interface ShippingAddress {
  street: string
  city: string
  state: string
  pincode: string
}

interface Order {
  _id: string
  orderNumber: string
  total: number
  subtotal: number
  shippingCharge: number
  tax: number
  discount: number
  status: string
  paymentStatus: string
  paymentMethod: string
  couponCode?: string
  notes?: string
  createdAt: string
  items: OrderItem[]
  shippingAddress: ShippingAddress | null
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

const PAYMENT_COLORS: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  FAILED: 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/user/orders')
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

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
        <h2 className="text-xl font-semibold text-mithai-maroon mb-2">No orders yet</h2>
        <p className="text-sm text-slate-400">Start shopping to see your orders here!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isExpanded = expandedId === order._id
        return (
          <div
            key={order._id}
            className="bg-white rounded-2xl border border-[rgba(107,31,31,0.08)] overflow-hidden hover:shadow-mithai transition-shadow"
          >
            {/* Order Header — always visible & clickable */}
            <button
              onClick={() => toggleExpand(order._id)}
              className="w-full text-left p-5 sm:p-6 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-mono text-sm font-bold text-mithai-maroon">
                    #{order.orderNumber}
                  </span>
                  <span className="text-xs text-slate-400 ml-3">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                    STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-sm text-slate-500 mb-3">
                {order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-mithai-maroon">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-mithai-maroon font-semibold flex items-center gap-1">
                  {isExpanded ? 'Hide' : 'View'} Details
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </span>
              </div>
            </button>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="border-t border-[rgba(107,31,31,0.08)] bg-[#fdfaf5]">
                {/* Items List */}
                <div className="p-5 sm:p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Items
                  </h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-[rgba(107,31,31,0.08)]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <Package size={16} className="text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400">
                          Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-slate-700 flex-shrink-0">
                        ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown + Shipping + Payment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4 border-t border-[rgba(107,31,31,0.06)]">
                  {/* Price Breakdown */}
                  <div className="p-5 sm:p-6 space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Price Breakdown
                    </h4>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Subtotal</span>
                      <span>₹{(order.subtotal || 0).toLocaleString('en-IN')}</span>
                    </div>
                    {(order.shippingCharge || 0) > 0 && (
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Shipping</span>
                        <span>₹{order.shippingCharge.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {(order.tax || 0) > 0 && (
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Tax</span>
                        <span>₹{order.tax.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {(order.discount || 0) > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span className="flex items-center gap-1">
                          <Tag size={12} /> Discount
                          {order.couponCode && (
                            <span className="text-[10px] bg-green-100 px-1.5 py-0.5 rounded font-mono">
                              {order.couponCode}
                            </span>
                          )}
                        </span>
                        <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-slate-800 pt-2 border-t border-dashed border-slate-200">
                      <span>Total</span>
                      <span>₹{order.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Shipping Address + Payment */}
                  <div className="p-5 sm:p-6 space-y-4 border-t sm:border-t-0 sm:border-l border-[rgba(107,31,31,0.06)]">
                    {order.shippingAddress && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <MapPin size={12} /> Shipping Address
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {order.shippingAddress.street}
                          <br />
                          {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                          {order.shippingAddress.pincode}
                        </p>
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CreditCard size={12} /> Payment
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 capitalize">
                          {order.paymentMethod || 'Online'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            PAYMENT_COLORS[order.paymentStatus] ?? 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                    {order.notes && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Notes
                        </h4>
                        <p className="text-sm text-slate-500 italic">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
