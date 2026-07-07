'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useCartCount } from '@/store/cartStore'
import { User, LogOut, Package, Heart, MapPin, LayoutDashboard, ChevronRight } from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'

const MOBILE_MENU_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/#bestsellers', label: 'Best Sellers' },
  { href: '/#categories', label: 'Categories' },
  { href: '/about', label: 'About Us' },
  { href: '/login', label: 'Login' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const itemCount = useCartCount()
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [mobileMenuOpen])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] h-[60px] bg-white/95 backdrop-blur-[14px] border-b border-[rgba(107,31,31,0.10)] transition-all duration-300">
        <div className="h-full w-full max-w-[1160px] mx-auto px-3 sm:px-4 flex items-center justify-between gap-2">

          {/* Left: hamburger — always visible below 960px */}
          <div className="w-10 shrink-0 flex items-center justify-start max-[959px]:flex min-[960px]:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              className="flex flex-col items-center justify-center gap-[5px] w-10 h-10 p-0 m-0 border-0 bg-transparent cursor-pointer"
            >
              <span className="block w-[22px] h-[2px] bg-mithai-maroon rounded-sm shrink-0" />
              <span className="block w-[22px] h-[2px] bg-mithai-maroon rounded-sm shrink-0" />
              <span className="block w-[22px] h-[2px] bg-mithai-maroon rounded-sm shrink-0" />
            </button>
          </div>

          {/* Desktop spacer — keeps logo centred when hamburger hidden */}
          <div className="hidden min-[960px]:block w-10 shrink-0" aria-hidden="true" />

          {/* Centre: logo */}
          <div className="flex-1 flex justify-center items-center min-w-0 px-1">
            <BrandLogo
              priority
              height={48}
              className="h-[40px] sm:h-[44px] md:h-[48px] w-auto max-w-[160px] sm:max-w-[200px] object-contain"
            />
          </div>

          {/* Right: user + cart */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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

              {userMenuOpen && session?.user && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-mithai-maroon truncate">{session.user.name}</p>
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

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'mobile-menu-overlay--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="mobile-menu-header">
          <BrandLogo href="/" height={44} className="h-11 w-auto object-contain" />
          <button
            className="mobile-menu-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="mobile-menu-nav">
          {MOBILE_MENU_ITEMS.map(({ href, label }) => {
            const linkHref = label === 'Login' && session?.user ? '/account' : href
            return (
              <Link
                key={href}
                href={linkHref}
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-menu-link"
              >
                <span>{label}</span>
                <ChevronRight size={18} className="text-mithai-maroon/60" />
              </Link>
            )
          })}
        </nav>

        <div className="mobile-menu-footer">
          {session?.user ? (
            <>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-menu-cta"
              >
                My Account
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                className="mobile-menu-signout"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-menu-cta"
            >
              Sign Up / Login
            </Link>
          )}
        </div>
      </div>

      <style>{`
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

        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          background: #fdf8ec;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
          visibility: hidden;
        }
        .mobile-menu-overlay--open {
          transform: translateX(0);
          visibility: visible;
        }

        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          border-bottom: 1px solid rgba(107, 31, 31, 0.08);
          flex-shrink: 0;
        }

        .mobile-menu-close {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: #900c00;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .mobile-menu-nav {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
        }

        .mobile-menu-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          font-family: 'Tan Pearl', serif;
          font-size: 17px;
          font-weight: 600;
          color: #3d1a10;
          text-decoration: none;
          border-bottom: 1px solid rgba(107, 31, 31, 0.08);
          transition: color 0.18s, background 0.18s;
        }
        .mobile-menu-link:hover {
          color: #900c00;
          background: rgba(144, 12, 0, 0.03);
        }

        .mobile-menu-promo {
          padding: 16px 22px;
          flex-shrink: 0;
        }

        .mobile-menu-founder {
          display: block;
          text-decoration: none;
        }

        .mobile-menu-founder-img {
          width: 100%;
          height: auto;
          border-radius: 14px;
          object-fit: cover;
          aspect-ratio: 16/10;
        }

        .mobile-menu-tagline {
          margin: 12px 0 0;
          font-family: 'Tan Pearl', serif;
          font-size: 15px;
          color: #3d1a10;
          line-height: 1.4;
        }
        .mobile-menu-tagline em {
          font-style: italic;
          color: #900c00;
          font-weight: 600;
        }

        .mobile-menu-footer {
          padding: 16px 22px 28px;
          flex-shrink: 0;
        }

        .mobile-menu-cta {
          display: block;
          width: 100%;
          padding: 16px;
          text-align: center;
          background: #900c00;
          color: white;
          font-size: 15px;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .mobile-menu-cta:hover {
          background: #6d0900;
        }

        .mobile-menu-signout {
          display: block;
          width: 100%;
          margin-top: 10px;
          padding: 12px;
          text-align: center;
          background: transparent;
          color: #900c00;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid rgba(144, 12, 0, 0.2);
          border-radius: 8px;
          cursor: pointer;
        }

        @media (min-width: 960px) {
          .mobile-menu-overlay { display: none !important; }
        }
      `}</style>
    </>
  )
}
