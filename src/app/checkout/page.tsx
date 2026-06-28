'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useEffect, useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import { Loader2, Tag, X, ShieldCheck, Truck, ChevronRight } from 'lucide-react'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

interface Address {
  id: string
  label?: string
  name: string
  phone: string
  line1: string
  city: string
  state: string
  pincode: string
}

function CheckoutBody() {
  const searchParams = useSearchParams()
  const isBuyNow = searchParams.get('mode') === 'buynow'

  const { items: cartItems, buyNowItem, clearCart, clearBuyNow } = useCartStore()
  const { data: session } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddr, setSelectedAddr] = useState<string>('')

  // Coupon state
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    description?: string
    discount: number
  } | null>(null)

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    street: '', city: '', state: '', pincode: '',
  })

  useEffect(() => { setMounted(true) }, [])

  // Determine items to checkout
  const items = isBuyNow && buyNowItem ? [buyNowItem] : cartItems
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const discount = appliedCoupon?.discount || 0
  const shippingCharge = subtotal >= 500 ? 0 : 50
  const grandTotal = subtotal - discount + shippingCharge

  useEffect(() => {
    if (session?.user) {
      setForm((f) => ({
        ...f,
        name: session.user.name || f.name,
        email: session.user.email || f.email,
        phone: session.user.phone || f.phone,
      }))
      fetch('/api/user/addresses')
        .then((r) => r.json())
        .then((d) => {
          setAddresses(d.addresses || [])
          const def = d.addresses?.find((a: Address) => a.label === 'Home') || d.addresses?.[0]
          if (def) {
            setSelectedAddr(def.id)
            setForm((f) => ({
              ...f,
              name: def.name || f.name,
              phone: def.phone || f.phone,
              street: def.line1,
              city: def.city,
              state: def.state,
              pincode: def.pincode,
            }))
          }
        })
        .catch(() => {})
    }
  }, [session])

  const selectAddress = (addr: Address) => {
    setSelectedAddr(addr.id)
    setForm((f) => ({
      ...f,
      name: addr.name,
      phone: addr.phone,
      street: addr.line1,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    }))
  }

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), orderTotal: subtotal }),
      })
      const data = await res.json()
      if (data.valid) {
        setAppliedCoupon({
          code: data.coupon.code,
          description: data.coupon.description,
          discount: data.discount,
        })
        toast.success(`Coupon applied! You save ₹${data.discount}`)
      } else {
        toast.error(data.error || 'Invalid coupon')
      }
    } catch {
      toast.error('Failed to validate coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
  }

  const handlePayment = async () => {
    if (!form.name || !form.email || !form.phone || !form.street || !form.city || !form.pincode) {
      toast.error('Please fill all shipping details')
      return
    }

    setLoading(true)
    try {
      const createRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal }),
      })
      const { orderId } = await createRes.json()
      if (!orderId) throw new Error('Failed to create payment order')

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(grandTotal * 100),
        currency: 'INR',
        name: 'Mithai 2.0',
        description: `Order of ${itemCount} item${itemCount > 1 ? 's' : ''}`,
        order_id: orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: session?.user?.id,
                orderData: {
                  customerName: form.name,
                  customerEmail: form.email,
                  customerPhone: form.phone,
                  shippingAddress: { street: form.street, city: form.city, state: form.state || 'India', pincode: form.pincode },
                  items: items.map((i) => ({
                    productId: i.product._id || i.product.id,
                    name: i.product.name,
                    image: i.product.images?.[0] || '',
                    price: i.product.price,
                    quantity: i.quantity,
                  })),
                  subtotal,
                  shippingCharge,
                  tax: 0,
                  discount,
                  total: grandTotal,
                  paymentMethod: 'razorpay',
                  couponCode: appliedCoupon?.code,
                },
              }),
            })
            const data = await verifyRes.json()
            if (data.success) {
              if (isBuyNow) {
                clearBuyNow()
              } else {
                clearCart()
              }
              toast.success('Payment successful!')
              router.push(`/success?order=${data.order.orderNumber}`)
            } else {
              toast.error('Payment verification failed')
            }
          } catch {
            toast.error('Something went wrong verifying payment')
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#900c00' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-mithai-off px-4 py-10 sm:px-7 lg:px-10 pt-[88px]">
          <div className="mx-auto max-w-[1160px]">
            <div className="rounded-[28px] bg-white border border-[rgba(107,31,31,0.1)] p-16 text-center">
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="font-medino text-2xl text-mithai-maroonD mb-4">Your cart is empty</h2>
              <p className="text-mithai-taupe mb-8 max-w-md mx-auto">Add some delicious treats to proceed to checkout.</p>
              <Link href="/shop" className="btn-primary">Start Shopping</Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  const inputCls = "w-full px-4 py-3 border border-mithai-taupe/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mithai-gold/40 focus:border-mithai-gold text-sm transition-all bg-white"

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-mithai-off px-4 py-10 sm:px-7 lg:px-10 pt-[88px]">
        <div className="mx-auto max-w-[1160px]">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-1.5 text-sm mb-3">
              <Link href="/shop" className="text-mithai-maroon hover:underline font-medium">Shop</Link>
              <ChevronRight size={14} className="text-mithai-taupe/50" />
              {!isBuyNow && (
                <>
                  <Link href="/cart" className="text-mithai-maroon hover:underline font-medium">Cart</Link>
                  <ChevronRight size={14} className="text-mithai-taupe/50" />
                </>
              )}
              <span className="text-mithai-taupe">Checkout</span>
            </div>
            <h1 className="font-medino text-[clamp(28px,5vw,38px)] font-normal text-mithai-maroonD tracking-[-0.01em] leading-[0.95] mb-2">
              {isBuyNow ? 'Quick Buy' : 'Checkout'}
            </h1>
            <p className="text-sm text-mithai-taupe">Complete your order for {itemCount} item{itemCount > 1 ? 's' : ''}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* ─── Shipping Form (3/5) ───────────────────── */}
            <div className="lg:col-span-3 space-y-6">
              {/* Saved addresses */}
              {addresses.length > 0 && (
                <div className="bg-white rounded-[22px] border border-[rgba(107,31,31,0.08)] p-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-mithai-maroonD mb-4">Saved Addresses</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {addresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => selectAddress(addr)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all ${
                          selectedAddr === addr.id
                            ? 'border-mithai-maroon bg-mithai-maroonP'
                            : 'border-transparent bg-slate-50 hover:border-mithai-maroon/20'
                        }`}
                      >
                        <p className="text-sm font-semibold text-mithai-charcoal">
                          {addr.name}
                          {addr.label && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-mithai-gold bg-mithai-goldP px-2 py-0.5 rounded-full">{addr.label}</span>}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{addr.line1}, {addr.city} - {addr.pincode}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping form */}
              <div className="bg-white rounded-[22px] border border-[rgba(107,31,31,0.08)] p-6 sm:p-8">
                <h2 className="font-runiga text-lg font-semibold text-mithai-maroonD mb-6">Shipping Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-mithai-maroonD mb-2">Full Name *</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Full name" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-mithai-maroonD mb-2">Phone *</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-mithai-maroonD mb-2">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-mithai-maroonD mb-2">Address *</label>
                    <textarea rows={2} value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className={inputCls} placeholder="Street address, apartment, building" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-mithai-maroonD mb-2">City *</label>
                      <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-mithai-maroonD mb-2">State</label>
                      <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-mithai-maroonD mb-2">PIN Code *</label>
                      <input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Order Summary (2/5) ───────────────────── */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-[22px] border border-[rgba(107,31,31,0.08)] p-6 sm:p-8">
                <h2 className="font-runiga text-lg font-semibold text-mithai-maroonD mb-5">Order Summary</h2>
                <div className="space-y-4 mb-5">
                  {items.map((item) => (
                    <div key={item.product._id || item.product.id} className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-mithai-cream overflow-hidden flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-mithai-taupe/30 text-lg">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-mithai-maroonD text-sm truncate">{item.product.name}</h3>
                        <p className="text-xs text-mithai-taupe">Qty: {item.quantity} × ₹{item.product.price}</p>
                      </div>
                      <p className="font-semibold text-mithai-maroonD text-sm whitespace-nowrap">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ─── Coupon Section ────────────────────── */}
                <div className="border-t border-mithai-taupe/10 pt-5 mb-5">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-green-700">{appliedCoupon.code}</p>
                          {appliedCoupon.description && (
                            <p className="text-[10px] text-green-600">{appliedCoupon.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-green-700">-₹{appliedCoupon.discount}</span>
                        <button onClick={removeCoupon} className="p-1 rounded-full hover:bg-green-200 transition">
                          <X size={14} className="text-green-600" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mithai-taupe/50" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          placeholder="Enter coupon code"
                          className="w-full pl-9 pr-4 py-3 border border-mithai-taupe/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-mithai-gold/40 focus:border-mithai-gold transition-all uppercase font-mono tracking-wider"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-5 py-3 bg-mithai-maroon text-white rounded-2xl text-sm font-semibold hover:bg-mithai-maroonL transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
                      >
                        {couponLoading ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

                {/* ─── Totals ────────────────────────────── */}
                <div className="border-t border-mithai-taupe/10 pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Coupon Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Shipping</span>
                    <span>{shippingCharge === 0 ? <span className="text-green-600 font-medium">FREE</span> : `₹${shippingCharge}`}</span>
                  </div>
                  {subtotal < 500 && (
                    <p className="text-[11px] text-mithai-gold flex items-center gap-1">
                      <Truck size={12} /> Add ₹{(500 - subtotal).toLocaleString('en-IN')} more for free shipping!
                    </p>
                  )}
                  <div className="flex justify-between items-center text-lg font-bold pt-3 border-t border-mithai-taupe/10">
                    <span>Total</span>
                    <span className="text-mithai-maroonD">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-mithai-maroon text-white py-4 rounded-full font-semibold text-sm transition-all hover:bg-mithai-maroonL disabled:opacity-60 shadow-[0_4px_18px_rgba(144,12,0,0.32)] hover:shadow-[0_8px_28px_rgba(144,12,0,0.4)] flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : `Pay ₹${grandTotal.toLocaleString('en-IN')}`}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={14} />
                <span>Secured by Razorpay. Your payment info is safe.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-mithai-off" />}>
      <CheckoutBody />
    </Suspense>
  )
}