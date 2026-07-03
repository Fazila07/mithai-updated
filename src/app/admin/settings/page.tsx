'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Loader2, Save } from 'lucide-react'

interface Settings {
  storeName: string
  logoUrl: string
  supportEmail: string
  phone: string
  whatsapp: string
  shippingCharge: string
  freeShippingThreshold: string
  taxPercentage: string
}

const EMPTY: Settings = {
  storeName: 'Mithai 2.0',
  logoUrl: '', supportEmail: '', phone: '', whatsapp: '',
  shippingCharge: '50', freeShippingThreshold: '500',
  taxPercentage: '0',
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          const s = d.settings
          setForm({
            storeName: s.storeName ?? '',
            logoUrl: s.logoUrl ?? '',
            supportEmail: s.supportEmail ?? '',
            phone: s.phone ?? '',
            whatsapp: s.whatsapp ?? '',
            shippingCharge: String(s.shippingCharge ?? 50),
            freeShippingThreshold: String(s.freeShippingThreshold ?? 500),
            taxPercentage: String(s.taxPercentage ?? 0),
          })
        }
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          shippingCharge: parseFloat(form.shippingCharge) || 0,
          freeShippingThreshold: parseFloat(form.freeShippingThreshold) || 0,
          taxPercentage: parseFloat(form.taxPercentage) || 0,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const set = (k: keyof Settings, v: string) => setForm((f) => ({ ...f, [k]: v }))
  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#900c00]/20 focus:border-[#900c00] transition-all"
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#900c00]" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="max-w-3xl space-y-6">
      {/* Store Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Store Information</h2>
        <div>
          <label className={labelCls}>Store Name</label>
          <input type="text" value={form.storeName} onChange={(e) => set('storeName', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Logo URL</label>
          <input type="url" value={form.logoUrl} onChange={(e) => set('logoUrl', e.target.value)} className={inputCls} placeholder="https://..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Support Email</label>
            <input type="email" value={form.supportEmail} onChange={(e) => set('supportEmail', e.target.value)} className={inputCls} placeholder="support@mithai.com" />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} placeholder="+91 98765 43210" />
          </div>
        </div>
        <div>
          <label className={labelCls}>WhatsApp Number</label>
          <input type="tel" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} className={inputCls} placeholder="919876543210 (with country code, no +)" />
          <p className="text-xs text-gray-400 mt-1">Used for WhatsApp chat link</p>
        </div>
      </div>

      {/* Shipping & Tax */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Shipping & Tax</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Shipping Charge (₹)</label>
            <input type="number" value={form.shippingCharge} onChange={(e) => set('shippingCharge', e.target.value)} min="0" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Free Shipping Above (₹)</label>
            <input type="number" value={form.freeShippingThreshold} onChange={(e) => set('freeShippingThreshold', e.target.value)} min="0" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Tax (%)</label>
            <input type="number" value={form.taxPercentage} onChange={(e) => set('taxPercentage', e.target.value)} min="0" max="100" step="0.01" className={inputCls} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving}
          className="px-6 py-3 bg-[#900c00] text-white rounded-xl font-semibold text-sm hover:bg-[#b01600] disabled:opacity-60 transition-colors flex items-center gap-2 shadow-sm">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Settings
        </button>
      </div>
    </form>
  )
}
