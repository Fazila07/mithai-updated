'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import { User, Package, MapPin, Heart } from 'lucide-react'

const NAV = [
  { href: '/account', label: 'Profile', icon: User, exact: true },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-mithai-off pt-[60px]">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-7 lg:px-10 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="text-xs font-semibold tracking-[0.2em] uppercase text-mithai-gold mb-3">My Account</div>
            <h1 className="font-medino text-3xl sm:text-4xl font-normal text-mithai-maroonD tracking-[-0.01em] leading-[0.95]">
              Welcome, {session?.user?.name?.split(' ')[0] || 'there'}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
            {/* Sidebar */}
            <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {NAV.map(({ href, label, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                      active
                        ? 'bg-mithai-maroon text-white shadow-[0_4px_18px_rgba(144,12,0,0.25)]'
                        : 'bg-white text-mithai-warmGray hover:bg-mithai-maroonP border border-transparent hover:border-mithai-maroon/10'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                )
              })}
            </nav>

            {/* Content */}
            <div>{children}</div>
          </div>
        </div>
      </main>
    </>
  )
}
