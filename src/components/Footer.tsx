'use client'

import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-mithai-gold text-mithai-maroon px-[18px] py-12 md:px-7 md:py-12 lg:px-10 lg:py-7">
      <div className="max-w-[1160px] mx-auto">

        {/* Brand Section */}
        <div className="text-center mb-9 pb-7 border-b border-[rgba(144,12,0,0.18)]">
          <div className="flex justify-center mb-4">
            <BrandLogo href="/" height={64} className="h-16 w-auto object-contain" />
          </div>

          <p className="text-sm text-mithai-maroonD leading-[1.7] mb-5">
            Bites that make you forget that they are actually healthy.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-7 mb-8 md:grid-cols-4">
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-mithai-maroonD mb-3.5">Shop</h4>
            <ul className="space-y-2.5">
              <li><Link href="/shop" className="text-sm text-mithai-maroon/80 transition-colors hover:text-mithai-maroonD">All Products</Link></li>
              <li><Link href="/shop?category=cookies" className="text-sm text-mithai-maroon/80 transition-colors hover:text-mithai-maroonD">Cookies</Link></li>
              <li><Link href="/shop?category=brownies" className="text-sm text-mithai-maroon/80 transition-colors hover:text-mithai-maroonD">Brownies</Link></li>
              <li><Link href="/shop?category=gift-boxes" className="text-sm text-mithai-maroon/80 transition-colors hover:text-mithai-maroonD">Gift Boxes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-mithai-maroonD mb-3.5">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-mithai-maroon/80 transition-colors hover:text-mithai-maroonD">About Us</Link></li>
              <li><Link href="/" className="text-sm text-mithai-maroon/80 transition-colors hover:text-mithai-maroonD">Blog</Link></li>
              <li><Link href="/" className="text-sm text-mithai-maroon/80 transition-colors hover:text-mithai-maroonD">Contact</Link></li>
              <li><Link href="/" className="text-sm text-mithai-maroon/80 transition-colors hover:text-mithai-maroonD">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-mithai-maroonD mb-3.5">Policies</h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-sm text-mithai-maroon/80 transition-colors hover:text-mithai-maroonD">Shipping Policy</Link></li>
              <li><Link href="/" className="text-sm text-mithai-maroon/80 transition-colors hover:text-mithai-maroonD">Refund Policy</Link></li>
              <li><Link href="/" className="text-sm text-mithai-maroon/80 transition-colors hover:text-mithai-maroonD">Privacy Policy</Link></li>
              <li><Link href="/" className="text-sm text-mithai-maroon/80 transition-colors hover:text-mithai-maroonD">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-mithai-maroonD mb-3.5">Contact</h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-mithai-maroon/80">📍 Hyderabad, India</li>
              <li className="text-sm text-mithai-maroon/80">📧 [EMAIL_ADDRESS]</li>
              <li className="text-sm text-mithai-maroon/80">📱 +91 9032538773</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[rgba(144,12,0,0.18)] pt-5 text-center">
          <p className="text-xs text-mithai-maroonD leading-[1.7]">
            © {currentYear} Mithai 2.0. All rights reserved. Made with ❤️ in India.
          </p>
        </div>

      </div>
    </footer>
  )
}
