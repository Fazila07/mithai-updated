'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

interface CouponData {
  id: string
  code: string
  description?: string
  discountType: 'percentage' | 'flat'
  value: number
  minOrder: number
  maxDiscount?: number
  expiryDate: string
}

const TAG_COLORS = [
  '#900c00', '#5A7A2B', '#b87333', '#7B3FA0', '#C0547A', '#8B5E3C',
  '#2563EB', '#0D9488', '#B45309',
]

function formatDiscount(c: CouponData): string {
  return c.discountType === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`
}

function getColor(idx: number): string {
  return TAG_COLORS[idx % TAG_COLORS.length]
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponData[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/coupons')
      .then((r) => r.json())
      .then((d) => setCoupons(d.coupons ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <main className="cp-main">
      {/* Header */}
      <div className="cp-header">
        <Link href="/" className="cp-back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </Link>
        <div>
          <h1 className="cp-title">Coupons &amp; Offers</h1>
          <p className="cp-sub">Save more on every order</p>
        </div>
        <span className="cp-badge-count">
          {loading ? '...' : `${coupons.length} Active`}
        </span>
      </div>

      {/* Info strip */}
      <div className="cp-strip">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Tap any coupon to copy the code. Apply it at checkout.
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="cp-loading">
          <Loader2 size={28} className="animate-spin" style={{ color: '#900c00' }} />
          <p>Loading coupons...</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="cp-loading">
          <p>No active coupons right now. Check back soon!</p>
        </div>
      ) : (
        /* Coupon cards */
        <div className="cp-list">
          {coupons.map((c, idx) => {
            const color = getColor(idx)
            return (
              <button
                key={c.id}
                className={`cp-card ${copied === c.code ? 'cp-card--copied' : ''}`}
                onClick={() => handleCopy(c.code)}
                aria-label={`Copy coupon ${c.code}`}
              >
                {/* Left colour stripe */}
                <div className="cp-stripe" style={{ background: color }} />

                {/* Main content */}
                <div className="cp-body">
                  <div className="cp-top">
                    <span className="cp-tag" style={{ background: `${color}18`, color }}>
                      {c.description || 'Discount'}
                    </span>
                    <span className="cp-discount" style={{ color }}>{formatDiscount(c)}</span>
                  </div>
                  <p className="cp-desc">{c.description || `Get ${formatDiscount(c).toLowerCase()} on your order`}</p>
                  <p className="cp-min">
                    Min. order ₹{c.minOrder}&nbsp;·&nbsp;Expires{' '}
                    {new Date(c.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {c.maxDiscount && c.discountType === 'percentage' && (
                      <>&nbsp;·&nbsp;Max ₹{c.maxDiscount}</>
                    )}
                  </p>
                </div>

                {/* Code pill + copy feedback */}
                <div className="cp-right">
                  <div className="cp-code-pill" style={{ borderColor: color, color }}>
                    {c.code}
                  </div>
                  <span className="cp-copy-label">
                    {copied === c.code ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied!
                      </>
                    ) : 'Tap to copy'}
                  </span>
                </div>

                {/* Dashed divider */}
                <div className="cp-divider" />
              </button>
            )
          })}
        </div>
      )}

      {/* Footer CTA */}
      <div className="cp-footer">
        <p className="cp-footer-text">Ready to save? Start shopping now!</p>
        <Link href="/shop" className="cp-shop-btn">
          Shop Now
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <style>{`
        .cp-main {
          min-height: 100vh;
          background: #fdf8ec;
          padding-bottom: 100px;
        }

        /* ── Header ── */
        .cp-header {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: rgba(253,248,236,0.96);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(107,31,31,0.10);
        }
        .cp-back {
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
        .cp-back:hover { background: #f7eae8; }
        .cp-title {
          font-family: 'Tan Pearl', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #5A1F1F;
          margin: 0;
          line-height: 1.2;
        }
        .cp-sub {
          font-size: 0.75rem;
          color: #9B7B6A;
          margin: 2px 0 0;
        }
        .cp-badge-count {
          margin-left: auto;
          font-size: 0.75rem;
          font-weight: 700;
          color: #900c00;
          background: rgba(144,12,0,0.09);
          padding: 4px 12px;
          border-radius: 100px;
          white-space: nowrap;
        }

        /* ── Info strip ── */
        .cp-strip {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 18px;
          background: rgba(144,12,0,0.05);
          font-size: 0.78rem;
          color: #6d0900;
          font-weight: 500;
          border-bottom: 1px solid rgba(144,12,0,0.07);
        }

        /* ── Loading ── */
        .cp-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 18px;
          color: #9B7B6A;
          font-size: 0.9rem;
        }

        /* ── List ── */
        .cp-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 18px;
          max-width: 640px;
          margin: 0 auto;
        }

        /* ── Coupon card ── */
        .cp-card {
          position: relative;
          display: flex;
          align-items: stretch;
          gap: 0;
          background: #fff;
          border-radius: 16px;
          border: 1.5px solid rgba(107,31,31,0.10);
          box-shadow: 0 4px 16px rgba(107,31,31,0.06);
          overflow: hidden;
          cursor: pointer;
          text-align: left;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
          width: 100%;
          padding: 0;
        }
        .cp-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(107,31,31,0.12);
        }
        .cp-card:active { transform: scale(0.98); }
        .cp-card--copied {
          border-color: rgba(34,139,34,0.35);
          box-shadow: 0 4px 16px rgba(34,139,34,0.10);
        }

        /* Left colour stripe */
        .cp-stripe {
          width: 6px;
          flex-shrink: 0;
        }

        /* Body */
        .cp-body {
          flex: 1;
          padding: 14px 12px;
          min-width: 0;
        }
        .cp-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
          gap: 8px;
        }
        .cp-tag {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }
        .cp-discount {
          font-family: 'Tan Pearl', serif;
          font-size: 1.1rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .cp-desc {
          font-size: 0.82rem;
          color: #3a2010;
          font-weight: 600;
          margin: 0 0 5px;
        }
        .cp-min {
          font-size: 0.72rem;
          color: #9B7B6A;
          margin: 0;
        }

        /* Right: code + label */
        .cp-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 14px 14px 14px 8px;
          flex-shrink: 0;
        }
        .cp-code-pill {
          border: 2px dashed;
          border-radius: 8px;
          padding: 5px 10px;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          background: transparent;
          white-space: nowrap;
        }
        .cp-copy-label {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.65rem;
          font-weight: 600;
          color: #9B7B6A;
          white-space: nowrap;
        }
        .cp-card--copied .cp-copy-label {
          color: #228B22;
        }

        /* Dashed divider between body and right (decorative) */
        .cp-divider {
          position: absolute;
          left: 6px;
          right: 0;
          top: 50%;
          width: 1px;
          height: 70%;
          transform: translateY(-50%);
          display: none;
        }

        /* ── Footer CTA ── */
        .cp-footer {
          text-align: center;
          padding: 28px 18px;
          max-width: 640px;
          margin: 0 auto;
        }
        .cp-footer-text {
          font-size: 0.9rem;
          color: #9B7B6A;
          margin-bottom: 14px;
        }
        .cp-shop-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #900c00;
          color: #fff;
          padding: 13px 28px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 4px 18px rgba(144,12,0,0.28);
          transition: all 0.2s;
        }
        .cp-shop-btn:hover { background: #b01600; transform: translateY(-2px); }
      `}</style>
    </main>
  )
}
