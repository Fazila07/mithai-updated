'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import ProductReviewsSection from '@/components/ProductReviewsSection'
import { Heart, ShoppingBag, Zap, Minus, Plus, ChevronRight, ChevronDown, Star, Package } from 'lucide-react'
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
              <div className="rounded-2xl bg-mithai-cream h-[460px]" />
              <div className="space-y-4">
                <div className="h-4 bg-mithai-cream rounded w-1/4" />
                <div className="h-8 bg-mithai-cream rounded w-2/3" />
                <div className="h-6 bg-mithai-cream rounded w-1/3" />
                <div className="h-24 bg-mithai-cream rounded" />
                <div className="h-12 bg-mithai-cream rounded" />
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
  const pkg = product.packageSizes?.[selectedPkgIdx]
  const displayPrice = pkg?.price ?? product.price
  const displayCompare = pkg?.comparePrice ?? product.comparePrice
  const tagline = product.highlights?.[0] || product.benefits?.[0] || categoryName

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-mithai-off pt-[60px] pb-8">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-1.5 text-sm">
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

          <div className="product-layout">
            {/* Image Gallery */}
            <div className="product-gallery">
              <div className="product-main-image">
                {product.images?.[selectedImage] ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="product-image"
                  />
                ) : (
                  <div className="product-image-placeholder">
                    <ShoppingBag size={64} className="text-mithai-taupe/20" />
                  </div>
                )}

                <span className="product-ships-badge">Ships Pan India</span>

                {product.bestSeller && (
                  <span className="product-bestseller-badge">Bestseller</span>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="product-thumbnails">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`product-thumb ${selectedImage === idx ? 'product-thumb--active' : ''}`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info">
              <p className="product-tagline">{tagline}</p>
              <h1 className="product-name">{product.name}</h1>

              {product.rating > 0 && (
                <div className="product-rating">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < Math.round(product.rating) ? '#ffa520' : 'none'}
                        className={i < Math.round(product.rating) ? 'text-mithai-gold' : 'text-mithai-taupe/30'}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-mithai-maroon">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-mithai-taupe">({product.reviewCount} reviews)</span>
                </div>
              )}

              <div className="product-pricing">
                {displayCompare && displayCompare > displayPrice && (
                  <span className="product-price-old">₹ {displayCompare}</span>
                )}
                <span className="product-price">₹ {displayPrice}</span>
                {displayCompare && displayCompare > displayPrice && (
                  <span className="product-save">
                    Save ₹{displayCompare - displayPrice}
                  </span>
                )}
              </div>

              {(pkg?.label || product.weight) && (
                <p className="product-pack">Pack size: {pkg?.label || product.weight}</p>
              )}

              {product.packageSizes && product.packageSizes.length > 0 && (
                <div className="product-sizes">
                  <h3 className="product-section-label">Choose Size</h3>
                  <div className="product-size-options">
                    {product.packageSizes.map((pkgOption: { label: string; price: number }, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPkgIdx(idx)}
                        className={`product-size-btn ${selectedPkgIdx === idx ? 'product-size-btn--active' : ''}`}
                      >
                        <span>{pkgOption.label}</span>
                        <span className="product-size-price">₹{pkgOption.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sizeVariants.length > 1 && (
                <div className="product-sizes">
                  <h3 className="product-section-label">Select Size</h3>
                  <div className="product-size-options">
                    {sizeVariants.map((variant) => {
                      const isActive = variant.slug === product.slug
                      return (
                        <button
                          key={variant.id}
                          onClick={() => {
                            if (!isActive) router.push(`/shop/${variant.slug}`)
                          }}
                          className={`product-size-btn ${isActive ? 'product-size-btn--active' : ''}`}
                        >
                          <span>{variant.weight || 'Standard'}</span>
                          <span className="product-size-price">₹{variant.price}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Stock */}
              {product.stock <= 0 ? (
                <p className="product-stock product-stock--out">Out of Stock</p>
              ) : product.stock <= 10 ? (
                <p className="product-stock product-stock--low">Only {product.stock} left in stock!</p>
              ) : null}

              {/* Quantity + Add to Cart */}
              <div className="product-actions">
                <div className="product-qty-row">
                  <span className="product-qty-label">Qty</span>
                  <div className="product-qty-control">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="product-qty-btn"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="product-qty-value">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="product-qty-btn"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="product-btn-row">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`product-add-btn ${addedToCart ? 'product-add-btn--success' : ''}`}
                  >
                    {addedToCart ? '✓ ADDED TO CART' : 'ADD TO CART'}
                  </button>
                  <button
                    onClick={() => toggle(product)}
                    className={`product-wishlist-btn ${wishlisted ? 'product-wishlist-btn--active' : ''}`}
                    title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="product-buynow-btn"
                >
                  <Zap size={16} />
                  Buy Now — ₹{(displayPrice * quantity).toLocaleString('en-IN')}
                </button>
              </div>

              {/* Accordions */}
              <div className="product-accordions">
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
            </div>
          </div>

          <ProductReviewsSection productId={product._id || product.id} />
        </div>
      </main>
      <CartDrawer />

      <style jsx>{`
        .product-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }

        .product-gallery {
          width: 100%;
        }

        .product-main-image {
          position: relative;
          background: #f0ebe3;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 1;
          max-height: 520px;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 24px;
        }

        .product-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f7f3ee;
        }

        .product-ships-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #e8f4fc;
          color: #1a5f8a;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 5px 10px;
          border-radius: 4px;
        }

        .product-bestseller-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #ffa520;
          color: white;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 4px;
        }

        .product-thumbnails {
          display: flex;
          gap: 10px;
          margin-top: 12px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .product-thumb {
          width: 72px;
          height: 72px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid transparent;
          flex-shrink: 0;
          opacity: 0.65;
          transition: opacity 0.2s, border-color 0.2s;
          background: #f0ebe3;
          cursor: pointer;
        }

        .product-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-thumb--active {
          border-color: #900c00;
          opacity: 1;
        }

        .product-info {
          display: flex;
          flex-direction: column;
        }

        .product-tagline {
          font-family: 'Libre Baskerville', serif;
          font-style: italic;
          font-size: 14px;
          color: #900c00;
          margin-bottom: 6px;
        }

        .product-name {
          font-family: 'Tan Pearl', serif;
          font-size: clamp(22px, 5vw, 32px);
          font-weight: 700;
          color: #2d1810;
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .product-pricing {
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .product-price-old {
          font-size: 16px;
          color: #9b7b6a;
          text-decoration: line-through;
        }

        .product-price {
          font-size: 26px;
          font-weight: 700;
          color: #2d1810;
        }

        .product-save {
          font-size: 12px;
          font-weight: 700;
          color: #15803d;
          background: #dcfce7;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .product-pack {
          font-size: 13px;
          color: #9b7b6a;
          margin-bottom: 20px;
        }

        .product-sizes {
          margin-bottom: 20px;
        }

        .product-section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #3d1a10;
          margin-bottom: 10px;
        }

        .product-size-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .product-size-btn {
          padding: 10px 16px;
          border-radius: 8px;
          border: 1.5px solid rgba(107, 31, 31, 0.15);
          background: white;
          font-size: 13px;
          font-weight: 600;
          color: #3d1a10;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
          text-align: left;
        }

        .product-size-btn--active {
          border-color: #900c00;
          background: rgba(144, 12, 0, 0.05);
          color: #900c00;
        }

        .product-size-price {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: #9b7b6a;
          margin-top: 2px;
        }

        .product-stock {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .product-stock--out { color: #dc2626; }
        .product-stock--low { color: #ea580c; }

        .product-actions {
          margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(107, 31, 31, 0.1);
        }

        .product-qty-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 14px;
        }

        .product-qty-label {
          font-size: 13px;
          font-weight: 600;
          color: #3d1a10;
        }

        .product-qty-control {
          display: flex;
          align-items: center;
          gap: 4px;
          border: 1.5px solid rgba(107, 31, 31, 0.15);
          border-radius: 8px;
          padding: 4px;
          background: white;
        }

        .product-qty-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: #900c00;
          cursor: pointer;
          border-radius: 6px;
        }

        .product-qty-btn:hover {
          background: rgba(144, 12, 0, 0.06);
        }

        .product-qty-value {
          width: 36px;
          text-align: center;
          font-size: 15px;
          font-weight: 600;
          color: #3d1a10;
        }

        .product-btn-row {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .product-add-btn {
          flex: 1;
          padding: 16px 20px;
          background: #900c00;
          color: white;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.06em;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .product-add-btn:hover:not(:disabled) {
          background: #6d0900;
        }

        .product-add-btn--success {
          background: #16a34a;
        }

        .product-add-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .product-wishlist-btn {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid rgba(107, 31, 31, 0.15);
          border-radius: 8px;
          background: white;
          color: #900c00;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.18s, border-color 0.18s;
        }

        .product-wishlist-btn--active {
          background: #900c00;
          border-color: #900c00;
          color: white;
        }

        .product-buynow-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          background: #ffa520;
          color: white;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .product-buynow-btn:hover:not(:disabled) {
          background: #e69400;
        }

        .product-buynow-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .product-accordions {
          margin-top: 4px;
        }

        @media (min-width: 1024px) {
          .product-layout {
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            align-items: start;
          }

          .product-main-image {
            max-height: 560px;
          }
        }
      `}</style>
    </>
  )
}

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
