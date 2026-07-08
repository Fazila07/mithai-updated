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
      <section id="categories" className="dive-in-section">
        <div className="dive-in-container">
          <h2 className="sec-title text-center mb-8">Shop Categories</h2>
          <div className="dive-in-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="dive-card animate-pulse">
                <div className="dive-card-image">
                  <div style={{ width: '100%', height: '100%', background: 'rgba(144,12,0,0.04)' }} />
                </div>
                <div className="dive-card-footer">
                  <div style={{ height: 16, width: '55%', background: 'rgba(144,12,0,0.07)', borderRadius: 6 }} />
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(144,12,0,0.05)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{diveInStyles}</style>
      </section>
    )
  }

  return (
    <section id="categories" className="dive-in-section">
      <div className="dive-in-container">
        <h2 className="sec-title text-center mb-8">Shop Categories</h2>

        <div className="dive-in-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id || cat._id}
              href={`/shop?category=${cat.slug}`}
              className="dive-card group"
            >
              <div className="dive-card-image">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="dive-photo" />
                ) : (
                  <div className="dive-emoji-fallback">
                    <span>{getCategoryEmoji(cat.name)}</span>
                  </div>
                )}
              </div>
              <div className="dive-card-footer">
                <h3 className="dive-card-name">{cat.name}</h3>
                <span className="dive-card-arrow">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{diveInStyles}</style>
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

const diveInStyles = `
  /* ─── Section ─────────────────────────────────── */
  .dive-in-section {
    background: #ffffff;
    padding: 56px 16px 64px;
  }

  .dive-in-container {
    max-width: 440px;
    margin: 0 auto;
  }

  /* ─── Title ───────────────────────────────────── */
  /* Replaced with sec-title */

  /* ─── Grid — always 2 columns ─────────────────── */
  .dive-in-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  /* ─── Card ────────────────────────────────────── */
  .dive-card {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
    background: #faf6f0;
    text-decoration: none;
    color: inherit;
    transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.32s ease;
  }
  .dive-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 36px rgba(107, 31, 31, 0.12);
  }
  .dive-card:active {
    transform: translateY(-1px);
  }

  /* ─── Image Area ──────────────────────────────── */
  .dive-card-image {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: linear-gradient(135deg, #f7f3ee 0%, #ede3d5 100%);
  }
  .dive-photo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .dive-card:hover .dive-photo {
    transform: scale(1.05);
  }
  .dive-emoji-fallback {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    font-size: 3rem;
  }

  /* ─── Footer (Name + Arrow) ───────────────────── */
  .dive-card-footer {
    padding: 10px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .dive-card-name {
    flex: 1;
    font-family: 'Lobster', cursive;
    font-size: 14px;
    font-weight: 400;
    color: #900c00;
    margin: 0;
    line-height: 1.25;
  }
  .dive-card-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1.5px solid rgba(144, 12, 0, 0.2);
    color: #900c00;
    flex-shrink: 0;
    transition: background 0.22s, border-color 0.22s, transform 0.22s;
  }
  .dive-card:hover .dive-card-arrow {
    background: rgba(144, 12, 0, 0.08);
    border-color: rgba(144, 12, 0, 0.4);
    transform: rotate(0deg);
  }

  /* ─── Tablet ────────────────────────────────── */
  @media (min-width: 640px) {
    .dive-in-section {
      padding: 72px 24px 80px;
    }
    .dive-in-container {
      max-width: 500px;
    }
    .dive-in-grid {
      gap: 14px;
    }
  }

  /* ─── Desktop — 3 columns in a row ─────────── */
  @media (min-width: 1024px) {
    .dive-in-section {
      padding: 80px 40px 96px;
    }
    .dive-in-container {
      max-width: 820px;
    }
    .dive-in-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }
    .dive-card {
      border-radius: 14px;
    }
    .dive-card-footer {
      padding: 12px 14px;
    }
    .dive-card-arrow {
      width: 32px;
      height: 32px;
    }
  }
`
