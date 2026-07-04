'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Loader2,
  Save,
  ExternalLink,
  Layers,
  Tag,
  FileText,
  Filter,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface NavItem {
  _id: string
  id: string
  title: string
  slug: string
  destinationType: 'page' | 'category' | 'collection' | 'url' | 'filter'
  destinationValue: string
  order: number
  enabled: boolean
  icon: string | null
}

const DESTINATION_TYPES = [
  { value: 'page', label: 'Page', icon: FileText, description: 'Internal page (e.g. /shop, /about)' },
  { value: 'category', label: 'Category', icon: Layers, description: 'Shop category filter' },
  { value: 'collection', label: 'Collection', icon: Tag, description: 'Product collection' },
  { value: 'url', label: 'External URL', icon: ExternalLink, description: 'External link' },
  { value: 'filter', label: 'Filter', icon: Filter, description: 'Shop filter (e.g. ?tags=vegan)' },
]

const EMPTY_FORM: Omit<NavItem, '_id' | 'id' | 'order'> = {
  title: '',
  slug: '',
  destinationType: 'page',
  destinationValue: '',
  enabled: true,
  icon: null,
}

export default function NavigationPage() {
  const [items, setItems] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<NavItem | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Fetch items
  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/navigation')
      const data = await res.json()
      if (data.items) {
        setItems(data.items)
      }
    } catch {
      toast.error('Failed to load navigation items')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  // Open modal for create
  const openCreate = () => {
    setEditingItem(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  // Open modal for edit
  const openEdit = (item: NavItem) => {
    setEditingItem(item)
    setForm({
      title: item.title,
      slug: item.slug,
      destinationType: item.destinationType,
      destinationValue: item.destinationValue,
      enabled: item.enabled,
      icon: item.icon,
    })
    setModalOpen(true)
  }

  // Save (create or update)
  const handleSave = async () => {
    if (!form.title.trim() || !form.destinationValue.trim()) {
      toast.error('Title and destination are required')
      return
    }

    setSaving(true)
    try {
      if (editingItem) {
        // Update
        const res = await fetch(`/api/admin/navigation/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, order: editingItem.order }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to update')
        }
        toast.success('Menu item updated')
      } else {
        // Create
        const res = await fetch('/api/admin/navigation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to create')
        }
        toast.success('Menu item created')
      }
      setModalOpen(false)
      fetchItems()
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  // Toggle enabled
  const toggleEnabled = async (item: NavItem) => {
    try {
      const res = await fetch(`/api/admin/navigation/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !item.enabled }),
      })
      if (!res.ok) throw new Error()
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, enabled: !i.enabled } : i))
      )
      toast.success(item.enabled ? 'Item disabled' : 'Item enabled')
    } catch {
      toast.error('Failed to toggle item')
    }
  }

  // Delete
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/navigation/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setItems((prev) => prev.filter((i) => i._id !== id))
      toast.success('Menu item deleted')
    } catch {
      toast.error('Failed to delete item')
    } finally {
      setDeleteId(null)
    }
  }

  // Move item up/down
  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...items]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= newItems.length) return

    ;[newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]]

    // Update order values
    const reordered = newItems.map((item, i) => ({ ...item, order: i }))
    setItems(reordered)

    // Save to DB
    try {
      await fetch('/api/admin/navigation/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: reordered.map((item) => ({ id: item._id, order: item.order })),
        }),
      })
    } catch {
      toast.error('Failed to save order')
      fetchItems() // Revert
    }
  }

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = async (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null)
      setDragOverIndex(null)
      return
    }

    const newItems = [...items]
    const [moved] = newItems.splice(dragIndex, 1)
    newItems.splice(dropIndex, 0, moved)

    const reordered = newItems.map((item, i) => ({ ...item, order: i }))
    setItems(reordered)
    setDragIndex(null)
    setDragOverIndex(null)

    try {
      await fetch('/api/admin/navigation/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: reordered.map((item) => ({ id: item._id, order: item.order })),
        }),
      })
      toast.success('Order updated')
    } catch {
      toast.error('Failed to save order')
      fetchItems()
    }
  }

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: editingItem
        ? prev.slug
        : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }))
  }

  const getDestinationIcon = (type: string) => {
    const found = DESTINATION_TYPES.find((d) => d.value === type)
    return found ? found.icon : LinkIcon
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-[#ffa520]" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#3d1c1c]">Navigation Menu</h1>
          <p className="text-sm text-[#9B7B6A] mt-1">
            Manage the mobile hamburger menu items. Drag to reorder.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#900c00] text-white text-sm font-semibold hover:bg-[#6d0900] transition-all shadow-lg shadow-[#900c00]/20"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Items list */}
      {items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#9B7B6A]/20 bg-white p-12 text-center">
          <LinkIcon size={40} className="mx-auto mb-3 text-[#9B7B6A]/30" />
          <h3 className="text-lg font-semibold text-[#3d1c1c] mb-1">No menu items yet</h3>
          <p className="text-sm text-[#9B7B6A] mb-4">Add your first navigation item to get started.</p>
          <button
            onClick={openCreate}
            className="px-5 py-2 rounded-lg bg-[#900c00] text-white text-sm font-semibold hover:bg-[#6d0900] transition-all"
          >
            Add First Item
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => {
            const DestIcon = getDestinationIcon(item.destinationType)
            return (
              <div
                key={item._id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={() => { setDragIndex(null); setDragOverIndex(null) }}
                onDrop={() => handleDrop(index)}
                className={`
                  group flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white border transition-all
                  ${dragOverIndex === index ? 'border-[#ffa520] bg-[#ffa520]/5' : 'border-[#e8d0c0]/40'}
                  ${dragIndex === index ? 'opacity-50 scale-[0.98]' : ''}
                  ${!item.enabled ? 'opacity-60' : ''}
                  hover:border-[#900c00]/20 hover:shadow-sm
                `}
              >
                {/* Drag handle */}
                <div className="cursor-grab active:cursor-grabbing text-[#9B7B6A]/40 hover:text-[#9B7B6A] transition-colors">
                  <GripVertical size={18} />
                </div>

                {/* Order arrows */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-0.5 rounded hover:bg-[#f7eae8] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ChevronUp size={14} className="text-[#900c00]" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    className="p-0.5 rounded hover:bg-[#f7eae8] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ChevronDown size={14} className="text-[#900c00]" />
                  </button>
                </div>

                {/* Icon + Title */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <DestIcon size={14} className="text-[#9B7B6A] flex-shrink-0" />
                    <span className="font-semibold text-[#3d1c1c] truncate">{item.title}</span>
                    {!item.enabled && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B7B6A] bg-[#9B7B6A]/10 px-2 py-0.5 rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#9B7B6A] truncate mt-0.5">
                    {item.destinationType} → {item.destinationValue}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleEnabled(item)}
                    className="p-2 rounded-lg hover:bg-[#f7eae8] transition-colors"
                    title={item.enabled ? 'Disable' : 'Enable'}
                  >
                    {item.enabled ? (
                      <Eye size={15} className="text-green-600" />
                    ) : (
                      <EyeOff size={15} className="text-[#9B7B6A]" />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-lg hover:bg-[#f7eae8] transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} className="text-[#900c00]" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item._id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} className="text-red-500" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Create/Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#3d1c1c]">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg hover:bg-[#f7eae8] transition-colors"
              >
                <X size={18} className="text-[#9B7B6A]" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-[#3d1c1c] mb-1.5">
                  Menu Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e8d0c0]/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ffa520]/40 focus:border-[#ffa520] transition-all"
                  placeholder="e.g. Shop, Vegan, About Us"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-[#3d1c1c] mb-1.5">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#e8d0c0]/60 rounded-xl text-sm text-[#9B7B6A] focus:outline-none focus:ring-2 focus:ring-[#ffa520]/40 focus:border-[#ffa520] transition-all"
                  placeholder="auto-generated-from-title"
                />
              </div>

              {/* Destination Type */}
              <div>
                <label className="block text-sm font-semibold text-[#3d1c1c] mb-1.5">
                  Destination Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DESTINATION_TYPES.map((type) => {
                    const Icon = type.icon
                    const active = form.destinationType === type.value
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, destinationType: type.value as any }))}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          active
                            ? 'bg-[#900c00] text-white border-[#900c00] shadow-sm'
                            : 'bg-white text-[#3d1c1c] border-[#e8d0c0]/60 hover:border-[#900c00]/30'
                        }`}
                      >
                        <Icon size={14} />
                        {type.label}
                      </button>
                    )
                  })}
                </div>
                <p className="text-[11px] text-[#9B7B6A] mt-1.5">
                  {DESTINATION_TYPES.find((d) => d.value === form.destinationType)?.description}
                </p>
              </div>

              {/* Destination Value */}
              <div>
                <label className="block text-sm font-semibold text-[#3d1c1c] mb-1.5">
                  Destination URL / Path <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.destinationValue}
                  onChange={(e) => setForm((prev) => ({ ...prev, destinationValue: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#e8d0c0]/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ffa520]/40 focus:border-[#ffa520] transition-all"
                  placeholder={
                    form.destinationType === 'page'
                      ? '/shop, /about, /'
                      : form.destinationType === 'category'
                      ? '/shop?category=cookies'
                      : form.destinationType === 'filter'
                      ? '/shop?tags=vegan'
                      : form.destinationType === 'url'
                      ? 'https://example.com'
                      : '/shop?collection=...'
                  }
                />
              </div>

              {/* Icon (optional) */}
              <div>
                <label className="block text-sm font-semibold text-[#3d1c1c] mb-1.5">
                  Icon (optional)
                </label>
                <input
                  type="text"
                  value={form.icon || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value || null }))}
                  className="w-full px-4 py-2.5 border border-[#e8d0c0]/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ffa520]/40 focus:border-[#ffa520] transition-all"
                  placeholder="e.g. 🛒, 🌿, or leave empty"
                />
              </div>

              {/* Enabled toggle */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#faf4e8] rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-[#3d1c1c]">Visible on site</p>
                  <p className="text-xs text-[#9B7B6A]">When disabled, this item won&apos;t show in the menu</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, enabled: !prev.enabled }))}
                  className={`relative w-11 h-6 rounded-full transition-all ${
                    form.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      form.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-[#e8d0c0]/30">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#e8d0c0]/60 text-sm font-semibold text-[#3d1c1c] hover:bg-[#f7eae8] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#900c00] text-white text-sm font-semibold hover:bg-[#6d0900] disabled:opacity-60 transition-all shadow-lg shadow-[#900c00]/20"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[#3d1c1c] mb-2">Delete Menu Item?</h3>
            <p className="text-sm text-[#9B7B6A] mb-6">
              This will permanently remove this item from the navigation menu.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#e8d0c0]/60 text-sm font-semibold text-[#3d1c1c] hover:bg-[#f7eae8] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
