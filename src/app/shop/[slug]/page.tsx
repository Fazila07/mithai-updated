'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import { Heart, ShoppingBag, Zap, Minus, Plus, ChevronRight, Star, Loader2, Package } from 'lucide-react'
import type { IProduct, IProductVariant } from '@/types'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const addItem = useCartStore((s) => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()

  const [product, setProduct] = useState<IProduct | null>(null)
  const [sizeVariants, setSizeVariants] = useState<IProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      try {
        const res = await fetch(`/api/products/${slug}`)
        const data = await res.json()
        if (data.product) {
          setProduct({ ...data.product, _id: data.product.id })
          setSizeVariants(data.product.sizeVariants || [])
        }
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    if (!product) return
    const store = useCartStore.getState()
    store.setBuyNow(product, quantity)
    router.push('/checkout?mode=buynow')
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-mithai-off pt-[72px]">
          <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-2 gap-10 animate-pulse">
              <div className="rounded-[28px] bg-mithai-cream h-[460px]" />
              <div className="space-y-4">
                <div className="h-4 bg-mithai-cream rounded w-1/4" />
                <div className="h-8 bg-mithai-cream rounded w-2/3" />
                <div className="h-6 bg-mithai-cream rounded w-1/3" />
                <div className="h-24 bg-mithai-cream rounded" />
                <div className="h-12 bg-mithai-cream rounded-full" />
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-mithai-off px-4 py-10 sm:px-7 lg:px-10 pt-[88px]">
          <div className="mx-auto max-w-[1160px] text-center">
            <Package size={64} className="mx-auto mb-4 text-mithai-taupe/30" />
            <h1 className="font-medino text-3xl text-mithai-maroonD mb-3">Product Not Found</h1>
            <p className="text-mithai-taupe mb-8">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/shop" className="btn-primary">
              Back to Shop
            </Link>
          </div>
        </main>
      </>
    )
  }

  const wishlisted = isWishlisted(product._id || product.id || '')
  const categoryName = typeof product.category === 'object' ? product.category.name : product.foodType || 'Snack'
  const categorySlug = typeof product.category === 'object' ? product.category.slug : ''

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-mithai-off pt-[72px]">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-sm">
            <Link href="/shop" className="text-mithai-maroon hover:underline font-medium">Shop</Link>
            <ChevronRight size={14} className="text-mithai-taupe/50" />
            {categorySlug && (
              <>
                <Link href={`/shop?category=${categorySlug}`} className="text-mithai-maroon hover:underline font-medium">
                  {categoryName}
                </Link>
                <ChevronRight size={14} className="text-mithai-taupe/50" />
              </>
            )}
            <span className="text-mithai-taupe truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 mb-12">
            {/* ─── Image Gallery ───────────────────────────── */}
            <div>
              <div className="rounded-[28px] bg-white border border-[rgba(107,31,31,0.08)] overflow-hidden mb-4 relative group">
                {product.images?.[selectedImage] ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-[460px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-[460px] flex items-center justify-center bg-mithai-cream">
                    <ShoppingBag size={64} className="text-mithai-taupe/20" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.bestSeller && (
                    <span className="px-3 py-1.5 rounded-full bg-mithai-gold text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                      Bestseller
                    </span>
                  )}
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="px-3 py-1.5 rounded-full bg-green-500 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                      {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% Off
                    </span>
                  )}
                </div>

                {/* Product ID badge */}
                {product.uniqueId && (
                  <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 text-[10px] font-mono font-bold text-mithai-taupe shadow-sm">
                    #{product.uniqueId}
                  </span>
                )}
              </div>

              {/* Thumbnail strip */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                        selectedImage === idx
                          ? 'border-mithai-maroon shadow-[0_0_0_2px_rgba(144,12,0,0.15)]'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Product Details ─────────────────────────── */}
            <div>
              {/* Category & Name */}
              <div className="mb-5">
                <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-mithai-gold mb-2">
                  {categoryName}
                </p>
                <h1 className="font-medino text-[clamp(28px,4vw,38px)] font-normal text-mithai-maroonD tracking-[-0.01em] leading-[0.95] mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                {product.rating > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < Math.round(product.rating) ? '#ffa520' : 'none'}
                          className={i < Math.round(product.rating) ? 'text-mithai-gold' : 'text-mithai-taupe/30'}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-mithai-maroon">{product.rating.toFixed(1)}</span>
                    <span className="text-xs text-mithai-taupe">({product.reviewCount} reviews)</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-mithai-maroon">₹{product.price}</span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <>
                      <span className="text-lg text-mithai-taupe line-through">₹{product.comparePrice}</span>
                      <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold">
                        Save ₹{product.comparePrice - product.price}
                      </span>
                    </>
                  )}
                </div>
                {product.weight && (
                  <p className="text-sm text-mithai-taupe">Pack size: {product.weight}</p>
                )}
              </div>

              {/* ─── Size Variant Switcher ─────────────────── */}
              {sizeVariants.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-mithai-maroonD mb-3">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizeVariants.map((variant) => {
                      const isActive = variant.slug === product.slug
                      return (
                        <button
                          key={variant.id}
                          onClick={() => {
                            if (!isActive) router.push(`/shop/${variant.slug}`)
                          }}
                          className={`px-5 py-3 rounded-2xl border-2 text-sm font-semibold transition-all duration-200 ${
                            isActive
                              ? 'border-mithai-maroon bg-mithai-maroonP text-mithai-maroon shadow-[0_0_0_2px_rgba(144,12,0,0.12)]'
                              : 'border-mithai-taupe/20 text-mithai-charcoal hover:border-mithai-maroon/40 bg-white'
                          }`}
                        >
                          <span className="block">{variant.weight || 'Standard'}</span>
                          <span className={`block text-xs mt-0.5 ${isActive ? 'text-mithai-maroon' : 'text-mithai-taupe'}`}>
                            ₹{variant.price}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ─── Description ───────────────────────────── */}
              <div className="mb-6">
                <h3 className="font-runiga text-base font-semibold text-mithai-maroonD mb-2">About this product</h3>
                <p className="text-sm text-mithai-taupe leading-relaxed">{product.description}</p>
              </div>

              {/* ─── Ingredients ────────────────────────────── */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-runiga text-base font-semibold text-mithai-maroonD mb-3">Key Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-mithai-off text-mithai-maroon px-3.5 py-1.5 rounded-full text-xs font-medium border border-mithai-taupe/10"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Benefits ──────────────────────────────── */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-runiga text-base font-semibold text-mithai-maroonD mb-3">Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.benefits.map((benefit, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3.5 py-1.5 rounded-full text-xs font-medium"
                      >
                        <span className="text-green-500">✓</span> {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Popular Tags ──────────────────────────── */}
              {product.popularTags && product.popularTags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-1.5">
                    {product.popularTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-mithai-goldP text-mithai-gold px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Quantity + Actions ─────────────────────── */}
              <div className="border-t border-mithai-taupe/15 pt-6 space-y-4">
                {/* Stock status */}
                {product.stock <= 0 ? (
                  <p className="text-sm font-semibold text-red-500">Out of Stock</p>
                ) : product.stock <= 10 ? (
                  <p className="text-sm font-semibold text-orange-500">Only {product.stock} left in stock!</p>
                ) : null}

                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-mithai-maroonD">Quantity:</span>
                  <div className="flex items-center gap-1 bg-mithai-off rounded-full p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-full bg-white text-mithai-maroon flex items-center justify-center hover:bg-mithai-cream transition-colors shadow-sm"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-base font-semibold text-mithai-maroon">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="w-9 h-9 rounded-full bg-white text-mithai-maroon flex items-center justify-center hover:bg-mithai-cream transition-colors shadow-sm"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      addedToCart
                        ? 'bg-green-500 text-white shadow-[0_4px_18px_rgba(34,197,94,0.35)]'
                        : 'bg-mithai-maroon text-white hover:bg-mithai-maroonL shadow-[0_4px_18px_rgba(144,12,0,0.32)] hover:shadow-[0_8px_28px_rgba(144,12,0,0.4)]'
                    }`}
                  >
                    {addedToCart ? (
                      <>✓ Added to Cart</>
                    ) : (
                      <><ShoppingBag size={16} /> Add to Cart — ₹{(product.price * quantity).toLocaleString('en-IN')}</>
                    )}
                  </button>
                  <button
                    onClick={() => toggle(product)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                      wishlisted
                        ? 'bg-mithai-maroon border-mithai-maroon text-white'
                        : 'bg-white border-mithai-taupe/20 text-mithai-maroon hover:border-mithai-maroon/40'
                    }`}
                    title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-semibold text-sm bg-mithai-gold text-white hover:bg-[#e69400] transition-all shadow-[0_4px_18px_rgba(255,165,32,0.32)] hover:shadow-[0_8px_28px_rgba(255,165,32,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap size={16} />
                  Buy Now — ₹{(product.price * quantity).toLocaleString('en-IN')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <CartDrawer />
    </>
  )
}
