'use client'

import { useState, useEffect } from 'react'

const HIGHLIGHTS = [
  { label: 'Almond Flour', image: '/images/almond flour.jpg' },
  { label: 'Ragi', image: '/images/ragiii.jpg' },
  { label: 'Walnuts', image: '/images/walnuts.jpg' },
  { label: 'Coconut Sugar', image: '/images/coconut.jpg' },
  { label: 'Flax Seeds', image: '/images/flaxseeds.jpg' },
  { label: 'Vegan Chocolate', image: '/images/cocoa.jpeg' },
  { label: 'Jowar', image: '/images/jowar.jpg' },
  { label: 'Desi Khandsari', image: '/images/sugarcane.jpg' },
]

const SLIDESHOW_IMAGES = [
  '/images/ragiladdu.jpg',
  '/images/redvelvet cookies.jpg',
  '/images/chocochip cookies.jpg',
  '/images/walnut brownie.jpg',
]

// Orbit radius as a % of the ring-wrap width.
// The ring uses inset = (50 - ORBIT_PCT)% so its radius matches this orbit exactly.
const ORBIT_PCT = 37.5   // ingredient centres sit at 37.5% from the wrapper centre
const RING_INSET = 50 - ORBIT_PCT  // = 12.5%

export default function IngredientsSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="ingredients" className="sec ingredients-section">
      <div className="container">
        <div className="sec-head text-center">
          <h2 className="sec-title ingredients-title">Ingredients that goes in for you</h2>
        </div>

        <div className="ring-wrap">
          {/* Dotted ring – radius = ORBIT_PCT% of wrapper, centred on wrapper */}
          <div className="ring" />

          {/* Centre slideshow card – unchanged */}
          <div className="center-card">
            <div className="slideshow-container">
              {SLIDESHOW_IMAGES.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="slideshow-image"
                  style={{ opacity: index === currentImageIndex ? 1 : 0 }}
                />
              ))}
            </div>
          </div>

          {/* Ingredient badges – positioned by trig, centred with CSS */}
          {HIGHLIGHTS.map((item, index) => {
            const angleDeg = index * 45 - 90
            const rad = (angleDeg * Math.PI) / 180
            const top = 50 + Math.sin(rad) * ORBIT_PCT
            const left = 50 + Math.cos(rad) * ORBIT_PCT
            const delay = `${(index * 0.75).toFixed(2)}s`

            return (
              <div
                key={item.label}
                className="point-anchor"
                style={{ top: `${top}%`, left: `${left}%` }}
              >
                <div className="point" style={{ animationDelay: delay }}>
                  <div className="point-badge">
                    <img src={item.image} alt={item.label} />
                  </div>
                  <div className="point-label">{item.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .ingredients-section {
          background: #ffffff;
          padding: 2px 2px;
        }

        .ingredients-title {
          font-family: 'Tan Pearl', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #900c00;
          margin-bottom: 50px;
          letter-spacing: 0.02em;
        }

        /* ── wrapper square ──────────────────────────────────────────── */
        .ring-wrap {
          position: relative;
          width: min(800px, 100%);
          aspect-ratio: 1 / 1;
          margin: 0 auto;
          display: grid;
          place-items: center;
          padding: 20px 2px;
        }

        /* ── dotted ring: inset = (50 - ORBIT_PCT)% = ${RING_INSET}%
               so its radius equals ORBIT_PCT% of the wrapper ─────────── */
        .ring {
          position: absolute;
          inset: ${RING_INSET}%;
          border-radius: 50%;
          border: 2px dashed rgba(227, 180, 72, 0.35);
          box-shadow: inset 0 0 0 1px rgba(227, 180, 72, 0.12);
          animation: spin 25s linear infinite;
          pointer-events: none;
        }

        /* ── centre card ─────────────────────────────────────────────── */
        .center-card {
          position: absolute;
          z-index: 2;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: white;
          border: 3px solid rgba(227, 180, 72, 0.3);
          box-shadow: 0 20px 60px rgba(90,31,31,0.15), inset 0 0 0 1px rgba(227,180,72,0.1);
          display: grid;
          place-items: center;
          overflow: hidden;
        }

        .slideshow-container {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
        }

        .slideshow-image {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
          display: block;
        }

        /* ── positioning anchor – no animation transform here ────────── */
        .point-anchor {
          position: absolute;
          transform: translate(-50%, -50%);
          z-index: 3;
        }

        /* ── badge card – float animation only ───────────────────────── */
        .point {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          color: #6d0900;
          animation: float 6s ease-in-out infinite;
        }

        .point-badge {
          width: 95px;
          height: 95px;
          border-radius: 50%;
          background: white;
          border: 4px solid rgba(255, 255, 255, 0.75);
          box-shadow: 0 8px 28px rgba(90, 31, 31, 0.14);
          overflow: hidden;
          flex-shrink: 0;
        }

        .point-badge img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .point-label {
          font-weight: 700;
          letter-spacing: 0.01em;
          color: #900c00;
          line-height: 1.2;
          font-size: 0.9rem;
          max-width: 100px;
        }

        /* ── animations ──────────────────────────────────────────────── */
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes float {
          0%,  100% { transform: translateY(0px); }
          50%        { transform: translateY(-8px); }
        }

        /* ── responsive ──────────────────────────────────────────────── */
        @media (max-width: 768px) {
          .ingredients-title { font-size: 1.8rem; margin-bottom: 30px; }

          .ring-wrap { width: min(600px, 100%); padding: 10px 4px; }

          .center-card { width: 200px; height: 200px; }

          .point-badge { width: 75px; height: 75px; }

          .point-label { font-size: 0.75rem; }
        }

        @media (max-width: 480px) {
          .ingredients-title { font-size: 1.5rem; margin-bottom: 20px; }

          .ring-wrap { width: 100%; padding: 4px 0; }

          .center-card { width: 140px; height: 140px; }

          .point-badge { width: 60px; height: 60px; }

          .point-label { font-size: 0.68rem; max-width: 72px; }
        }
      `}</style>
    </section>
  )
}
