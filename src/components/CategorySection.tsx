'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface CategoryData {
  _id: string
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  _count?: { products: number }
}

/* ─── Static fallback categories (shown when DB is unreachable) ── */
const FALLBACK_CATEGORIES: CategoryData[] = [
  {
    _id: 'fallback-cookies',
    id: 'fallback-cookies',
    name: 'Cookies',
    slug: 'cookies',
    description: 'Handcrafted healthy cookies made with premium nuts and cacao',
    image: '/images/categories/cookies.png',
  },
  {
    _id: 'fallback-brownies',
    id: 'fallback-brownies',
    name: 'Brownies',
    slug: 'brownies',
    description: 'Rich, fudgy brownies made with clean ingredients and no refined sugar',
    image: '/images/categories/brownies.jpg',
  },
  {
    _id: 'fallback-cacao-bites',
    id: 'fallback-cacao-bites',
    name: 'Cacao Bites',
    slug: 'cacao-bites',
    description: 'Bite-sized cacao treats packed with flavor and nutrition',
    image: '/images/categories/cacao-bites.jpg',
  },
  {
    _id: 'fallback-laddus',
    id: 'fallback-laddus',
    name: 'Laddus',
    slug: 'laddus',
    description: 'Traditional Indian laddus reimagined with healthy, wholesome ingredients',
    image: '/images/categories/laddus.jpg',
  },
  {
    _id: 'fallback-crackers',
    id: 'fallback-crackers',
    name: 'Crackers',
    slug: 'crackers',
    description: 'Crunchy, savory crackers made with nutritious grains and seeds',
    image: '/images/categories/crackers.jpg',
  },
]

