'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useCartCount } from '@/store/cartStore'
import { User, LogOut, Package, Heart, MapPin, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const itemCount = useCartCount()
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-white/95 backdrop-blur-[14px] border-b border-[rgba(107,31,31,0.10)] transition-all duration-300">
        <div className="relative h-full flex items-center justify-between px-[14px]">

          {/* ── Left: hamburger (mobile) / nav links (desktop) ── */}
          <div className="flex items-center gap-6">
            <button
              className="hamburger flex flex-col gap-[5px] p-1 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span className="block w-[22px] h-[2px] bg-mithai-maroon rounded transition-all duration-200" />
              <span className="block w-[22px] h-[2px] bg-mithai-maroon rounded transition-all duration-200" />
              <span className="block w-[22px] h-[2px] bg-mithai-maroon rounded transition-all duration-200" />
            </button>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-mithai-warmGray">
              <Link href="/" className="hover:text-mithai-maroon transition-colors">Home</Link>
              <Link href="/shop" className="hover:text-mithai-maroon transition-colors">Shop</Link>
              <Link href="/coupons" className="hover:text-mithai-maroon transition-colors">Coupons</Link>
            </div>
          </div>

          {/* ── Centre: logo ── */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center transition-opacity duration-200 hover:opacity-90"
          >
            <div className="brand-logo font-medino text-[#6B1F1A] text-center">
              <span className="brand-name">Mithai</span>
              <span className="brand-suffix">2.0</span>
            </div>
          </Link>

          {/* ── Right: user + cart ── */}
          <div className="flex items-center gap-2">
            {/* User icon / account */}
            <div className="relative" ref={menuRef}>
              {session?.user ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="nav-icon-btn"
                  aria-label="Account"
                >
                  {session.user.image ? (
                    <img src={session.user.image} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-mithai-maroon">
                      {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </button>
              ) : (
                <Link href="/login" className="nav-icon-btn" aria-label="Login">
                  <User size={17} strokeWidth={2.2} />
                </Link>
              )}

              {/* Dropdown menu */}
              {userMenuOpen && session?.user && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-mithai-charcoal truncate">{session.user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
                  </div>
                  <div className="py-1">
                    {session.user.role === 'ADMIN' && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-mithai-maroon font-semibold hover:bg-red-50 transition-colors">
                        <LayoutDashboard size={15} /> Admin Panel
                      </Link>
                    )}
                    <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                      <User size={15} /> My Account
                    </Link>
                    <Link href="/account/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                      <Package size={15} /> My Orders
                    </Link>
                    <Link href="/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                      <Heart size={15} /> Wishlist
                    </Link>
                    <Link href="/account/addresses" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                      <MapPin size={15} /> Addresses
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="nav-icon-btn nav-icon-btn--cart" aria-label="Cart">
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {mounted && (
                <span className="cart-badge">{itemCount > 9 ? '9+' : itemCount}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile full-screen menu ── */}
      <div
        className={`fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center gap-0 transition-all duration-300 ${
          mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        }`}
      >
        <button
          className="absolute top-[18px] right-[18px] text-2xl text-mithai-maroon leading-none bg-transparent border-none"
          onClick={() => setMobileMenuOpen(false)}
        >
          ✕
        </button>
        <div className="brand-logo text-[#6B1F1A] text-center mb-8">
          <span className="brand-name">Mithai</span>
          <span className="brand-suffix">2.0</span>
        </div>
        {[
          { href: '/', label: 'Home' },
          { href: '/shop', label: 'Shop' },
          { href: '/#bestsellers', label: 'Best Sellers' },
          { href: '/#categories', label: 'Categories' },
          { href: '/#why-us', label: 'Why Us?' },
          { href: '/coupons', label: '🎟️ Coupons' },
          ...(session?.user
            ? [
                ...(session.user.role === 'ADMIN' ? [{ href: '/admin', label: '🛠️ Admin Panel' }] : []),
                { href: '/account', label: '👤 My Account' },
                { href: '/account/orders', label: '📦 My Orders' },
              ]
            : [{ href: '/login', label: '🔑 Login' }]),
        ].map(({ href, label }) => (
          <Link
            key={href + label}
            href={href}
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-[17px] text-lg font-semibold text-mithai-charcoal border-b border-[rgba(107,31,31,0.08)] hover:text-mithai-maroon transition-colors"
          >
            {label}
          </Link>
        ))}
        {session?.user && (
          <button
            onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }) }}
            className="w-full text-center py-[17px] text-lg font-semibold text-red-600 hover:text-red-700 transition-colors"
          >
            🚪 Sign Out
          </button>
        )}
      </div>

      <style>{`
        /* Icon buttons — match the image circles */
        .nav-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1.5px solid rgba(144,12,0,0.18);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6d0900;
          cursor: pointer;
          position: relative;
          transition: background 0.16s, border-color 0.16s, transform 0.15s;
          text-decoration: none;
          flex-shrink: 0;
          overflow: hidden;
        }
        .nav-icon-btn:hover {
          background: #f7eae8;
          border-color: rgba(144,12,0,0.35);
          transform: translateY(-1px);
        }
        .nav-icon-btn:active {
          transform: translateY(0);
          background: #f0e0e0;
        }

        /* Cart badge */
        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #900c00;
          color: #FDF8EC;
          font-size: 9px;
          font-weight: 700;
          min-width: 17px;
          height: 17px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          border: 1.5px solid #fff;
          line-height: 1;
        }

        /* Brand logo */
        .brand-logo { white-space: nowrap; }
        .brand-logo .brand-name,
        .brand-logo .brand-suffix {
          display: inline-block;
          vertical-align: middle;
          line-height: 1;
          font-weight: 400;
        }
        .brand-logo .brand-name  { font-size: 2.15rem; color: #900c00; }
        .brand-logo .brand-suffix {
          font-size: 2.15rem;
          font-style: italic;
          letter-spacing: 0.18em;
          margin-left: 0.1em;
          color: #ffa520;
        }

        @media (min-width: 960px) {
          .hamburger { display: none !important; }
        }
      `}</style>
    </>
  )
}
