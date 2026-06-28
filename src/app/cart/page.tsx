'use client'

import Link from 'next/link'
import { useCartStore, useCartTotal, useCartCount } from '@/store/cartStore'
import { useEffect, useState } from 'react'

export default function CartPage() {
  const { items, removeItem, updateQty } = useCartStore()
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
    <main className="min-h-screen bg-mithai-off px-4 py-10 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1160px]">
        <div className="mb-10">
          <div className="text-xs font-semibold tracking-[0.2em] uppercase text-mithai-gold mb-3">Your Cart</div>
          <h1 className="font-medino text-4xl font-normal text-mithai-maroonD mb-2 tracking-[-0.01em] leading-[0.95]">
            Shopping Cart
          </h1>
          <p className="text-sm text-mithai-taupe max-w-2xl">
            {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[28px] bg-white border border-[rgba(107,31,31,0.1)] p-16 text-center">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="font-runiga text-2xl font-semibold text-mithai-maroonD mb-4">Your cart is empty</h2>
            <p className="text-mithai-taupe mb-8 max-w-md mx-auto">
              Looks like you haven't added any delicious treats yet. Start exploring our collection!
            </p>
            <Link
              href="/shop"
              className="inline-block bg-mithai-maroon text-white px-8 py-4 rounded-full font-semibold text-sm transition hover:bg-mithai-maroonL"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.product._id} className="rounded-[28px] bg-white border border-[rgba(107,31,31,0.1)] shadow-[0_14px_32px_rgba(107,31,31,0.06)] p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-mithai-cream rounded-xl flex items-center justify-center flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <span className="text-3xl">🍪</span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Link
                            href={`/shop/${item.product.slug}`}
                            className="font-runiga text-xl font-semibold text-mithai-maroonD hover:text-mithai-maroonL transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-mithai-taupe mt-1">{item.product.shortDescription}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="text-mithai-taupe hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-mithai-off text-mithai-maroon text-sm font-bold hover:bg-mithai-cream transition-colors flex items-center justify-center"
                            >
                              −
                            </button>
                            <span className="text-sm font-semibold text-mithai-maroon w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-mithai-off text-mithai-maroon text-sm font-bold hover:bg-mithai-cream transition-colors flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm text-mithai-taupe">× ₹{item.product.price}</span>
                        </div>
                        <span className="text-lg font-bold text-mithai-maroon">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-[28px] bg-white border border-[rgba(107,31,31,0.1)] shadow-[0_14px_32px_rgba(107,31,31,0.06)] p-6 sticky top-6">
                <h2 className="font-runiga text-xl font-semibold text-mithai-maroonD mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-mithai-taupe">Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-mithai-maroon">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-mithai-taupe">Shipping</span>
                    <span className="font-semibold text-mithai-maroon">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-mithai-taupe">Tax</span>
                    <span className="font-semibold text-mithai-maroon">₹{Math.floor(total * 0.18)}</span>
                  </div>
                </div>

                <div className="border-t border-mithai-off pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-mithai-maroonD">Total</span>
                    <span className="text-mithai-maroon">₹{total + Math.floor(total * 0.18)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full block text-center bg-mithai-maroon text-white px-6 py-4 rounded-full font-semibold text-sm transition hover:bg-mithai-maroonL mb-3"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  className="w-full block text-center bg-mithai-off text-mithai-maroon px-6 py-4 rounded-full font-semibold text-sm transition hover:bg-mithai-cream"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}