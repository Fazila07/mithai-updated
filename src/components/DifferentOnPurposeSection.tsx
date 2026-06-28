'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'

const FEATURES = [
  {
    title: 'Gluten-Free',
    description: 'Crafted with ancient grains and millets to keep every bite light, clean, and nourishing.',
    icon: '🌾',
  },
  {
    title: 'Refined Sugar-Free',
    description: 'Sweetened with jaggery and coconut sugar for golden indulgence without the crash.',
    icon: '🍯',
  },
  {
    title: 'No Maida',
    description: 'Made without all-purpose flour, using whole grains and wholesome alternatives only.',
    icon: '🚫',
  },
  {
    title: 'No Preservatives',
    description: 'Fresh batches, honest pantry ingredients, and no artificial shelf-life additives.',
    icon: '🌿',
  },
  {
    title: 'PCOS / PCOD Friendly',
    description: 'Recipes designed with low glycemic, hormone-supporting ingredients at the core.',
    icon: '💗',
  },
  {
    title: 'Gut Friendly',
    description: 'Rich in fibre and gentle ingredients that nourish digestion and support wellbeing.',
    icon: '🥣',
  },
]

const TABS = [
  {
    id: 'began',
    label: 'Where It Began',
    title: 'A Journey of Purpose',
    content: 'Started in a small kitchen with a mission to create desserts that don\'t compromise on health. Every recipe is crafted with intention.',
    image: '/images/cocoa.jpeg',
  },
  {
    id: 'ingredients',
    label: 'Better Ingredients',
    title: 'No Shortcuts',
    content: 'We source the finest ingredients. No refined sugar. No maida. No artificial preservatives. Just real, wholesome goodness.',
    image: '/images/jowar.jpg',
  },
  {
    id: 'believe',
    label: 'What We Believe',
    title: 'Mindful Indulgence',
    content: 'Desserts should nourish, not punish. PCOS friendly. Gut friendly. Clean ingredients. Desserts for everyone.',
    image: '/images/chocochip cookies.jpg',
  },
  {
    id: 'every',
    label: 'For Every You',
    title: 'Inclusive Sweetness',
    content: 'Whether you\'re managing PCOS, avoiding sugar, or just want better snacks—there\'s something made for you with love.',
    image: '/images/banner.jpg',
  },
]

export default function DifferentOnPurposeSection() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section id="different" className="sec bg-white">
      <div className="container">
        <div className="sec-head text-center">

          <h2 className="sec-title">Made Different. On Purpose.</h2>

        </div>

        <div className="feature-grid">
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              className="feature-card"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="feature-icon">
                <span>{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="tabs-wrapper">
          <div className="tabs-nav">
            {TABS.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`tab-btn transition-all ${activeTab === idx
                  ? 'active border-b-2 border-mithai-maroon text-mithai-maroon'
                  : 'text-mithai-taupe hover:text-mithai-maroon'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tabs-content">
            {TABS.map((tab, idx) => (
              <div
                key={tab.id}
                className={`tab-pane transition-all duration-500 ${activeTab === idx ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
              >
                <div className="content-wrapper">
                  <div className="content-image">
                    <Image
                      src={tab.image}
                      alt={tab.label}
                      width={800}
                      height={500}
                      className="image"
                    />
                    <div className="overlay-card">
                      <h3 className="content-title">{tab.title}</h3>
                      <p className="content-body">{tab.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .sec-head {
          margin-bottom: 3rem;
        }
        .feature-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-bottom: 3.5rem;
        }
        .feature-card {
          background: rgba(255, 250, 244, 0.95);
          border: 1px solid rgba(107, 31, 31, 0.1);
          border-radius: 28px;
          padding: 26px;
          box-shadow: 0 18px 40px rgba(107, 31, 31, 0.08);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          display: grid;
          gap: 16px;
          min-height: 220px;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 50px rgba(107, 31, 31, 0.12);
        }
        .feature-icon {
          width: 60px;
          height: 60px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: rgba(144, 12, 0, 0.08);
          color: #900c00;
          font-size: 1.65rem;
          border: 1px solid rgba(144, 12, 0, 0.08);
        }
        .feature-card h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #900c00;
          margin: 0;
        }
        .feature-card p {
          margin: 0;
          color: #900c00;
          line-height: 1.7;
          font-size: 0.95rem;
        }
        .tabs-nav {
          display: flex;
          gap: 24px;
          margin-bottom: 40px;
          border-bottom: 1px solid rgba(176, 21, 7, 0.1);
          flex-wrap: wrap;
        }
        .tab-btn {
          padding: 12px 0;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
        }
        .tab-btn.active {
          color: #900c00;
          border-bottom-width: 2px;
          border-bottom-color: #900c00;
        }
        .tabs-content {
          position: relative;
          min-height: 500px;
        }
        .tab-pane {
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
        }
        .content-wrapper {
          display: flex;
          justify-content: center;
        }
        .content-image {
          position: relative;
          width: 100%;
          max-width: 800px;
          height: 500px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(107, 31, 31, 0.1);
        }
        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .overlay-card {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(155, 3, 3, 0.9);
          color: white;
          padding: 30px;
          border-radius: 0 0 24px 24px;
        }
        .content-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          font-family: 'Libre Baskerville', serif;
        }
        .content-body {
          font-size: 1rem;
          line-height: 1.6;
          opacity: 0.9;
        }
        @media (max-width: 1024px) {
          .feature-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 720px) {
          .feature-grid {
            grid-template-columns: 1fr;
          }
          .content-image {
            height: 420px;
          }
          .overlay-card {
            padding: 22px;
          }
          .content-title {
            font-size: 1.3rem;
          }
          .content-body {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </section>
  )
}
