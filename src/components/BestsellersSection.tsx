'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

interface Product {
  _id: string
  name: string
  price: number
  comparePrice?: number
  images?: string[]
  bestSeller?: boolean
  rating?: number
  slug: string
  description?: string
}




export default function BestsellersSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { toggle, isWishlisted } = useWishlistStore()

  useEffect(() => {
    setMounted(true)
    const fetchBestsellers = async () => {
      try {
        const res = await fetch('/api/products?bestSeller=true&limit=8&sort=bestseller')
        const data = await res.json()
        const fetched: Product[] = (data.products || []).map((p: Record<string, unknown>) => ({
          _id: (p._id || p.id) as string,
          name: p.name as string,
          price: p.price as number,
          comparePrice: p.comparePrice as number | undefined,
          images: p.images as string[] | undefined,
          bestSeller: p.bestSeller as boolean | undefined,
          rating: p.rating as number | undefined,
          slug: p.slug as string,
          description: (p.shortDescription || p.description) as string | undefined,
        }))
        setProducts(fetched)
      } catch (error) {
        console.error('Failed to fetch bestsellers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBestsellers()
  }, [])

  const handleAddToCart = (product: Product) => {
    addItem(
      {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        description: '',
        shortDescription: '',
        price: product.price,
        images: product.images || [],
        category: '',
        ingredients: [],
        stock: 10,
        tags: [],
        featured: false,
        bestSeller: true,
        rating: product.rating || 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      1
    )
  }

  const buildProduct = (product: Product) => ({
    _id: product._id,
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    shortDescription: '',
    price: product.price,
    images: product.images || [],
    category: '',
    ingredients: [],
    stock: 10,
    tags: [],
    featured: false,
    bestSeller: true,
    rating: product.rating || 0,
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  return (
    <section id="bestsellers" className="sec bg-mithai-goldP">
      <div className="container">
        <div className="sec-head">
          <span className="sec-label">Customer Favorites</span>
          <h2 className="sec-title">Best Sellers</h2>
          <p className="sec-sub">Loved by hundreds. Join the happy customers.</p>
        </div>

        {!loading && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => {
              const wishlisted = mounted && isWishlisted(product._id)
              return (
                <div key={product._id} className="product-card">
                  <div className="product-img">
                    <span className="ptag">Best Seller</span>
                    {/* Heart / Wishlist button */}
                    <button
                      className={`wish-btn ${wishlisted ? 'wish-btn--active' : ''}`}
                      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                      onClick={() => toggle(buildProduct(product))}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">🍪</span>
                    )}
                  </div>
                  <div className="pinfo">
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="pname hover:text-mithai-maroon transition-colors">{product.name}</h3>
                    </Link>
                    {product.description && <p className="pdesc">{product.description}</p>}
                    <div className="pfooter">
                      <div className="pprice">
                        ₹{Math.floor(product.price)}
                        {product.comparePrice ? (
                          <span className="line-through text-xs ml-1">₹{Math.floor(product.comparePrice)}</span>
                        ) : null}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="add-btn hover:bg-mithai-maroonL transition-colors"
                        aria-label="Add to cart"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/shop" className="btn-primary">
            View All Products
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <style jsx>{`
          .products-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
          .product-card {
            border-radius: 18px;
            background: var(--cream);
            border: 1px solid rgba(107, 31, 31, 0.1);
            overflow: hidden;
            transition: transform 0.22s, box-shadow 0.22s;
          }
          .product-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 32px rgba(107, 31, 31, 0.15);
          }
          .product-img {
            width: 100%;
            aspect-ratio: 1;
            background: linear-gradient(135deg, #f7f3ee, #ede3d5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 52px;
            position: relative;
          }
          .ptag {
            position: absolute;
            top: 10px;
            left: 10px;
            background: #ffa520;
            color: #900c00;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 0.06em;
            padding: 4px 9px;
            border-radius: 100px;
            text-transform: uppercase;
            z-index: 1;
          }
          /* ── Heart / Wishlist button ── */
          .wish-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 2;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            border: 1.5px solid rgba(144, 12, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #c0392b;
            transition: background 0.18s, transform 0.18s, color 0.18s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          .wish-btn:hover {
            background: #fff0f0;
            transform: scale(1.12);
          }
          .wish-btn:active { transform: scale(0.92); }
          .wish-btn--active {
            background: #fff0f0;
            color: #900c00;
            border-color: rgba(144, 12, 0, 0.35);
          }
          .pinfo { padding: 13px; }
          .pname {
            font-size: 13px;
            font-weight: 700;
            color: #2a1810;
            margin-bottom: 8px;
            display: block;
          }
          .pdesc {
            font-size: 12px;
            color: #6d0900;
            line-height: 1.5;
            margin: 0 0 10px;
          }
          .pfooter {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .pprice {
            font-family: 'Libre Baskerville', serif;
            font-size: 17px;
            font-weight: 700;
            color: #900c00;
          }
          .add-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #900c00;
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            line-height: 1;
            box-shadow: 0 3px 10px rgba(144, 12, 0, 0.28);
            transition: transform 0.18s, background 0.18s;
            cursor: pointer;
            flex-shrink: 0;
          }
          .add-btn:active { transform: scale(0.9); }
          .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #900c00;
            color: #fff;
            padding: 13px 28px;
            border-radius: 100px;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.03em;
            border: none;
            box-shadow: 0 4px 18px rgba(144, 12, 0, 0.32);
            transition: all 0.22s;
            text-decoration: none;
            cursor: pointer;
          }
          .btn-primary:hover {
            background: #b01600;
            box-shadow: 0 10px 32px rgba(144, 12, 0, 0.45);
            transform: translateY(-2px);
          }
          @media (min-width: 640px) {
            .products-grid { grid-template-columns: repeat(3, 1fr); }
          }
          @media (min-width: 960px) {
            .products-grid { grid-template-columns: repeat(4, 1fr); }
          }
        `}</style>
      </div>
    </section>
  )
}
