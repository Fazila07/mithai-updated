'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, Tag, X, Loader2 } from 'lucide-react'

type DiscountType = 'percentage' | 'flat'

interface Coupon {
  id: string
  code: string
  description?: string
  discountType: DiscountType
  value: number
  minOrder: number
  maxDiscount?: number | null
  usageLimit?: number | null
  usedCount: number
  perUserLimit: number
  expiryDate: string
  active: boolean
}

interface CouponForm {
  code: string
  description: string
  discountType: DiscountType
  value: string
  minOrder: string
  maxDiscount: string
  usageLimit: string
  perUserLimit: string
  expiryDate: string
  active: boolean
}

const EMPTY_FORM: CouponForm = {
  code: '', description: '', discountType: 'percentage', value: '',
  minOrder: '', maxDiscount: '', usageLimit: '', perUserLimit: '1',
  expiryDate: '', active: true,
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [form, setForm] = useState<CouponForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchCoupons = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/coupons')
      const data = await res.json()
      setCoupons(data.coupons ?? [])
    } catch {
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCoupons() }, [fetchCoupons])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (c: Coupon) => {
    setEditing(c)
    setForm({
      code: c.code,
      description: c.description || '',
      discountType: c.discountType,
      value: String(c.value),
      minOrder: String(c.minOrder),
      maxDiscount: c.maxDiscount ? String(c.maxDiscount) : '',
      usageLimit: c.usageLimit ? String(c.usageLimit) : '',
      perUserLimit: String(c.perUserLimit),
      expiryDate: c.expiryDate.split('T')[0],
      active: c.active,
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = {
        code: form.code,
        description: form.description || undefined,
        discountType: form.discountType,
        value: parseFloat(form.value),
        minOrder: parseFloat(form.minOrder) || 0,
        maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
        perUserLimit: parseInt(form.perUserLimit) || 1,
        expiryDate: form.expiryDate,
        active: form.active,
      }
      const url = editing ? `/api/admin/coupons/${editing.id}` : '/api/admin/coupons'
      const method = editing ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(editing ? 'Coupon updated!' : 'Coupon created!')
      setShowModal(false)
      fetchCoupons()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' })
      toast.success('Coupon deleted')
      fetchCoupons()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleActive = async (c: Coupon) => {
    try {
      await fetch(`/api/admin/coupons/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !c.active }),
      })
      fetchCoupons()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }))
  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#900c00]/20 focus:border-[#900c00] transition"
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5"

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={openCreate}
          className="px-4 py-2.5 bg-[#900c00] text-white rounded-xl text-sm font-medium hover:bg-[#b01600] transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Code</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Discount</th>
                <th className="px-6 py-3 text-right">Min. Order</th>
                <th className="px-6 py-3 text-left">Expiry</th>
                <th className="px-6 py-3 text-center">Usage</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-gray-400">
                    <Tag size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No coupons yet</p>
                    <p className="text-xs mt-1">Create your first coupon to get started</p>
                  </td>
                </tr>
              ) : (
                coupons.map((c) => {
                  const expired = new Date(c.expiryDate) < new Date()
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-[#900c00] bg-[#900c00]/10 px-2.5 py-1 rounded-lg">
                          {c.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">
                        {c.description || '—'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {c.discountType === 'percentage' ? `${c.value}%` : `₹${c.value}`} off
                        {c.maxDiscount && c.discountType === 'percentage' && (
                          <span className="block text-xs text-gray-400 font-normal">max ₹{c.maxDiscount}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500">
                        {c.minOrder > 0 ? `₹${c.minOrder}` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={expired ? 'text-red-500' : 'text-gray-600'}>
                          {new Date(c.expiryDate).toLocaleDateString('en-IN')}
                          {expired && <span className="block text-[10px]">(Expired)</span>}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500">
                        {c.usedCount} / {c.usageLimit == null ? '∞' : c.usageLimit}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(c)}
                          className={`relative w-10 h-5 rounded-full transition-colors ${c.active && !expired ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${c.active && !expired ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => openEdit(c)}
                            className="p-2 rounded-lg text-gray-400 hover:text-[#900c00] hover:bg-[#900c00]/10 transition-all">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all">
                            {deleting === c.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editing ? 'Edit Coupon' : 'New Coupon'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Coupon Code *</label>
                <input type="text" value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())}
                  required className={`${inputCls} font-mono uppercase tracking-wider`} placeholder="WELCOME10" disabled={!!editing} />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <input type="text" value={form.description} onChange={(e) => set('description', e.target.value)}
                  className={inputCls} placeholder="10% off on first order" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Discount Type *</label>
                  <select value={form.discountType} onChange={(e) => set('discountType', e.target.value)} className={inputCls}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Value *</label>
                  <input type="number" value={form.value} onChange={(e) => set('value', e.target.value)}
                    required min="0" step="0.01" className={inputCls} placeholder={form.discountType === 'percentage' ? '10' : '50'} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Min. Order (₹)</label>
                  <input type="number" value={form.minOrder} onChange={(e) => set('minOrder', e.target.value)}
                    min="0" className={inputCls} placeholder="0" />
                </div>
                <div>
                  <label className={labelCls}>Max Discount (₹)</label>
                  <input type="number" value={form.maxDiscount} onChange={(e) => set('maxDiscount', e.target.value)}
                    min="0" className={inputCls} placeholder="Cap for % coupons" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Usage Limit</label>
                  <input type="number" value={form.usageLimit} onChange={(e) => set('usageLimit', e.target.value)}
                    min="0" className={inputCls} placeholder="∞ if empty" />
                </div>
                <div>
                  <label className={labelCls}>Per User Limit</label>
                  <input type="number" value={form.perUserLimit} onChange={(e) => set('perUserLimit', e.target.value)}
                    min="1" className={inputCls} placeholder="1" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Expiry Date *</label>
                <input type="date" value={form.expiryDate} onChange={(e) => set('expiryDate', e.target.value)}
                  required className={inputCls} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Active</span>
                <button type="button" onClick={() => set('active', !form.active)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.active ? 'bg-[#900c00]' : 'bg-gray-200'}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.active ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-[#900c00] text-white rounded-xl text-sm font-semibold hover:bg-[#b01600] disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editing ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
