'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Loader2, Save } from 'lucide-react'

export default function AccountPage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? '')
      setPhone(session.user.phone ?? '')
    }
  }, [session])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await update({ name, phone })
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[28px] border border-[rgba(107,31,31,0.1)] p-8">
        <h2 className="text-xl font-semibold text-mithai-charcoal mb-6">Profile Information</h2>
        <form onSubmit={handleSave} className="space-y-5 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-mithai-maroon focus:ring-1 focus:ring-mithai-maroon/20 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email" value={session?.user?.email ?? ''} disabled
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
            <input
              type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-mithai-maroon focus:ring-1 focus:ring-mithai-maroon/20 transition"
              placeholder="+91 98765 43210"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="flex items-center gap-2 bg-mithai-maroon text-white px-6 py-3 rounded-2xl text-sm font-semibold transition hover:bg-mithai-maroonL disabled:opacity-60 shadow-[0_4px_18px_rgba(144,12,0,0.25)]"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