export default function CategorySection() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        // 6-second timeout to avoid hanging forever when DB is unreachable
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 6000)

        const res = await fetch('/api/categories', { signal: controller.signal })
        clearTimeout(timeout)

        const data = await res.json()
        const fetched = data.categories || []
        // Use DB data if available, otherwise fall back to static
        setCategories(fetched.length > 0 ? fetched : FALLBACK_CATEGORIES)
      } catch {
        // Network error, timeout, or DB unreachable → use static fallback
        setCategories(FALLBACK_CATEGORIES)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section id="categories" className="sec bg-mithai-off">
        <div className="container">
          <div className="sec-head text-center">
            <h2 className="sec-title">Dive In</h2>
          </div>
          <div className="cat-row cat-row--top">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="cat-card animate-pulse">
                <div className="cat-image">
                  <div className="cat-image-inner" style={{ background: 'rgba(144,12,0,0.05)' }} />
                </div>
                <div className="cat-label">
                  <div style={{ height: 18, width: '60%', background: 'rgba(144,12,0,0.08)', borderRadius: 6 }} />
                  <div style={{ height: 32, width: 32, background: 'rgba(144,12,0,0.05)', borderRadius: '50%' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="cat-row cat-row--bottom">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="cat-card animate-pulse">
                <div className="cat-image">
                  <div className="cat-image-inner" style={{ background: 'rgba(144,12,0,0.05)' }} />
                </div>
                <div className="cat-label">
                  <div style={{ height: 18, width: '60%', background: 'rgba(144,12,0,0.08)', borderRadius: 6 }} />
                  <div style={{ height: 32, width: 32, background: 'rgba(144,12,0,0.05)', borderRadius: '50%' }} />
                </div>
              </div>
            ))}
          </div>
          <style jsx>{catStyles}</style>
        </div>
      </section>
    )
  }

  return (
    <section id="categories" className="sec bg-mithai-off">
      <div className="container">
        <div className="sec-head text-center">
          <h2 className="sec-title">Dive In</h2>
        </div>

        {/* Row 1 — 3 categories */}
        <div className="cat-row cat-row--top">
          {categories.slice(0, 3).map((cat) => (
            <Link
              key={cat.id || cat._id}
              href={`/shop?category=${cat.slug}`}
              className="cat-card group"
            >
              <div className={`cat-image ${cat.image ? 'cat-image--has-photo' : ''}`}>
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="cat-photo" />
                ) : (
                  <div className="cat-image-inner">
                    <span>{getCategoryEmoji(cat.name)}</span>
                  </div>
                )}
              </div>
              <div className="cat-label">
                <h3>{cat.name}</h3>
                <span className="cat-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Row 2 — remaining categories (2) */}
        {categories.length > 3 && (
          <div className="cat-row cat-row--bottom">
            {categories.slice(3).map((cat) => (
              <Link
                key={cat.id || cat._id}
                href={`/shop?category=${cat.slug}`}
                className="cat-card group"
              >
                <div className={`cat-image ${cat.image ? 'cat-image--has-photo' : ''}`}>
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="cat-photo" />
                  ) : (
                    <div className="cat-image-inner">
                      <span>{getCategoryEmoji(cat.name)}</span>
                    </div>
                  )}
                </div>
                <div className="cat-label">
                  <h3>{cat.name}</h3>
                  <span className="cat-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <style jsx>{catStyles}</style>
      </div>
    </section>
  )
}

/* Fallback emoji mapping for categories without images */
function getCategoryEmoji(name: string): string {
  const map: Record<string, string> = {
    cookies: '🍪',
    brownies: '🍫',
    'cacao bites': '🟤',
    'cocoa bites': '🟤',
    laddus: '🧁',
    crackers: '🥨',
  }
  return map[name.toLowerCase()] || '🍬'
}

const catStyles = `
  /* ─── Row Layout ─────────────────────────────── */
  .cat-row {
    display: grid;
    gap: 16px;
  }
  .cat-row--top {
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: 16px;
  }
  .cat-row--bottom {
    grid-template-columns: repeat(2, 1fr);
  }

  /* ─── Card ───────────────────────────────────── */
  .cat-card {
    display: block;
    border-radius: 14px;
    overflow: hidden;
    background: white;
    border: 1px solid rgba(107, 31, 31, 0.09);
    box-shadow: 0 4px 20px rgba(107, 31, 31, 0.06);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.3s ease;
    text-decoration: none;
    color: inherit;
  }
  .cat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(107, 31, 31, 0.13);
  }
  .cat-card:active {
    transform: translateY(-2px);
  }

  /* ─── Image ──────────────────────────────────── */
  .cat-image {
    position: relative;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #f7f3ee 0%, #ede3d5 100%);
    overflow: hidden;
  }
  .cat-image--has-photo {
    background: #f7f3ee;
  }
  .cat-photo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .cat-card:hover .cat-photo {
    transform: scale(1.06);
  }
  .cat-image-inner {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    display: grid;
    place-items: center;
    background: rgba(144, 12, 0, 0.08);
    font-size: 2.2rem;
  }

  /* ─── Label (Name + Arrow) ────────────────── */
  .cat-label {
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cat-label h3 {
    flex: 1;
    font-family: 'Libre Baskerville', serif;
    font-size: 1rem;
    font-weight: 700;
    color: #900c00;
    margin: 0;
    line-height: 1.2;
  }
  .cat-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1.5px solid rgba(144, 12, 0, 0.18);
    color: #900c00;
    flex-shrink: 0;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
  }
  .cat-card:hover .cat-arrow {
    background: rgba(144, 12, 0, 0.08);
    border-color: rgba(144, 12, 0, 0.3);
    transform: rotate(0deg);
  }

  /* ─── Mobile (default: 2 columns) ────────── */
  @media (max-width: 639px) {
    .cat-row--top {
      grid-template-columns: repeat(2, 1fr);
    }
    /* Make the 3rd item in row 1 span full width centered */
    .cat-row--top .cat-card:nth-child(3) {
      grid-column: 1 / -1;
      max-width: 50%;
      justify-self: center;
    }
    .cat-row--bottom {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* ─── Tablet ──────────────────────────────── */
  @media (min-width: 640px) {
    .cat-row--top {
      grid-template-columns: repeat(3, 1fr);
    }
    .cat-row--bottom {
      grid-template-columns: repeat(2, 1fr);
      max-width: 66.666%;
      margin-left: auto;
      margin-right: auto;
    }
    .cat-label h3 {
      font-size: 1.1rem;
    }
    .cat-image {
      aspect-ratio: 4/3;
    }
  }

  /* ─── Desktop ─────────────────────────────── */
  @media (min-width: 1024px) {
    .cat-row {
      gap: 20px;
    }
    .cat-row--top {
      margin-bottom: 20px;
    }
    .cat-label {
      padding: 18px 22px;
    }
    .cat-label h3 {
      font-size: 1.2rem;
    }
  }
`

