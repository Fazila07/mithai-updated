'use client'

import Image from 'next/image'

const HIGHLIGHTS = [
  { label: 'Almond Flour', image: '/images/almond flour.jpg' },
  { label: 'Ragi',         image: '/images/ragiii.jpg' },
  { label: 'Walnuts',      image: '/images/walnuts.jpg' },
  { label: 'Coconut Sugar',image: '/images/coconut.jpg' },
  { label: 'Flax Seeds',   image: '/images/flaxseeds.jpg' },
  { label: 'Vegan Chocolate', image: '/images/cocoa.jpeg' },
  { label: 'Jowar',        image: '/images/jowar.jpg' },
  { label: 'Desi Khandsari', image: '/images/sugarcane.jpg' },
]

const N          = HIGHLIGHTS.length   // 8
const ORBIT_R    = 275                 // px – orbit radius (center → centre of each badge card)
const POINT_SIZE = 110                 // px – badge card width & min-height (desktop)
const RING_DIAM  = ORBIT_R * 2        // 550 px – dotted ring diameter
const WRAP_SIZE  = RING_DIAM + POINT_SIZE + 44  // 704 px – outer wrapper square

export default function WhyUsSection() {
  return (
    <section id="why-us" className="sec bg-white">
      <div className="container">
        <div className="sec-head text-center">
          <h2 className="sec-title">Ingredients that goes in for you</h2>
        </div>

        {/* outer scaler keeps the fixed-px layout centred & clipped on narrow viewports */}
        <div className="ring-scaler">
          <div className="ring-wrap">

            {/* dotted ring – sized to the orbit circle, centred on the wrapper */}
            <div className="ring" />

            {/* centre card – unchanged */}
            <div className="center-card">
              <strong>Ingredients</strong>
            </div>

            {/* ingredient badges – each anchor is placed by JS-computed trig; the inner
                card floats independently so the transform stack stays clean */}
            {HIGHLIGHTS.map((item, i) => {
              const angle = (i / N) * 2 * Math.PI - Math.PI / 2  // start from top
              const x = Math.cos(angle) * ORBIT_R
              const y = Math.sin(angle) * ORBIT_R
              const delay = `${(i * 0.75).toFixed(2)}s`

              return (
                <div
                  key={item.label}
                  className="point-anchor"
                  style={{
                    top:  `calc(50% + ${y.toFixed(2)}px)`,
                    left: `calc(50% + ${x.toFixed(2)}px)`,
                  }}
                >
                  <div className="point" style={{ animationDelay: delay }}>
                    <div className="point-badge">
                      <Image
                        src={item.image}
                        alt={item.label}
                        width={42}
                        height={42}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="point-label">{item.label}</div>
                  </div>
                </div>
              )
            })}

          </div>{/* ring-wrap */}
        </div>{/* ring-scaler */}
      </div>

      <style jsx>{`
        /* ── outer scaler ─────────────────────────────────────────────── */
        .ring-scaler {
          display: flex;
          justify-content: center;
          overflow: hidden;        /* clip on small screens so no h-scroll */
        }

        /* ── fixed-size square stage ──────────────────────────────────── */
        .ring-wrap {
          position: relative;
          width:  ${WRAP_SIZE}px;
          height: ${WRAP_SIZE}px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
        }

        /* ── dotted ring – sized to RING_DIAM, centred on the stage ───── */
        .ring {
          position: absolute;
          width:  ${RING_DIAM}px;
          height: ${RING_DIAM}px;
          top:  50%;
          left: 50%;
          border-radius: 50%;
          border: 1.5px dashed rgba(107, 31, 31, 0.22);
          box-shadow: inset 0 0 0 1px rgba(227, 180, 72, 0.1);
          animation: spin 20s linear infinite;
        }

        /* ── centre product card – UNCHANGED ──────────────────────────── */
        .center-card {
          position: relative;
          z-index: 2;
          width: 240px;
          min-height: 240px;
          border-radius: 50%;
          background: radial-gradient(
            circle at top left,
            rgba(255, 165, 32, 0.24),
            rgba(255, 255, 255, 0.96)
          );
          border: 1px solid rgba(144, 12, 0, 0.12);
          box-shadow: 0 24px 50px rgba(144, 12, 0, 0.12);
          display: grid;
          place-items: center;
          padding: 26px;
          text-align: center;
          color: #900c00;
        }

        .center-card strong {
          display: block;
          font-family: 'Tan Pearl', serif;
          font-size: 1.1rem;
          line-height: 1.5;
          font-weight: 700;
        }

        /* ── position anchor (no animation transform here) ────────────── */
        .point-anchor {
          position: absolute;
          transform: translate(-50%, -50%);
          z-index: 3;
        }

        /* ── badge card (float animation lives here) ──────────────────── */
        .point {
          width: ${POINT_SIZE}px;
          padding: 14px 10px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(144, 12, 0, 0.12);
          box-shadow: 0 14px 36px rgba(144, 12, 0, 0.09);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #900c00;
          text-align: center;
          letter-spacing: 0.01em;
          animation: float 6s ease-in-out infinite;
        }

        .point-badge {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(
            135deg,
            rgba(227, 180, 72, 0.18),
            rgba(107, 31, 31, 0.08)
          );
          overflow: hidden;
          flex-shrink: 0;
        }

        .point-label {
          line-height: 1.25;
          word-break: break-word;
        }

        /* ── animations ───────────────────────────────────────────────── */
        @keyframes spin {
          0%   { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes float {
          0%,  100% { transform: translateY(0px); }
          50%        { transform: translateY(-9px); }
        }

        /* ── responsive – scale the whole composition down ────────────── */
        @media (max-width: 780px) {
          .ring-scaler {
            /* scale factor so the ${WRAP_SIZE}px stage fits in the viewport */
            transform-origin: top center;
          }
          .ring-wrap {
            transform: scale(0.72);
            transform-origin: top center;
            margin-bottom: -${Math.round(WRAP_SIZE * 0.28)}px;
          }
        }

        @media (max-width: 520px) {
          .ring-wrap {
            transform: scale(0.52);
            transform-origin: top center;
            margin-bottom: -${Math.round(WRAP_SIZE * 0.48)}px;
          }
        }

        @media (max-width: 380px) {
          .ring-wrap {
            transform: scale(0.42);
            transform-origin: top center;
            margin-bottom: -${Math.round(WRAP_SIZE * 0.58)}px;
          }
        }
      `}</style>
    </section>
  )
}
