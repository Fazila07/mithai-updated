'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false)
  const { items, remove } = useWishlistStore()
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <main className="wl-main">
      {/* Header */}
      <div className="wl-header">
        <Link href="/" className="wl-back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </Link>
        <h1 className="wl-title">My Wishlist</h1>
        <span className="wl-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
      </div>

      {items.length === 0 ? (
        /* Empty state */
        <div className="wl-empty">
          <div className="wl-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h2 className="wl-empty-title">Your wishlist is empty</h2>
          <p className="wl-empty-sub">Tap the ♥ on any product to save it here for later.</p>
          <Link href="/shop" className="wl-shop-btn">
            Browse Products
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="wl-grid">
          {items.map((product) => (
            <div key={product._id} className="wl-card">
              {/* Image */}
              <div className="wl-img">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <span className="wl-emoji">🍪</span>
                )}
                {/* Remove from wishlist */}
                <button
                  className="wl-remove"
                  aria-label="Remove from wishlist"
                  onClick={() => remove(product._id)}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              {/* Info */}
              <div className="wl-info">
                <Link href={`/shop/${product.slug}`}>
                  <h3 className="wl-name">{product.name}</h3>
                </Link>
                {product.description && (
                  <p className="wl-desc">{product.description}</p>
                )}
                <div className="wl-footer">
                  <span className="wl-price">
                    ₹{Math.floor(product.price)}
                    {product.comparePrice ? (
                      <span className="wl-compare">₹{Math.floor(product.comparePrice)}</span>
                    ) : null}
                  </span>
                  <button
                    className="wl-cart-btn"
                    onClick={() => addItem(product, 1)}
                    aria-label="Add to cart"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .wl-main {
          min-height: 100vh;
          background: #fdf8ec;
          padding-bottom: 100px;
        }

        /* ── Header ── */
        .wl-header {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: rgba(253,248,236,0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(107,31,31,0.10);
        }
        .wl-back {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid rgba(144,12,0,0.18);
          color: #900c00;
          text-decoration: none;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .wl-back:hover { background: #f7eae8; }
        .wl-title {
          flex: 1;
          font-family: 'Libre Baskerville', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #5A1F1F;
        }
        .wl-count {
          font-size: 0.8rem;
          font-weight: 600;
          color: #900c00;
          background: rgba(144,12,0,0.09);
          padding: 3px 10px;
          border-radius: 100px;
        }

        /* ── Empty state ── */
        .wl-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 80px 24px;
          gap: 16px;
        }
        .wl-empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(144,12,0,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c0392b;
        }
        .wl-empty-icon svg { width: 38px; height: 38px; }
        .wl-empty-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #5A1F1F;
        }
        .wl-empty-sub {
          font-size: 0.9rem;
          color: #9B7B6A;
          max-width: 280px;
        }
        .wl-shop-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #900c00;
          color: #fff;
          padding: 12px 26px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 4px 18px rgba(144,12,0,0.28);
          transition: all 0.2s;
          margin-top: 8px;
        }
        .wl-shop-btn:hover { background: #b01600; transform: translateY(-2px); }

        /* ── Product grid ── */
        .wl-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          padding: 18px;
        }
        @media (min-width: 600px) {
          .wl-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 900px) {
          .wl-grid { grid-template-columns: repeat(4, 1fr); }
        }

        /* ── Card ── */
        .wl-card {
          border-radius: 18px;
          background: #fff;
          border: 1px solid rgba(107,31,31,0.10);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .wl-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(107,31,31,0.12);
        }
        .wl-img {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(135deg, #f7f3ee, #ede3d5);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .wl-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .wl-emoji { font-size: 48px; }
        .wl-remove {
          position: absolute;
          top: 9px;
          right: 9px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          border: 1.5px solid rgba(144,12,0,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #c0392b;
          transition: background 0.15s, transform 0.15s;
        }
        .wl-remove:hover { background: #ffe8e8; transform: scale(1.1); }
        .wl-remove:active { transform: scale(0.9); }

        .wl-info { padding: 12px; }
        .wl-name {
          font-size: 13px;
          font-weight: 700;
          color: #2a1810;
          margin-bottom: 6px;
          display: block;
          text-decoration: none;
        }
        .wl-name:hover { color: #900c00; }
        .wl-desc {
          font-size: 11px;
          color: #6d0900;
          line-height: 1.5;
          margin: 0 0 10px;
        }
        .wl-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          flex-wrap: wrap;
        }
        .wl-price {
          font-family: 'Libre Baskerville', serif;
          font-size: 16px;
          font-weight: 700;
          color: #900c00;
        }
        .wl-compare {
          font-size: 11px;
          font-weight: 400;
          text-decoration: line-through;
          color: #9B7B6A;
          margin-left: 4px;
        }
        .wl-cart-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #900c00;
          color: #fff;
          border: none;
          border-radius: 100px;
          padding: 7px 13px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.18s, transform 0.15s;
          flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(144,12,0,0.22);
        }
        .wl-cart-btn:hover { background: #b01600; }
        .wl-cart-btn:active { transform: scale(0.95); }
      `}</style>
    </main>
  )
}
