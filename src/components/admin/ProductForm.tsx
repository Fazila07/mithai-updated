'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Upload, X, Loader2, Plus, Minus } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFormData {
  name: string
  slug: string
  categoryId: string
  subcategory: string
  description: string
  shortDescription: string
  price: string
  comparePrice: string
  stock: string
  sku: string
  weight: string
  tags: string
  ingredients: string
  benefits: string
  images: string[]
  featuredImage: string
  bestSeller: boolean
  featured: boolean
  active: boolean
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any
  mode: 'create' | 'edit'
}

const EMPTY: ProductFormData = {
  name: '', slug: '', categoryId: '', subcategory: '',
  description: '', shortDescription: '',
  price: '', comparePrice: '', stock: '', sku: '', weight: '',
  tags: '', ingredients: '', benefits: '',
  images: [], featuredImage: '',
  bestSeller: false, featured: false, active: true,
}

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}

export default function ProductForm({ initialData, mode }: Props) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<ProductFormData>(() => {
    if (initialData) {
      return {
        ...EMPTY,
        name: initialData.name ?? '',
        slug: initialData.slug ?? '',
        categoryId: initialData.categoryId ?? initialData.category?.id ?? '',
        subcategory: initialData.subcategory ?? '',
        description: initialData.description ?? '',
        shortDescription: initialData.shortDescription ?? '',
        price: String(initialData.price ?? ''),
        comparePrice: String(initialData.comparePrice ?? ''),
        stock: String(initialData.stock ?? ''),
        sku: initialData.sku ?? '',
        weight: initialData.weight ?? '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags ?? ''),
        ingredients: Array.isArray(initialData.ingredients) ? initialData.ingredients.join('\n') : (initialData.ingredients ?? ''),
        benefits: Array.isArray(initialData.benefits) ? initialData.benefits.join('\n') : (initialData.benefits ?? ''),
        images: initialData.images ?? [],
        featuredImage: initialData.featuredImage ?? '',
        bestSeller: initialData.bestSeller ?? false,
        featured: initialData.featured ?? false,
        active: initialData.active ?? true,
      }
    }
    return EMPTY
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  // Fetch categories from DB
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => {
        const cats = d.categories ?? []
        setCategories(cats)
        if (!form.categoryId && cats.length > 0) {
          setForm((f) => ({ ...f, categoryId: cats[0].id }))
        }
      })
      .catch(() => toast.error('Failed to load categories'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (key: keyof ProductFormData, value: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleNameChange = (val: string) => {
    set('name', val)
    if (mode === 'create') set('slug', slugify(val))
  }

  const uploadImages = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const fd = new FormData()
      Array.from(files).forEach((f) => fd.append('files', f))
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const newUrls: string[] = data.urls
      setForm((f) => ({
        ...f,
        images: [...f.images, ...newUrls],
        featuredImage: f.featuredImage || newUrls[0] || '',
      }))
      toast.success(`${newUrls.length} image(s) uploaded`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [])

  const removeImage = (url: string) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((i) => i !== url),
      featuredImage: f.featuredImage === url ? f.images[0] ?? '' : f.featuredImage,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.categoryId || !form.price) {
      toast.error('Name, category and price are required')
      return
    }
    setSaving(true)
    try {
      const body = {
        name: form.name,
        slug: form.slug,
        categoryId: form.categoryId,
        subcategory: form.subcategory || undefined,
        description: form.description,
        shortDescription: form.shortDescription || undefined,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        stock: parseInt(form.stock) || 0,
        sku: form.sku || undefined,
        weight: form.weight || undefined,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        ingredients: form.ingredients.split('\n').map((t) => t.trim()).filter(Boolean),
        benefits: form.benefits.split('\n').map((t) => t.trim()).filter(Boolean),
        images: form.images,
        featuredImage: form.featuredImage || undefined,
        bestSeller: form.bestSeller,
        featured: form.featured,
        active: form.active,
      }

      const url = mode === 'edit' && initialData?.id
        ? `/api/admin/products/${initialData.id}`
        : '/api/admin/products'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(mode === 'edit' ? 'Product updated!' : 'Product created!')
      router.push('/admin/products')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#900c00]/20 focus:border-[#900c00] transition-all"
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left — Main Info */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Basic Information</h2>
            <div>
              <label className={labelCls}>Product Name *</label>
              <input type="text" value={form.name} onChange={(e) => handleNameChange(e.target.value)} required className={inputCls} placeholder="e.g. Almond Butter Cookies" />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input type="text" value={form.slug} onChange={(e) => set('slug', e.target.value)} className={inputCls} placeholder="auto-generated from name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Category *</label>
                <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className={inputCls}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Subcategory</label>
                <input type="text" value={form.subcategory} onChange={(e) => set('subcategory', e.target.value)} className={inputCls} placeholder="Optional" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Short Description</label>
              <input type="text" value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} className={inputCls} placeholder="One-line tagline" maxLength={160} />
            </div>
            <div>
              <label className={labelCls}>Full Description</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={5} className={inputCls} placeholder="Detailed product description..." />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Price (₹) *</label>
                <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} required min="0" className={inputCls} placeholder="299" />
              </div>
              <div>
                <label className={labelCls}>Compare Price (₹)</label>
                <input type="number" value={form.comparePrice} onChange={(e) => set('comparePrice', e.target.value)} min="0" className={inputCls} placeholder="399" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Stock *</label>
                <input type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)} min="0" className={inputCls} placeholder="50" />
              </div>
              <div>
                <label className={labelCls}>SKU</label>
                <input type="text" value={form.sku} onChange={(e) => set('sku', e.target.value)} className={inputCls} placeholder="MTH-001" />
              </div>
              <div>
                <label className={labelCls}>Weight</label>
                <input type="text" value={form.weight} onChange={(e) => set('weight', e.target.value)} className={inputCls} placeholder="250g" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Product Details</h2>
            <div>
              <label className={labelCls}>Tags <span className="text-gray-400 font-normal">(comma separated)</span></label>
              <input type="text" value={form.tags} onChange={(e) => set('tags', e.target.value)} className={inputCls} placeholder="healthy, sugar-free, gluten-free" />
            </div>
            <div>
              <label className={labelCls}>Ingredients <span className="text-gray-400 font-normal">(one per line)</span></label>
              <textarea value={form.ingredients} onChange={(e) => set('ingredients', e.target.value)} rows={4} className={inputCls} placeholder={'Almond flour\nCocoa powder\nJaggery'} />
            </div>
            <div>
              <label className={labelCls}>Benefits <span className="text-gray-400 font-normal">(one per line)</span></label>
              <textarea value={form.benefits} onChange={(e) => set('benefits', e.target.value)} rows={3} className={inputCls} placeholder={'No refined sugar\nHigh protein\nGut friendly'} />
            </div>
          </div>
        </div>

        {/* Right — Images & Toggles */}
        <div className="space-y-6">
          {/* Images */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Product Images</h2>

            {/* Drop zone */}
            <label
              className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${dragOver ? 'border-[#900c00] bg-[#900c00]/5' : 'border-gray-200 hover:border-[#900c00]/50'}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadImages(e.dataTransfer.files) }}
            >
              <input type="file" multiple accept="image/*" className="sr-only" onChange={(e) => uploadImages(e.target.files)} />
              {uploading ? (
                <Loader2 size={24} className="animate-spin text-[#900c00]" />
              ) : (
                <>
                  <Upload size={24} className="text-gray-400" />
                  <p className="text-sm text-gray-500 text-center">Drag & drop or <span className="text-[#900c00] font-medium">browse</span></p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                </>
              )}
            </label>

            {/* Preview grid */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {form.images.map((url) => (
                  <div key={url} className="relative group aspect-square">
                    <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                      <button type="button" onClick={() => set('featuredImage', url)}
                        className={`p-1 rounded text-xs ${form.featuredImage === url ? 'bg-yellow-400 text-black' : 'bg-white text-gray-800'}`}
                        title="Set as featured">
                        ★
                      </button>
                      <button type="button" onClick={() => removeImage(url)}
                        className="p-1 rounded bg-red-500 text-white">
                        <X size={12} />
                      </button>
                    </div>
                    {form.featuredImage === url && (
                      <span className="absolute top-1 left-1 text-[9px] bg-yellow-400 text-black px-1 rounded font-bold">FEATURED</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Visibility</h2>
            {(
              [
                { key: 'active' as const, label: 'Active', desc: 'Visible on storefront' },
                { key: 'featured' as const, label: 'Featured', desc: 'Shown in featured section' },
                { key: 'bestSeller' as const, label: 'Best Seller', desc: 'Best seller badge' },
              ] as const
            ).map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => set(key, !form[key])}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form[key] ? 'bg-[#900c00]' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form[key] ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button type="button" onClick={() => router.back()}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Minus size={14} /> Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-3 bg-[#900c00] text-white rounded-xl text-sm font-semibold hover:bg-[#b01600] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 shadow-sm">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {mode === 'edit' ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
