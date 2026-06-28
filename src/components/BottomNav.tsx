'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartCount } from '@/store/cartStore'
import { useEffect, useState } from 'react'

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    iconFilled: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="white" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    label: 'Coupons',
    href: '/coupons',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
    iconFilled: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <circle cx="7" cy="7" r="1" fill="white"/>
      </svg>
    ),
  },
  {
    label: 'Shop',
    href: '/shop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    iconFilled: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2"/>
        <path d="M16 10a4 4 0 01-8 0" fill="none" stroke="white" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    label: 'Wishlist',
    href: '/wishlist',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    iconFilled: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    label: 'My account',
    href: '/login',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    iconFilled: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const itemCount = useCartCount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Spacer so page content isn't hidden behind the bar */}
      <div className="h-[68px] md:hidden" />

      <nav className="bottom-nav md:hidden">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href} className={`bottom-nav-item ${active ? 'bottom-nav-item--active' : ''}`}>
              <span className="bottom-nav-icon">
                {active ? item.iconFilled : item.icon}
                {/* Cart badge on Shop item */}
                {item.label === 'Shop' && mounted && itemCount > 0 && (
                  <span className="bottom-nav-badge">{itemCount > 9 ? '9+' : itemCount}</span>
                )}
              </span>
              <span className="bottom-nav-label">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          height: 68px;
          background: #fff;
          border-top: 1px solid rgba(107,31,31,0.10);
          box-shadow: 0 -4px 20px rgba(107,31,31,0.08);
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 4px;
        }
        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          flex: 1;
          padding: 8px 4px;
          color: #9B7B6A;
          text-decoration: none;
          transition: color 0.18s;
          -webkit-tap-highlight-color: transparent;
        }
        .bottom-nav-item--active {
          color: #900c00;
        }
        .bottom-nav-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bottom-nav-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.02em;
          line-height: 1;
          white-space: nowrap;
        }
        .bottom-nav-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background: #ffa520;
          color: #6d0900;
          font-size: 9px;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          border: 1.5px solid #fff;
        }
      `}</style>
    </>
  )
}
