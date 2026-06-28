'use client'

import Link from 'next/link'
import { Suspense, useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import { Heart, ShoppingBag, Zap, Search, LayoutGrid } from 'lucide-react'
import type { IProduct, ICategory } from '@/types'

/* ─── Product Card ─────────────────────────────────────────── */

function ProductCard({ product }: { product: IProduct }) {
  const addItem = useCartStore((s) => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()
  const router = useRouter()
  const wishlisted = isWishlisted(product._id || product.id || '')

  const handleBuyNow = () => {
    const store = useCartStore.getState()
    store.setBuyNow(product, 1)
    router.push('/checkout?mode=buynow')
  }

  return (
    <div className="group rounded-[22px] bg-white border border-[rgba(107,31,31,0.08)] shadow-[0_4px_20px_rgba(107,31,31,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_14px_40px_rgba(107,31,31,0.1)] hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-mithai-cream">
        <Link href={`/shop/${product.slug}`} className="block h-full w-full">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <ShoppingBag size={40} className="text-mithai-taupe/30" />
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.bestSeller && (
            <span className="px-2.5 py-1 rounded-full bg-mithai-gold text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Bestseller
            </span>
          )}
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="px-2.5 py-1 rounded-full bg-green-500 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% Off
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggle(product)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
            wishlisted
              ? 'bg-mithai-maroon text-white'
              : 'bg-white/90 text-mithai-maroon hover:bg-mithai-maroon hover:text-white'
          }`}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <Link href={`/shop/${product.slug}`}>
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-mithai-gold mb-1.5">
            {typeof product.category === 'object' && product.category?.name
              ? product.category.name
              : product.foodType || 'Snack'}
          </p>
          <h3 className="font-runiga text-base font-semibold text-mithai-maroonD mb-1 leading-tight line-clamp-2 group-hover:text-mithai-maroon transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.weight && (
          <p className="text-xs text-mithai-taupe mb-2">{product.weight}</p>
        )}

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-mithai-maroon">₹{product.price}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-mithai-taupe line-through">₹{product.comparePrice}</span>
          )}
          {product.rating > 0 && (
            <span className="ml-auto flex items-center gap-1 text-xs text-mithai-taupe">
              <span className="text-mithai-gold">★</span>
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => addItem(product, 1)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-mithai-maroon text-white py-2.5 rounded-full text-xs font-semibold transition-all hover:bg-mithai-maroonL hover:shadow-[0_4px_16px_rgba(144,12,0,0.3)]"
          >
            <ShoppingBag size={13} />
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-1 bg-mithai-gold text-white px-4 py-2.5 rounded-full text-xs font-semibold transition-all hover:bg-[#e69400] hover:shadow-[0_4px_16px_rgba(255,165,32,0.3)]"
            title="Buy Now"
          >
            <Zap size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Shop Body ───────────────────────────────────────── */

function ShopBody() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // State
  const [products, setProducts] = useState<IProduct[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // Initialize from URL params
  useEffect(() => {
    const q = searchParams.get('search')
    if (q) setSearchQuery(q)
    const cat = searchParams.get('category')
    if (cat) setActiveCategory(cat)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch categories from DB
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data.categories || [])
      } catch {
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  // Fetch products from DB
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (activeCategory !== 'all') params.set('category', activeCategory)
      params.set('limit', '100')

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data.products || [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, activeCategory])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Handle category click
  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug)
    // Update URL without full page reload
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'all') {
      params.delete('category')
    } else {
      params.set('category', slug)
    }
    router.push(`/shop?${params.toString()}`, { scroll: false })
  }

  // Group products by category for the "all" view
  const groupedProducts = useMemo(() => {
    if (activeCategory !== 'all') return null

    const groups: { name: string; slug: string; products: IProduct[] }[] = []
    const categoryMap = new Map<string, IProduct[]>()
    const categoryNameMap = new Map<string, string>()

    for (const product of products) {
      const cat = typeof product.category === 'object' && product.category
        ? product.category
        : null
      const catSlug = cat?.slug || 'uncategorized'
      const catName = cat?.name || 'Other'

      if (!categoryMap.has(catSlug)) {
        categoryMap.set(catSlug, [])
        categoryNameMap.set(catSlug, catName)
      }
      categoryMap.get(catSlug)!.push(product)
    }

    // Order by the categories fetched from DB, then append any extras
    const orderedSlugs = categories.map(c => c.slug)
    const allSlugs = new Set([...orderedSlugs, ...categoryMap.keys()])

    for (const slug of allSlugs) {
      const prods = categoryMap.get(slug)
      if (prods && prods.length > 0) {
        groups.push({
          name: categoryNameMap.get(slug) || slug,
          slug,
          products: prods,
        })
      }
    }

    // Also include categories with 0 products (from DB) so they show "Coming soon"
    for (const cat of categories) {
      if (!categoryMap.has(cat.slug) || categoryMap.get(cat.slug)!.length === 0) {
        if (!groups.find(g => g.slug === cat.slug)) {
          groups.push({ name: cat.name, slug: cat.slug, products: [] })
        }
      }
    }

    return groups
  }, [products, categories, activeCategory])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-mithai-off pt-[72px]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-mithai-gold mb-2">Shop All Products</div>
            <h1 className="font-medino text-[clamp(28px,5vw,42px)] font-normal text-mithai-maroonD tracking-[-0.01em] leading-[0.95] mb-3">
              Our Treats
            </h1>
            <p className="text-sm text-mithai-taupe max-w-xl">
              Explore our handcrafted collection of delicious treats.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mithai-taupe/60" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-mithai-taupe/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-mithai-gold/40 focus:border-mithai-gold transition-all"
              />
            </div>
          </div>

          {/* ─── Category Filter Tabs ─────────────────────── */}
          <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 min-w-max">
              {/* "All" tab */}
              <button
                onClick={() => handleCategoryClick('all')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-mithai-maroon text-white shadow-[0_4px_16px_rgba(144,12,0,0.25)]'
                    : 'bg-white text-mithai-maroonD border border-mithai-taupe/20 hover:border-mithai-maroon/30 hover:bg-mithai-maroonP'
                }`}
              >
                <LayoutGrid size={14} />
                All
              </button>

              {/* Dynamic category tabs */}
              {categories.map((cat) => (
                <button
                  key={cat.id || cat._id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeCategory === cat.slug
                      ? 'bg-mithai-maroon text-white shadow-[0_4px_16px_rgba(144,12,0,0.25)]'
                      : 'bg-white text-mithai-maroonD border border-mithai-taupe/20 hover:border-mithai-maroon/30 hover:bg-mithai-maroonP'
                  }`}
                >
                  {cat.name}
                  {cat._count && cat._count.products > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      activeCategory === cat.slug
                        ? 'bg-white/20 text-white'
                        : 'bg-mithai-cream text-mithai-taupe'
                    }`}>
                      {cat._count.products}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ─── Content ──────────────────────────────────── */}
          {loading ? (
            /* Loading skeleton */
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-[22px] bg-white border border-[rgba(107,31,31,0.08)] overflow-hidden animate-pulse">
                  <div className="h-52 bg-mithai-cream" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-mithai-cream rounded w-1/3" />
                    <div className="h-4 bg-mithai-cream rounded w-2/3" />
                    <div className="h-5 bg-mithai-cream rounded w-1/4" />
                    <div className="h-10 bg-mithai-cream rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 && activeCategory !== 'all' ? (
            /* No products in this category */
            <div className="rounded-[22px] bg-white border border-[rgba(107,31,31,0.08)] p-16 text-center">
              <ShoppingBag size={48} className="mx-auto mb-4 text-mithai-taupe/30" />
              <h3 className="font-runiga text-xl font-semibold text-mithai-maroonD mb-2">No products yet</h3>
              <p className="text-sm text-mithai-taupe mb-6 max-w-md mx-auto">
                This category doesn&apos;t have any products yet. Check back soon!
              </p>
              <button
                onClick={() => handleCategoryClick('all')}
                className="px-6 py-2.5 bg-mithai-maroon text-white rounded-full text-sm font-semibold hover:bg-mithai-maroonL transition-all"
              >
                View All Products
              </button>
            </div>
          ) : activeCategory === 'all' && groupedProducts ? (
            /* ─── ALL: Grouped by category ──────────────── */
            <div className="space-y-14">
              {groupedProducts.map((group) => (
                <section key={group.slug} id={group.slug}>
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="font-runiga text-2xl font-bold text-mithai-maroonD">{group.name}</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-mithai-maroon/20 to-transparent" />
                    <span className="text-xs font-semibold text-mithai-taupe bg-mithai-cream px-3 py-1 rounded-full">
                      {group.products.length} {group.products.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Products Grid */}
                  {group.products.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {group.products.map((product) => (
                        <ProductCard key={product._id || product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-mithai-taupe/15 bg-white/50 p-10 text-center">
                      <p className="text-sm text-mithai-taupe">Coming soon — stay tuned!</p>
                    </div>
                  )}
                </section>
              ))}
            </div>
          ) : (
            /* ─── Single category: flat grid ────────────── */
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-mithai-taupe">
                  {products.length} product{products.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <CartDrawer />
    </>
  )
}

/* ─── Page Export ───────────────────────────────────────────── */

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-mithai-off" />}>
      <ShopBody />
    </Suspense>
  )
}
