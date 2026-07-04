'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import { Heart, ShoppingBag, Zap, Minus, Plus, ChevronRight, ChevronDown, Star, Loader2, Package } from 'lucide-react'
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
  const [selectedPkgIdx, setSelectedPkgIdx] = useState(0)
  const [openAccordion, setOpenAccordion] = useState<string>('about')

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
    // If package sizes exist, override price with selected size
    const pkg = product.packageSizes?.[selectedPkgIdx]
    const cartProduct = pkg
      ? { ...product, price: pkg.price, comparePrice: pkg.comparePrice ?? product.comparePrice, weight: pkg.label }
      : product
    addItem(cartProduct, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    if (!product) return
    const pkg = product.packageSizes?.[selectedPkgIdx]
    const cartProduct = pkg
      ? { ...product, price: pkg.price, comparePrice: pkg.comparePrice ?? product.comparePrice, weight: pkg.label }
      : product
    const store = useCartStore.getState()
    store.setBuyNow(cartProduct, quantity)
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

                {/* Price — use selected package size price if available */}
                {(() => {
                  const pkg = product.packageSizes?.[selectedPkgIdx]
                  const displayPrice = pkg?.price ?? product.price
                  const displayCompare = pkg?.comparePrice ?? product.comparePrice
                  return (
                    <>
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-3xl font-bold text-mithai-maroon">₹{displayPrice}</span>
                        {displayCompare && displayCompare > displayPrice && (
                          <>
                            <span className="text-lg text-mithai-taupe line-through">₹{displayCompare}</span>
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold">
                              Save ₹{displayCompare - displayPrice}
                            </span>
                          </>
                        )}
                      </div>
                      {(pkg?.label || product.weight) && (
                        <p className="text-sm text-mithai-taupe">Pack size: {pkg?.label || product.weight}</p>
                      )}
                    </>
                  )
                })()}
              </div>

              {/* ─── Package Size Selector ──────────────────── */}
              {product.packageSizes && product.packageSizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-mithai-maroonD mb-3">Choose Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.packageSizes.map((pkg: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPkgIdx(idx)}
                        className={`px-4 py-2.5 rounded-2xl border-2 text-sm font-semibold transition-all duration-200 ${
                          selectedPkgIdx === idx
                            ? 'border-mithai-maroon bg-mithai-maroonP text-mithai-maroon shadow-[0_0_0_2px_rgba(144,12,0,0.12)]'
                            : 'border-mithai-taupe/20 text-mithai-maroon hover:border-mithai-maroon/40 bg-white'
                        }`}
                      >
                        <span className="block">{pkg.label}</span>
                        <span className={`block text-xs mt-0.5 ${selectedPkgIdx === idx ? 'text-mithai-maroon' : 'text-mithai-taupe'}`}>
                          ₹{pkg.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                              : 'border-mithai-taupe/20 text-mithai-maroon hover:border-mithai-maroon/40 bg-white'
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

              {/* ─── Premium Accordion Sections ───────────── */}
              <div className="mb-6">
                {/* About */}
                {(product.about || product.description) && (
                  <AccordionItem
                    id="about"
                    title="About"
                    open={openAccordion === 'about'}
                    onToggle={() => setOpenAccordion(openAccordion === 'about' ? '' : 'about')}
                  >
                    <p className="text-sm text-mithai-taupe leading-relaxed whitespace-pre-line">
                      {product.about || product.description}
                    </p>
                  </AccordionItem>
                )}

                {/* Ingredients */}
                {product.ingredients && product.ingredients.length > 0 && (
                  <AccordionItem
                    id="ingredients"
                    title="Ingredients"
                    open={openAccordion === 'ingredients'}
                    onToggle={() => setOpenAccordion(openAccordion === 'ingredients' ? '' : 'ingredients')}
                  >
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
                  </AccordionItem>
                )}

                {/* Storage & Shelf Life */}
                {product.storage && (
                  <AccordionItem
                    id="storage"
                    title="Storage & Shelf Life"
                    open={openAccordion === 'storage'}
                    onToggle={() => setOpenAccordion(openAccordion === 'storage' ? '' : 'storage')}
                  >
                    <p className="text-sm text-mithai-taupe leading-relaxed whitespace-pre-line">
                      {product.storage}
                    </p>
                  </AccordionItem>
                )}

                {/* Allergen Information */}
                {product.allergens && (
                  <AccordionItem
                    id="allergens"
                    title="Allergen Information"
                    open={openAccordion === 'allergens'}
                    onToggle={() => setOpenAccordion(openAccordion === 'allergens' ? '' : 'allergens')}
                  >
                    <p className="text-sm text-mithai-taupe leading-relaxed whitespace-pre-line">
                      {product.allergens}
                    </p>
                  </AccordionItem>
                )}

                {/* Nutritional Information */}
                {product.nutrition && (
                  <AccordionItem
                    id="nutrition"
                    title="Nutritional Information"
                    open={openAccordion === 'nutrition'}
                    onToggle={() => setOpenAccordion(openAccordion === 'nutrition' ? '' : 'nutrition')}
                  >
                    <div className="text-sm text-mithai-taupe leading-relaxed">
                      {product.servingSize && (
                        <p className="text-xs font-semibold text-mithai-maroon mb-3">Serving size: {product.servingSize}</p>
                      )}
                      <p className="whitespace-pre-line">{product.nutrition}</p>
                    </div>
                  </AccordionItem>
                )}

                {/* Product Highlights */}
                {product.highlights && product.highlights.length > 0 && (
                  <AccordionItem
                    id="highlights"
                    title="Product Highlights"
                    open={openAccordion === 'highlights'}
                    onToggle={() => setOpenAccordion(openAccordion === 'highlights' ? '' : 'highlights')}
                  >
                    <div className="flex flex-wrap gap-2">
                      {product.highlights.map((h, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3.5 py-1.5 rounded-full text-xs font-medium"
                        >
                          <span className="text-green-500">✓</span> {h}
                        </span>
                      ))}
                    </div>
                  </AccordionItem>
                )}

                {/* FSSAI Information */}
                {product.fssaiNumber && (
                  <AccordionItem
                    id="fssai"
                    title="FSSAI Information"
                    open={openAccordion === 'fssai'}
                    onToggle={() => setOpenAccordion(openAccordion === 'fssai' ? '' : 'fssai')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-xs">FSSAI</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-mithai-maroonD">Lic. No. {product.fssaiNumber}</p>
                        <p className="text-xs text-mithai-taupe">This product is manufactured in an FSSAI-certified facility.</p>
                      </div>
                    </div>
                  </AccordionItem>
                )}

                {/* Benefits (legacy fallback — shown if no highlights but benefits exist) */}
                {(!product.highlights || product.highlights.length === 0) && product.benefits && product.benefits.length > 0 && (
                  <AccordionItem
                    id="benefits"
                    title="Benefits"
                    open={openAccordion === 'benefits'}
                    onToggle={() => setOpenAccordion(openAccordion === 'benefits' ? '' : 'benefits')}
                  >
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
                  </AccordionItem>
                )}
              </div>

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

/* ─── Accordion Item Component ─────────────────────────────── */
function AccordionItem({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="acc-item" data-open={open}>
      <button
        type="button"
        className="acc-trigger"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`acc-panel-${id}`}
      >
        <span className="acc-title">{title}</span>
        <ChevronDown
          size={18}
          className={`acc-chevron ${open ? 'acc-chevron--open' : ''}`}
        />
      </button>
      <div
        id={`acc-panel-${id}`}
        className={`acc-panel ${open ? 'acc-panel--open' : ''}`}
        role="region"
      >
        <div className="acc-content">{children}</div>
      </div>

      <style jsx>{`
        .acc-item {
          border-bottom: 1px solid rgba(107,31,31,0.10);
        }
        .acc-item:first-child {
          border-top: 1px solid rgba(107,31,31,0.10);
        }
        .acc-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 2px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: color 0.18s;
        }
        .acc-trigger:hover {
          color: #900c00;
        }
        .acc-title {
          font-size: 14px;
          font-weight: 600;
          color: #3d1a10;
          letter-spacing: 0.01em;
        }
        .acc-trigger:hover .acc-title {
          color: #900c00;
        }
        .acc-item[data-open="true"] .acc-title {
          color: #900c00;
        }
        .acc-chevron {
          color: #9B7B6A;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.18s;
          flex-shrink: 0;
        }
        .acc-chevron--open {
          transform: rotate(180deg);
          color: #900c00;
        }
        .acc-panel {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.25s ease;
          opacity: 0;
        }
        .acc-panel--open {
          max-height: 600px;
          opacity: 1;
        }
        .acc-content {
          padding: 0 2px 18px;
        }
      `}</style>
    </div>
  )
}
