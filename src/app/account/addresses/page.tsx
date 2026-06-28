'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { MapPin, Plus, Trash2, Star, Loader2 } from 'lucide-react'

interface Address {
  id: string
  label?: string
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ label: '', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false })

  const fetchAddresses = () => {
    fetch('/api/user/addresses')
      .then((r) => r.json())
      .then((d) => setAddresses(d.addresses || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAddresses() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Address added!')
      setShowForm(false)
      setForm({ label: '', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false })
      fetchAddresses()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add address')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Address removed')
      setAddresses((prev) => prev.filter((a) => a.id !== id))
    } catch {
      toast.error('Failed to delete')
    }
  }

  const inputCls = "w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-mithai-maroon focus:ring-1 focus:ring-mithai-maroon/20 transition"

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-mithai-maroon" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-mithai-charcoal">Saved Addresses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-mithai-maroon text-white px-4 py-2.5 rounded-2xl text-sm font-semibold transition hover:bg-mithai-maroonL shadow-[0_4px_18px_rgba(144,12,0,0.25)]"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-[28px] border border-[rgba(107,31,31,0.1)] p-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
              <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={inputCls} placeholder="Home, Office..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1 *</label>
            <input type="text" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 2</label>
            <input type="text" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className={inputCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
              <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PIN Code *</label>
              <input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required className={inputCls} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="rounded" />
            Set as default address
          </label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl text-sm font-medium hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-mithai-maroon text-white px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-mithai-maroonL disabled:opacity-60 transition shadow-sm">
              {saving ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Save Address'}
            </button>
          </div>
        </form>
      )}

      {/* Address Cards */}
      {addresses.length === 0 && !showForm ? (
        <div className="bg-white rounded-[28px] border border-[rgba(107,31,31,0.1)] p-16 text-center">
          <MapPin size={48} className="mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-semibold text-mithai-charcoal mb-2">No addresses saved</h3>
          <p className="text-sm text-slate-400">Add an address for faster checkout</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-2xl border border-[rgba(107,31,31,0.08)] p-6 relative group">
              {addr.isDefault && (
                <span className="absolute top-4 right-4 flex items-center gap-1 bg-mithai-gold/10 text-mithai-gold px-2 py-0.5 rounded-full text-[10px] font-bold">
                  <Star size={10} /> DEFAULT
                </span>
              )}
              {addr.label && <p className="text-xs font-bold text-mithai-maroon uppercase tracking-wider mb-2">{addr.label}</p>}
              <p className="font-semibold text-mithai-charcoal">{addr.name}</p>
              <p className="text-sm text-slate-500 mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
              <p className="text-sm text-slate-500">{addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="text-sm text-slate-400 mt-1">📱 {addr.phone}</p>
              <button
                onClick={() => handleDelete(addr.id)}
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
