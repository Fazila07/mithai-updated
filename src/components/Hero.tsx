'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="hero-wrapper pt-[60px] bg-[#EDE3D5]">
      <section className="hero-banner relative w-full overflow-hidden">
        {/* Banner Image */}
        <div className="relative w-full">
          <Image
            src="/images/banner.jpg"
            alt="Mithai 2.0 - Guiltfree Goodies"
            width={1920}
            height={1280}
            priority
            unoptimized
            quality={100}
            className="w-full h-auto object-cover block"
            style={{ maxHeight: '80vh' }}
          />

          {/* Buttons Overlay - positioned at bottom-right of the banner */}
          <div
            className={`hero-banner-buttons absolute transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <a
              href="/shop"
              className="hero-banner-btn"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="btn-icon">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              Shop
            </a>
            <a
              href="/about"
              className="hero-banner-btn"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="btn-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              About
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-banner-buttons {
          position: absolute;
          bottom: 8%;
          left: 4%;
          display: flex;
          gap: 14px;
          align-items: center;
          z-index: 10;
        }

        .hero-banner-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #900c00;
          color: #ffa520;
          padding: 12px 32px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          border: 2px solid rgba(255, 165, 32, 0.3);
          box-shadow: 0 6px 28px rgba(144, 12, 0, 0.45),
                      inset 0 1px 0 rgba(255, 255, 255, 0.08);
          transition: all 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }

        .hero-banner-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 165, 32, 0.12),
            transparent
          );
          transition: left 0.5s ease;
        }

        .hero-banner-btn:hover::before {
          left: 100%;
        }

        .hero-banner-btn:hover {
          background-color: #b01600;
          transform: translateY(-2px);
          box-shadow: 0 10px 36px rgba(144, 12, 0, 0.55),
                      inset 0 1px 0 rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 165, 32, 0.55);
        }

        .hero-banner-btn:active {
          transform: translateY(0px);
          box-shadow: 0 4px 16px rgba(144, 12, 0, 0.4);
        }

        .btn-icon {
          flex-shrink: 0;
        }

        /* Responsive positioning */
        @media (max-width: 768px) {
          .hero-banner-buttons {
            bottom: 6%;
            left: 5%;
            gap: 10px;
          }

          .hero-banner-btn {
            padding: 10px 22px;
            font-size: 12px;
            gap: 6px;
          }

          .hero-banner-btn .btn-icon {
            width: 14px;
            height: 14px;
          }
        }

        @media (max-width: 480px) {
          .hero-banner-buttons {
            bottom: 5%;
            gap: 8px;
          }

          .hero-banner-btn {
            padding: 8px 18px;
            font-size: 11px;
          }
        }

        @media (min-width: 1200px) {
          .hero-banner-btn {
            padding: 14px 40px;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  )
}
