'use client'

import Link from 'next/link'
import { useCartStore, useCartTotal, useCartCount } from '@/store/cartStore'
import { useEffect, useState } from 'react'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty } = useCartStore()
  const total = useCartTotal()
  const itemCount = useCartCount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleQuantityChange = (productId: string, newQty: number) => {
    if (newQty > 0) {
      updateQty(productId, newQty)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/0 transition-all duration-300 z-40 ${
          isOpen ? 'bg-black/30 backdrop-blur-sm' : 'pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-mithai-off">
          <h2 className="text-lg font-bold text-mithai-maroon">Your Cart</h2>
          <button
            onClick={closeCart}
            className="text-2xl text-mithai-taupe hover:text-mithai-maroon transition-colors leading-none"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-mithai-taupe font-medium mb-4">Your cart is empty</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="text-sm font-semibold text-mithai-maroon hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-4 pb-4 border-b border-mithai-off">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-mithai-cream rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-2xl">🍪</span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/shop/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-sm font-semibold text-mithai-maroon hover:text-mithai-maroonL transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-mithai-taupe mt-1">₹{Math.floor(item.product.price)}</p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-mithai-off text-mithai-maroon text-xs font-bold hover:bg-mithai-cream transition-colors"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold text-mithai-maroon w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-mithai-off text-mithai-maroon text-xs font-bold hover:bg-mithai-cream transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="ml-auto text-xs text-red-500 hover:text-red-700 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-mithai-off px-6 py-5 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-mithai-taupe">Subtotal:</span>
              <span className="text-lg font-bold text-mithai-maroon">₹{Math.floor(total)}</span>
            </div>

            {/* CTA Buttons */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full block text-center bg-mithai-maroon text-white px-6 py-3 rounded-full font-semibold text-sm transition-all hover:bg-mithai-maroonL"
            >
              Checkout
            </Link>
            <button
              onClick={closeCart}
              className="w-full bg-mithai-off text-mithai-maroon px-6 py-3 rounded-full font-semibold text-sm transition-all hover:bg-mithai-cream"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
