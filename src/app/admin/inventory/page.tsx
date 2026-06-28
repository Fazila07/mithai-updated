'use client'

import { useEffect, useState } from 'react'
import { Package, Search, AlertTriangle, CheckCircle, Loader2, Minus, Plus, Save } from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  uniqueId: string
  name: string
  stock: number
  price: number
  active: boolean
  weight?: string
  images: string[]
  category: { name: string }
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')
  const [editingStock, setEditingStock] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/products?limit=200')
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = products.filter((p) => {
    if (search) {
      const q = search.toLowerCase()
      if (!p.name.toLowerCase().includes(q) && !p.uniqueId.toLowerCase().includes(q)) return false
    }
    if (filter === 'low') return p.stock > 0 && p.stock <= 10
    if (filter === 'out') return p.stock <= 0
    return true
  })

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length
  const outOfStockCount = products.filter((p) => p.stock <= 0).length

  const handleStockChange = (productId: string, newStock: number) => {
    setEditingStock((prev) => ({ ...prev, [productId]: Math.max(0, newStock) }))
  }

  const saveStock = async (productId: string) => {
    const newStock = editingStock[productId]
    if (newStock === undefined) return

    setSaving(productId)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      })
      if (res.ok) {
        setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, stock: newStock } : p))
        setEditingStock((prev) => {
          const next = { ...prev }
          delete next[productId]
          return next
        })
        toast.success('Stock updated')
      } else {
        toast.error('Failed to update stock')
      }
    } catch {
      toast.error('Failed to update stock')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor and update stock levels for all products</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-2xl p-5 border text-left transition-all ${
            filter === 'all' ? 'bg-white border-[#900c00] shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Package size={20} className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`rounded-2xl p-5 border text-left transition-all ${
            filter === 'low' ? 'bg-orange-50 border-orange-300 shadow-sm' : 'bg-white border-gray-100 hover:border-orange-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setFilter('out')}
          className={`rounded-2xl p-5 border text-left transition-all ${
            filter === 'out' ? 'bg-red-50 border-red-300 shadow-sm' : 'bg-white border-gray-100 hover:border-red-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
            </div>
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or product ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#900c00]/20 focus:border-[#900c00] transition"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-gray-300" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <CheckCircle size={40} className="mx-auto mb-3 text-green-400" />
            <p className="text-gray-500">
              {filter === 'all' ? 'No products found' : filter === 'low' ? 'No low stock products!' : 'No out of stock products!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-center">Current Stock</th>
                  <th className="px-6 py-3 text-center">Update</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((p) => {
                  const isEditing = editingStock[p.id] !== undefined
                  const displayStock = isEditing ? editingStock[p.id] : p.stock
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Package size={16} className="text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{p.name}</p>
                            {p.weight && <p className="text-xs text-gray-400">{p.weight}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{p.uniqueId}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{p.category?.name}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          p.stock <= 0 ? 'bg-red-100 text-red-700' :
                          p.stock <= 10 ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleStockChange(p.id, displayStock - 1)}
                            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                          >
                            <Minus size={12} />
                          </button>
                          <input
                            type="number"
                            value={displayStock}
                            onChange={(e) => handleStockChange(p.id, parseInt(e.target.value) || 0)}
                            className="w-16 text-center py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#900c00]"
                          />
                          <button
                            onClick={() => handleStockChange(p.id, displayStock + 1)}
                            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => saveStock(p.id)}
                          disabled={!isEditing || saving === p.id}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isEditing
                              ? 'bg-[#900c00] text-white hover:bg-[#b01600] shadow-sm'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {saving === p.id ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                          Save
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
