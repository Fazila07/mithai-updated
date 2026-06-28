'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import { Loader2 } from 'lucide-react'

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return }
        setProduct(d.product)
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#900c00]" />
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 rounded-2xl p-8 text-center">{error}</div>
  }

  return <ProductForm mode="edit" initialData={product} />
}
