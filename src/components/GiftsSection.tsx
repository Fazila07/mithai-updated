'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Hamper {
  _id: string
  name: string
  slug: string
  description: string
  image?: string
  categorySlug: string
}

const FALLBACK_HAMPERS: Hamper[] = [
  {
    _id: 'h1', name: 'All Cookies Hamper', slug: 'all-cookies-hamper',
    description: 'A premium box of all our signature guilt-free cookies. The perfect gift for cookie lovers.',
    categorySlug: 'cookies',
  },
  {
    _id: 'h2', name: 'All Brownies Hamper', slug: 'all-brownies-hamper',
    description: 'Rich, fudgy brownies collection — every variant in one beautiful box.',
    categorySlug: 'brownies',
  },
  {
    _id: 'h3', name: 'Mixed Treats Hamper', slug: 'mixed-treats-hamper',
    description: 'A little bit of everything — cookies, brownies, and cacao bites in a festive box.',
    categorySlug: '',
  },
  {
    _id: 'h4', name: 'Festive Gift Box', slug: 'festive-gift-box',
    description: 'Premium festive hamper with hand-picked assortment. Perfect for Diwali, Raksha Bandhan & more.',
    categorySlug: '',
  },
]

const HAMPER_EMOJIS = ['🍪', '🍫', '🎁', '🎀']
const HAMPER_COLORS = ['#B45309', '#7B3FA0', '#900c00', '#C0547A']

export default function GiftsSection() {
  const [hampers, setHampers] = useState<Hamper[]>(FALLBACK_HAMPERS)

  useEffect(() => {
    fetch('/api/hampers')
      .then((r) => r.json())
      .then((d) => {
        if (d.hampers && d.hampers.length > 0) {
          setHampers(d.hampers)
        }
      })
      .catch(() => {}) // fallback to defaults
  }, [])

  return (
    <section id="gifts" className="sec bg-white">
      <div className="container">
        {/* Banner */}
        <div className="banner">
          <div className="banner-inner">
            <h2 className="banner-title">
              Thoughtful <em>Gifting</em>
            </h2>
            <p className="banner-subtitle">
              Premium hampers & festive gift boxes. Made with love, wrapped with intention.
            </p>
          </div>
        </div>

        {/* Hamper Cards */}
        <div className="hamper-grid">
          {hampers.map((hamper, idx) => {
            const href = hamper.categorySlug
              ? `/shop?category=${hamper.categorySlug}`
              : '/shop'
            const color = HAMPER_COLORS[idx % HAMPER_COLORS.length]
            const emoji = HAMPER_EMOJIS[idx % HAMPER_EMOJIS.length]

            return (
              <Link key={hamper._id} href={href} className="hamper-card">
                <div className="hamper-icon" style={{ background: `${color}12`, color }}>
                  <span>{emoji}</span>
                </div>
                <h3 className="hamper-name">{hamper.name}</h3>
                <p className="hamper-desc">{hamper.description}</p>
                <span className="hamper-link" style={{ color }}>
                  View Hamper
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            )
          })}
        </div>

        <style jsx>{`
          .banner {
            background: linear-gradient(135deg, #900c00 0%, #b01600 50%, #900c00 100%);
            padding: 48px 32px;
            text-align: center;
            position: relative;
            overflow: hidden;
            border-radius: 24px;
            margin-bottom: 32px;
          }
          .banner::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: radial-gradient(circle, rgba(255, 165, 32, 0.13) 1px, transparent 1px);
            background-size: 24px 24px;
            pointer-events: none;
          }
          .banner-inner {
            position: relative;
            z-index: 1;
          }
          .banner-title {
            font-family: 'Libre Baskerville', serif;
            font-size: clamp(24px, 5vw, 38px);
            color: white;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 12px;
          }
          .banner-title em {
            font-style: italic;
            color: #ffa520;
          }
          .banner-subtitle {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            line-height: 1.65;
            max-width: 460px;
            margin: 0 auto;
          }

          /* ── Hamper Grid ── */
          .hamper-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          @media (min-width: 768px) {
            .hamper-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
          }

          .hamper-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 24px 16px;
            border-radius: 20px;
            border: 1.5px solid rgba(107,31,31,0.08);
            background: #fdfaf5;
            text-decoration: none;
            transition: all 0.22s;
          }
          .hamper-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(107,31,31,0.10);
            border-color: rgba(107,31,31,0.18);
          }

          .hamper-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            margin-bottom: 14px;
          }

          .hamper-name {
            font-family: 'Libre Baskerville', serif;
            font-size: 14px;
            font-weight: 700;
            color: #900c00;
            margin-bottom: 6px;
            line-height: 1.3;
          }

          .hamper-desc {
            font-size: 12px;
            color: #8a7a6a;
            line-height: 1.55;
            margin-bottom: 12px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .hamper-link {
            font-size: 11px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 4px;
            margin-top: auto;
            transition: gap 0.2s;
          }
          .hamper-card:hover .hamper-link { gap: 8px; }
        `}</style>
      </div>
    </section>
  )
}
