'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')

  return (
    <main className="min-h-screen flex items-center justify-center bg-mithai-off px-4 py-12">
      <div className="w-full max-w-xl rounded-[2rem] bg-white/95 p-10 text-center shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-semibold text-mithai-charcoal">Order Confirmed!</h1>
        {orderNumber && (
          <div className="mt-4 inline-block bg-mithai-maroonP rounded-2xl px-6 py-3">
            <p className="text-xs text-mithai-gold font-bold uppercase tracking-widest mb-1">Order Number</p>
            <p className="text-xl font-mono font-bold text-mithai-maroon">#{orderNumber}</p>
          </div>
        )}
        <p className="mt-6 text-sm text-slate-500 max-w-md mx-auto">
          Thank you for choosing Mithai 2.0! You&apos;ll receive a confirmation email shortly with your order details.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          {orderNumber && (
            <Link
              href="/account/orders"
              className="rounded-3xl bg-mithai-maroon px-6 py-3 text-sm font-semibold text-white transition hover:bg-mithai-maroonL shadow-[0_4px_18px_rgba(144,12,0,0.25)]"
            >
              View My Orders
            </Link>
          )}
          <Link href="/shop" className="rounded-3xl bg-mithai-maroonP px-6 py-3 text-sm font-semibold text-mithai-maroon transition hover:bg-mithai-maroon hover:text-white">
            Continue Shopping
          </Link>
          <Link href="/" className="rounded-3xl border border-slate-300 px-6 py-3 text-sm font-semibold text-mithai-charcoal transition hover:bg-slate-100">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-mithai-off">
        <div className="text-6xl">🎉</div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  )
}
