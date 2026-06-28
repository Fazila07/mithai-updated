'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Search, Filter, ChevronLeft, ChevronRight, Eye, X, Loader2, Download } from 'lucide-react'

interface OrderItem { name: string; quantity: number; price: number; image: string }
interface Order {
  _id: string
  orderNumber: string
  customer: { name: string; email: string; phone: string }
  shippingAddress: { street: string; city: string; state: string; pincode: string }
  items: OrderItem[]
  subtotal: number
  shippingCharge: number
  tax: number
  total: number
  discount: number
  paymentStatus: string
  paymentMethod: string
  status: string
  couponCode?: string
  notes?: string
  createdAt: string
}

const ORDER_STATUSES = ['', 'PENDING', 'CONFIRMED', 'IN_PROCESS', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending', CONFIRMED: 'Confirmed', IN_PROCESS: 'In Process',
  PACKED: 'Packed', SHIPPED: 'Shipped', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
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
  PENDING: 'text-yellow-600',
  PAID: 'text-green-600',
  FAILED: 'text-red-600',
  REFUNDED: 'text-blue-600',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [bulkStatus, setBulkStatus] = useState('')
  const [viewOrder, setViewOrder] = useState<Order | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20', search, status: statusFilter })
    try {
      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()
      setOrders(data.orders ?? [])
      setTotalPages(data.totalPages ?? 1)
      setTotal(data.total ?? 0)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      toast.success(`Status updated to ${status}`)
      if (viewOrder?._id === id) setViewOrder((o) => o ? { ...o, status } : null)
      fetchOrders()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleBulkStatus = async () => {
    if (!selected.length || !bulkStatus) return
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selected, status: bulkStatus }),
      })
      if (!res.ok) throw new Error()
      toast.success(`Updated ${selected.length} orders`)
      setSelected([])
      setBulkStatus('')
      fetchOrders()
    } catch {
      toast.error('Bulk update failed')
    }
  }

  const exportCSV = () => {
    const headers = ['Order #', 'Customer', 'Email', 'Phone', 'Items', 'Total', 'Payment', 'Status', 'Date']
    const rows = orders.map((o) => [
      o.orderNumber,
      o.customer.name,
      o.customer.email,
      o.customer.phone,
      o.items.length,
      o.total,
      o.paymentStatus,
      o.status,
      new Date(o.createdAt).toLocaleDateString('en-IN'),
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleSelect = (id: string) =>
    setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
  const allSelected = orders.length > 0 && selected.length === orders.length

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name, phone, order #..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#900c00]/20 focus:border-[#900c00]" />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              className="pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white">
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          {selected.length > 0 && (
            <div className="flex gap-2 items-center">
              <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white">
                <option value="">Set status...</option>
                {ORDER_STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={handleBulkStatus} disabled={!bulkStatus}
                className="px-4 py-2.5 bg-[#900c00] text-white rounded-xl text-sm font-medium hover:bg-[#b01600] disabled:opacity-50 transition-colors">
                Apply ({selected.length})
              </button>
            </div>
          )}
          <button onClick={exportCSV}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">{total} total orders</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={allSelected}
                    onChange={() => setSelected(allSelected ? [] : orders.map((o) => o._id))} className="rounded" />
                </th>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Payment</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20 mx-auto" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-gray-400">
                    <p className="font-medium">No orders found</p>
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className={`hover:bg-gray-50 transition-colors ${selected.includes(o._id) ? 'bg-[#900c00]/5' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(o._id)} onChange={() => toggleSelect(o._id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-[#900c00] font-bold">#{o.orderNumber}</p>
                      <p className="text-[10px] text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{o.customer.name}</p>
                      <p className="text-[10px] text-gray-400">{o.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {o.items.slice(0, 2).map((item, i) => (
                        <p key={i} className="truncate max-w-[140px]">{item.name} ×{item.quantity}</p>
                      ))}
                      {o.items.length > 2 && <p className="text-gray-400">+{o.items.length - 2} more</p>}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">₹{o.total.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold ${PAYMENT_COLORS[o.paymentStatus] ?? 'text-gray-500'}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="relative inline-block">
                        {updatingId === o._id ? (
                          <Loader2 size={16} className="animate-spin mx-auto text-gray-400" />
                        ) : (
                          <select value={o.status}
                            onChange={(e) => updateStatus(o._id, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {ORDER_STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{STATUS_LABELS[s] ?? s}</option>)}
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setViewOrder(o)}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#900c00] hover:bg-[#900c00]/10 transition-all">
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900">Order #{viewOrder.orderNumber}</h2>
                <p className="text-xs text-gray-400">{new Date(viewOrder.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => setViewOrder(null)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Customer</p>
                  <p className="font-semibold text-gray-800">{viewOrder.customer.name}</p>
                  <p className="text-sm text-gray-500">{viewOrder.customer.email}</p>
                  <p className="text-sm text-gray-500">{viewOrder.customer.phone}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Shipping Address</p>
                  <p className="text-sm text-gray-700">{viewOrder.shippingAddress.street}</p>
                  <p className="text-sm text-gray-700">{viewOrder.shippingAddress.city}, {viewOrder.shippingAddress.pincode}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Items</p>
                <div className="space-y-2">
                  {viewOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{viewOrder.subtotal}</span></div>
                <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span>₹{viewOrder.shippingCharge}</span></div>
                {viewOrder.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount ({viewOrder.couponCode})</span><span>-₹{viewOrder.discount}</span></div>}
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2"><span>Total</span><span>₹{viewOrder.total}</span></div>
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Update Status</label>
                  <select value={viewOrder.status}
                    onChange={(e) => updateStatus(viewOrder._id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none">
                    {ORDER_STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Payment</p>
                  <span className={`text-sm font-semibold ${PAYMENT_COLORS[viewOrder.paymentStatus]}`}>{viewOrder.paymentStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
