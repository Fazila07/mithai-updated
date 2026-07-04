'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-mithai-parchment text-mithai-maroon px-[18px] py-12 md:px-7 md:py-12 lg:px-10 lg:py-7">
      <div className="max-w-[1160px] mx-auto">

        {/* Brand Section */}
        <div className="text-center mb-9 pb-7 border-b border-[rgba(144,12,0,0.12)]">
          <h2 className="brand-logo text-center mb-1">
            <span className="brand-name" style={{ color: '#900c00' }}>Mithai</span>
            <span className="brand-suffix" style={{ color: '#ffa520' }}>2.0</span>
          </h2>

          <p className="text-sm text-mithai-warmGray leading-[1.7] mb-5">
            Guilt-free desserts &amp; snacks made with love. No refined sugar, no maida, no compromises.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-7 mb-8 md:grid-cols-4">
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-mithai-maroon mb-3.5">Shop</h4>
            <ul className="space-y-2.5">
              <li><Link href="/shop" className="text-sm text-mithai-warmGray transition-colors hover:text-mithai-maroon">All Products</Link></li>
              <li><Link href="/shop?category=cookies" className="text-sm text-mithai-warmGray transition-colors hover:text-mithai-maroon">Cookies</Link></li>
              <li><Link href="/shop?category=brownies" className="text-sm text-mithai-warmGray transition-colors hover:text-mithai-maroon">Brownies</Link></li>
              <li><Link href="/shop?category=gift-boxes" className="text-sm text-mithai-warmGray transition-colors hover:text-mithai-maroon">Gift Boxes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-mithai-maroon mb-3.5">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-sm text-mithai-warmGray transition-colors hover:text-mithai-maroon">About Us</Link></li>
              <li><Link href="/" className="text-sm text-mithai-warmGray transition-colors hover:text-mithai-maroon">Blog</Link></li>
              <li><Link href="/" className="text-sm text-mithai-warmGray transition-colors hover:text-mithai-maroon">Contact</Link></li>
              <li><Link href="/" className="text-sm text-mithai-warmGray transition-colors hover:text-mithai-maroon">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-mithai-maroon mb-3.5">Policies</h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-sm text-mithai-warmGray transition-colors hover:text-mithai-maroon">Shipping Policy</Link></li>
              <li><Link href="/" className="text-sm text-mithai-warmGray transition-colors hover:text-mithai-maroon">Refund Policy</Link></li>
              <li><Link href="/" className="text-sm text-mithai-warmGray transition-colors hover:text-mithai-maroon">Privacy Policy</Link></li>
              <li><Link href="/" className="text-sm text-mithai-warmGray transition-colors hover:text-mithai-maroon">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-mithai-maroon mb-3.5">Contact</h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-mithai-warmGray">📍 Hyderabad, India</li>
              <li className="text-sm text-mithai-warmGray">📧 [EMAIL_ADDRESS]</li>
              <li className="text-sm text-mithai-warmGray">📱 +91 9032538773</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[rgba(144,12,0,0.12)] pt-5 text-center">
          <p className="text-xs text-mithai-taupe leading-[1.7]">
            © {currentYear} Mithai 2.0. All rights reserved. Made with ❤️ in India.
          </p>
        </div>

      </div>
    </footer>
  )
}
