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
          <div className="cat-grid">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="cat-card animate-pulse">
                <div className="cat-image">
                  <div className="cat-image-inner" style={{ background: 'rgba(144,12,0,0.05)' }} />
                </div>
                <div className="cat-copy">
                  <div style={{ height: 20, width: '60%', background: 'rgba(144,12,0,0.08)', borderRadius: 6, marginBottom: 8 }} />
                  <div style={{ height: 14, width: '80%', background: 'rgba(144,12,0,0.05)', borderRadius: 6, marginBottom: 14 }} />
                  <div style={{ height: 14, width: '30%', background: 'rgba(144,12,0,0.08)', borderRadius: 6 }} />
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

        <div className="cat-grid" data-count={categories.length}>
          {categories.map((cat) => (
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
              <div className="cat-copy">
                <h3>{cat.name}</h3>
                <p>{cat.description || `Explore our ${cat.name.toLowerCase()}`}</p>
                <span>
                  Shop
                  {cat._count && cat._count.products > 0 && (
                    <> · {cat._count.products}</>
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>

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
  .cat-grid {
    display: grid;
    gap: 18px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .cat-card {
    display: block;
    border-radius: 28px;
    overflow: hidden;
    background: white;
    border: 1px solid rgba(107, 31, 31, 0.12);
    box-shadow: 0 12px 32px rgba(107, 31, 31, 0.08);
    transition: transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease;
    text-decoration: none;
    color: inherit;
  }
  .cat-card:hover {
    transform: translateY(-4px);
    border-color: rgba(107, 31, 31, 0.2);
    box-shadow: 0 18px 38px rgba(107, 31, 31, 0.14);
  }
  .cat-card:hover .cat-photo {
    transform: scale(1.06);
  }
  .cat-image {
    position: relative;
    min-height: 180px;
    display: grid;
    place-items: center;
    background: radial-gradient(circle at top left, rgba(227, 180, 72, 0.18), transparent 40%),
      linear-gradient(135deg, #f7f3ee 0%, #fbf5ec 100%);
    overflow: hidden;
  }
  .cat-image--has-photo {
    min-height: 200px;
    background: #f7f3ee;
  }
  .cat-image::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.1), transparent 70%);
    pointer-events: none;
    z-index: 1;
  }
  .cat-image--has-photo::after {
    background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.06) 100%);
  }
  .cat-photo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .cat-image-inner {
    position: relative;
    width: 96px;
    height: 96px;
    border-radius: 24px;
    display: grid;
    place-items: center;
    background: rgba(144, 12, 0, 0.08);
    color: #900c00;
    font-size: 2.5rem;
  }
  .cat-copy {
    padding: 22px;
  }
  .cat-copy h3 {
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: #6d0900;
  }
  .cat-copy p {
    margin-bottom: 14px;
    font-size: 0.95rem;
    color: #6d0900;
    line-height: 1.7;
  }
  .cat-copy span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    font-weight: 700;
    color: #b01600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }
  @media (min-width: 640px) {
    .cat-grid {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .cat-image--has-photo {
      min-height: 220px;
    }
  }
  @media (min-width: 1024px) {
    .cat-grid {
      grid-template-columns: repeat(4, 1fr);
    }
    .cat-image--has-photo {
      min-height: 240px;
    }
  }
`
