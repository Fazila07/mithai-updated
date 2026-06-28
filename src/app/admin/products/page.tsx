'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  Plus, Search, Filter, Edit2, Trash2, Copy,
  Package, ChevronLeft, ChevronRight, Loader2, AlertTriangle, ToggleLeft, ToggleRight
} from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  categoryId: string
  category: { id: string; name: string; slug: string }
  price: number
  comparePrice?: number | null
  stock: number
  active: boolean
  featured: boolean
  bestSeller: boolean
  images: string[]
  weight?: string
  createdAt: string
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch categories for filter dropdown
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {})
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '15', search })
    if (categoryFilter) params.set('category', categoryFilter)
    try {
      const res = await fetch(`/api/admin/products?${params}`)
      const data = await res.json()
      setProducts(data.products ?? [])
      setTotalPages(data.totalPages ?? 1)
      setTotal(data.total ?? 0)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [page, search, categoryFilter])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Product deleted')
      setDeleteTarget(null)
      fetchProducts()
    } catch {
      toast.error('Failed to delete product')
    } finally {
      setDeleting(false)
    }
  }

  const handleBulkDelete = async () => {
    if (!selected.length) return
    if (!confirm(`Delete ${selected.length} products?`)) return
    try {
      await Promise.all(selected.map((id) => fetch(`/api/admin/products/${id}`, { method: 'DELETE' })))
      toast.success(`Deleted ${selected.length} products`)
      setSelected([])
      fetchProducts()
    } catch {
      toast.error('Bulk delete failed')
    }
  }

  const toggleField = async (id: string, field: 'active' | 'bestSeller' | 'featured', current: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !current }),
      })
      if (!res.ok) throw new Error()
      toast.success(`${field === 'bestSeller' ? 'Best Seller' : field === 'featured' ? 'Featured' : 'Active'} ${!current ? 'enabled' : 'disabled'}`)
      fetchProducts()
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleDuplicate = async (product: Product) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${product.name} (Copy)`,
          slug: `${product.slug}-copy-${Date.now()}`,
          categoryId: product.categoryId,
          description: '',
          price: product.price,
          comparePrice: product.comparePrice,
          stock: product.stock,
          weight: product.weight,
          images: product.images,
          bestSeller: false,
          featured: false,
          active: false,
          tags: [],
          ingredients: [],
          benefits: [],
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Product duplicated')
      fetchProducts()
    } catch {
      toast.error('Failed to duplicate product')
    }
  }

  const toggleSelect = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  const allSelected = products.length > 0 && selected.length === products.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="Search products..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#900c00]/20 focus:border-[#900c00]"
            />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
              className="pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#900c00]/20 bg-white">
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          {selected.length > 0 && (
            <button onClick={handleBulkDelete}
              className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2">
              <Trash2 size={14} /> Delete ({selected.length})
            </button>
          )}
          <Link href="/admin/products/new"
            className="px-4 py-2.5 bg-[#900c00] text-white rounded-xl text-sm font-medium hover:bg-[#b01600] transition-colors flex items-center gap-2 shadow-sm">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">{total} total products</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={allSelected}
                    onChange={() => setSelected(allSelected ? [] : products.map((p) => p.id))} className="rounded" />
                </th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="w-4 h-4 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-200" />
                        <div className="h-4 bg-gray-200 rounded w-32" />
                      </div>
                    </td>
                    {[0,1,2,3,4].map((j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16 mx-auto" /></td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-gray-400">
                    <Package size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No products found</p>
                    <Link href="/admin/products/new" className="text-[#900c00] text-sm mt-2 inline-block hover:underline">
                      Add your first product →
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${selected.includes(p.id) ? 'bg-[#900c00]/5' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Package size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-1">{p.name}</p>
                          <div className="flex gap-1 mt-0.5">
                            {p.bestSeller && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded font-semibold">Best Seller</span>}
                            {p.featured && <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded font-semibold">Featured</span>}
                            {p.weight && <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{p.weight}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.category?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ₹{p.price}
                      {p.comparePrice ? <p className="text-[11px] text-gray-400 line-through">₹{p.comparePrice}</p> : null}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-600' : p.stock < 10 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleField(p.id, 'active', p.active)}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full transition-colors cursor-pointer ${p.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {p.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        {p.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/admin/products/${p.id}/edit`}
                          className="p-2 rounded-lg text-gray-400 hover:text-[#900c00] hover:bg-[#900c00]/10 transition-all" title="Edit">
                          <Edit2 size={15} />
                        </Link>
                        <button onClick={() => toggleField(p.id, 'bestSeller', p.bestSeller)}
                          className={`p-2 rounded-lg transition-all ${p.bestSeller ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'}`}
                          title={p.bestSeller ? 'Remove Best Seller' : 'Mark as Best Seller'}>
                          ★
                        </button>
                        <button onClick={() => handleDuplicate(p)}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Duplicate">
                          <Copy size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(p.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
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
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteTarget)} disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {deleting && <Loader2 size={14} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}