'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/* ─── types ─────────────────────────────────────────────────── */
type StepStatus = 'done' | 'active' | 'pending'

interface TrackingStep {
  id: number
  label: string
  description: string
  time?: string
  status: StepStatus
}

interface OrderResult {
  orderId: string
  phone: string
  status: string
  estimatedDelivery: string
  placedAt: string
  items: { name: string; qty: number; price: number }[]
  address: string
  steps: TrackingStep[]
}

/* ─── mock resolver ──────────────────────────────────────────── */
const DEMO_ORDERS: Record<string, OrderResult> = {
  'MTH-001234': {
    orderId: 'MTH-001234',
    phone: '9876543210',
    status: 'Out for Delivery',
    estimatedDelivery: 'Today, by 7:00 PM',
    placedAt: '12 May 2026, 9:15 AM',
    address: '42, Green Valley Apartments, Hyderabad – 500081',
    items: [
      { name: 'Almond Ladoo (200g)', qty: 2, price: 349 },
      { name: 'Cashew Burfi (150g)', qty: 1, price: 299 },
    ],
    steps: [
      { id: 1, label: 'Order Placed',       description: 'We received your order.',          time: '12 May, 9:15 AM',  status: 'done'    },
      { id: 2, label: 'Order Confirmed',    description: 'Your order has been confirmed.',    time: '12 May, 9:32 AM',  status: 'done'    },
      { id: 3, label: 'Being Prepared',     description: 'Our kitchen is crafting your box.', time: '12 May, 11:00 AM', status: 'done'    },
      { id: 4, label: 'Out for Delivery',   description: 'Your box is on its way!',           time: '12 May, 2:30 PM',  status: 'active'  },
      { id: 5, label: 'Delivered',          description: 'Enjoy your Mithai 2.0 goodies 🎉',  time: '',                 status: 'pending' },
    ],
  },
  'MTH-005678': {
    orderId: 'MTH-005678',
    phone: '9000011111',
    status: 'Delivered',
    estimatedDelivery: 'Delivered on 10 May 2026',
    placedAt: '9 May 2026, 3:42 PM',
    address: '7, Sunrise Colony, Pune – 411001',
    items: [{ name: 'Date & Walnut Roll (250g)', qty: 3, price: 399 }],
    steps: [
      { id: 1, label: 'Order Placed',     description: 'We received your order.',           time: '9 May, 3:42 PM',  status: 'done' },
      { id: 2, label: 'Order Confirmed',  description: 'Your order has been confirmed.',    time: '9 May, 4:00 PM',  status: 'done' },
      { id: 3, label: 'Being Prepared',   description: 'Our kitchen is crafting your box.', time: '10 May, 9:00 AM', status: 'done' },
      { id: 4, label: 'Out for Delivery', description: 'Your box is on its way!',           time: '10 May, 1:15 PM', status: 'done' },
      { id: 5, label: 'Delivered',        description: 'Enjoy your Mithai 2.0 goodies 🎉',  time: '10 May, 6:20 PM', status: 'done' },
    ],
  },
}

function resolveOrder(orderId: string, phone: string): OrderResult | null {
  const key = orderId.trim().toUpperCase()
  const record = DEMO_ORDERS[key]
  if (!record) return null
  if (phone.trim() && record.phone !== phone.trim()) return null
  return record
}

/* ─── SVG icons ─────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const BoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v4h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

/* ─── step dot ───────────────────────────────────────────────── */
function StepDot({ status }: { status: StepStatus }) {
  if (status === 'done') {
    return (
      <div className="step-dot-done">
        <CheckIcon />
      </div>
    )
  }
  if (status === 'active') {
    return (
      <div className="step-dot-active">
        <span className="step-pulse" />
      </div>
    )
  }
  return <div className="step-dot-pending" />
}

/* ─── page ───────────────────────────────────────────────────── */
export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [phone, setPhone]     = useState('')
  const [result, setResult]   = useState<OrderResult | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading]   = useState(false)

  function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    if (!orderId.trim()) return
    setLoading(true)
    setNotFound(false)
    setResult(null)

    // Simulate a network delay
    setTimeout(() => {
      const found = resolveOrder(orderId, phone)
      if (found) {
        setResult(found)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }, 900)
  }

  function handleReset() {
    setResult(null)
    setNotFound(false)
    setOrderId('')
    setPhone('')
  }

  const completedSteps = result?.steps.filter(s => s.status === 'done').length ?? 0
  const totalSteps     = result?.steps.length ?? 0

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-mithai-off pt-[60px]">

        {/* ── Hero banner ── */}
        <section className="track-hero">
          <div className="track-hero-inner">
            <div className="track-hero-icon">
              <TruckIcon />
            </div>
            <div className="text-xs font-semibold tracking-[0.22em] uppercase text-mithai-gold mb-3">
              Mithai 2.0
            </div>
            <h1 className="font-medino text-4xl sm:text-5xl text-mithai-maroonD leading-tight mb-3">
              Track Your Order
            </h1>
            <p className="text-mithai-taupe text-sm sm:text-base max-w-md mx-auto">
              Enter your Order ID to get live updates on your box of happiness.
            </p>
          </div>
          <div className="track-hero-curve" />
        </section>

        <div className="max-w-2xl mx-auto px-4 pb-20 -mt-10 relative z-10">

          {/* ── Search card ── */}
          {!result && (
            <div className="track-card">
              <form onSubmit={handleTrack} className="space-y-5">
                <div>
                  <label className="track-label">
                    Order ID <span className="text-mithai-maroon">*</span>
                  </label>
                  <input
                    id="orderId"
                    type="text"
                    value={orderId}
                    onChange={e => setOrderId(e.target.value)}
                    required
                    placeholder="e.g. MTH-001234"
                    className="track-input"
                  />
                  <p className="mt-1.5 text-[11px] text-mithai-taupe">
                    You can find your Order ID in your confirmation email or SMS.
                  </p>
                </div>

                <div>
                  <label className="track-label">
                    Phone Number <span className="text-mithai-taupe font-normal">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="track-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="track-btn"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="track-spinner" />
                      Tracking…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <TruckIcon />
                      Track Order
                    </span>
                  )}
                </button>

                {/* Demo hint */}
                <p className="text-center text-[11px] text-mithai-taupe">
                  Demo: try <span className="font-semibold text-mithai-maroon">MTH-001234</span> or <span className="font-semibold text-mithai-maroon">MTH-005678</span>
                </p>
              </form>

              {notFound && (
                <div className="track-error">
                  <span className="text-lg">🔍</span>
                  <div>
                    <p className="font-semibold text-sm">Order not found</p>
                    <p className="text-xs mt-0.5">Double-check your Order ID or contact us on WhatsApp.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Result ── */}
          {result && (
            <div className="space-y-6 animate-fadeUp">

              {/* Status badge card */}
              <div className="track-card">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="text-xs font-semibold tracking-widest uppercase text-mithai-gold mb-1">
                      Order #{result.orderId}
                    </div>
                    <h2 className="font-medino text-3xl text-mithai-maroonD">{result.status}</h2>
                    <p className="text-sm text-mithai-taupe mt-1">Placed on {result.placedAt}</p>
                  </div>
                  <div className="track-status-badge">{result.status}</div>
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-[11px] text-mithai-taupe mb-2">
                    <span>Progress</span>
                    <span>{completedSteps}/{totalSteps} steps</span>
                  </div>
                  <div className="track-progress-bg">
                    <div
                      className="track-progress-fill"
                      style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-mithai-maroon">
                  <span>📦</span>
                  <span>{result.estimatedDelivery}</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="track-card">
                <h3 className="font-runiga text-lg font-semibold text-mithai-maroonD mb-6">
                  Shipment Timeline
                </h3>
                <ol className="relative">
                  {result.steps.map((step, idx) => (
                    <li key={step.id} className="track-step">
                      {/* Vertical connector */}
                      {idx < result.steps.length - 1 && (
                        <div
                          className={`track-connector ${
                            step.status === 'done' ? 'track-connector-done' : 'track-connector-pending'
                          }`}
                        />
                      )}

                      <StepDot status={step.status} />

                      <div className="track-step-content">
                        <div className={`font-semibold text-sm ${
                          step.status === 'pending' ? 'text-mithai-taupe' : 'text-mithai-maroonD'
                        }`}>
                          {step.label}
                        </div>
                        <div className="text-xs text-mithai-taupe mt-0.5">{step.description}</div>
                        {step.time && (
                          <div className="text-[11px] text-mithai-gold font-semibold mt-1">
                            🕐 {step.time}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Order items */}
              <div className="track-card">
                <h3 className="font-runiga text-lg font-semibold text-mithai-maroonD mb-4 flex items-center gap-2">
                  <BoxIcon />
                  Items in Your Box
                </h3>
                <ul className="divide-y divide-mithai-off">
                  {result.items.map((item, i) => (
                    <li key={i} className="flex justify-between items-center py-3 text-sm">
                      <span className="text-mithai-maroon">
                        {item.name}{' '}
                        <span className="text-mithai-taupe">× {item.qty}</span>
                      </span>
                      <span className="font-semibold text-mithai-maroon">
                        ₹{item.price * item.qty}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-mithai-off flex justify-between font-bold text-sm">
                  <span className="text-mithai-maroonD">Total</span>
                  <span className="text-mithai-maroon">
                    ₹{result.items.reduce((s, i) => s + i.price * i.qty, 0)}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="track-card">
                <h3 className="font-runiga text-lg font-semibold text-mithai-maroonD mb-3">
                  Delivery Address
                </h3>
                <p className="text-sm text-mithai-taupe leading-relaxed">{result.address}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleReset} className="track-btn-outline">
                  ← Track Another Order
                </button>
                <Link
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="track-btn flex-1 text-center flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                  </svg>
                  Need Help? WhatsApp Us
                </Link>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        /* Hero */
        .track-hero {
          background: linear-gradient(135deg, #900c00 0%, #b01600 40%, #6d0900 100%);
          padding: 72px 16px 80px;
          text-align: center;
          position: relative;
        }
        .track-hero-inner { position: relative; z-index: 2; }
        .track-hero-icon {
          width: 56px; height: 56px;
          background: rgba(255,165,32,0.18);
          border: 1px solid rgba(255,165,32,0.4);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #ffa520;
          margin: 0 auto 20px;
        }
        .track-hero h1 { color: #FDF8EC; }
        .track-hero p { color: rgba(253,248,236,0.72); }
        .track-hero-curve {
          position: absolute; bottom: -1px; left: 0; right: 0; height: 48px;
          background: #FAFAF8;
          clip-path: ellipse(60% 100% at 50% 100%);
          z-index: 1;
        }

        /* Card */
        .track-card {
          background: #fff;
          border: 1px solid rgba(144,12,0,0.10);
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 14px 32px rgba(144,12,0,0.06);
        }

        /* Label & Input */
        .track-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #5C3D2E;
          margin-bottom: 8px;
          letter-spacing: 0.02em;
        }
        .track-input {
          width: 100%;
          border: 1.5px solid rgba(144,12,0,0.15);
          border-radius: 999px;
          background: #FAFAF8;
          padding: 13px 20px;
          font-size: 0.9rem;
          color: #900c00;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .track-input::placeholder { color: #9B7B6A; }
        .track-input:focus {
          border-color: #900c00;
          box-shadow: 0 0 0 3px rgba(144,12,0,0.10);
        }

        /* Primary button */
        .track-btn {
          display: block;
          width: 100%;
          background: #900c00;
          color: #FDF8EC;
          border: none;
          border-radius: 999px;
          padding: 14px 24px;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 6px 22px rgba(144,12,0,0.28);
          text-decoration: none;
        }
        .track-btn:hover:not(:disabled) {
          background: #b01600;
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(144,12,0,0.32);
        }
        .track-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        /* Outline button */
        .track-btn-outline {
          flex: 1;
          background: transparent;
          border: 1.5px solid rgba(144,12,0,0.25);
          border-radius: 999px;
          padding: 14px 24px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #900c00;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
        }
        .track-btn-outline:hover {
          background: #f7eae8;
          border-color: #900c00;
        }

        /* Spinner */
        .track-spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(253,248,236,0.35);
          border-top-color: #FDF8EC;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Error */
        .track-error {
          margin-top: 20px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #FFF0F0;
          border: 1px solid rgba(180,30,30,0.18);
          border-radius: 16px;
          padding: 14px 18px;
          color: #7A1F1F;
        }

        /* Status badge */
        .track-status-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(227,180,72,0.14);
          border: 1px solid rgba(227,180,72,0.5);
          color: #8B6A00;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 999px;
        }

        /* Progress bar */
        .track-progress-bg {
          width: 100%;
          height: 8px;
          background: #F7F3EE;
          border-radius: 999px;
          overflow: hidden;
        }
        .track-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #900c00 0%, #ffa520 100%);
          border-radius: 999px;
          transition: width 1s cubic-bezier(.4,0,.2,1);
        }

        /* Timeline step */
        .track-step {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding-bottom: 28px;
          position: relative;
        }
        .track-step:last-child { padding-bottom: 0; }
        .track-step-content { padding-top: 2px; }

        /* Connector line */
        .track-connector {
          position: absolute;
          left: 15px;
          top: 32px;
          width: 2px;
          bottom: 0;
        }
        .track-connector-done    { background: #900c00; }
        .track-connector-pending { background: #E8C99A; }

        /* Step dots */
        .step-dot-done {
          flex-shrink: 0;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #900c00;
          color: #FDF8EC;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 10px rgba(144,12,0,0.30);
          z-index: 1;
        }
        .step-dot-active {
          flex-shrink: 0;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #ffa520;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 4px rgba(255,165,32,0.25);
          z-index: 1;
          position: relative;
        }
        .step-pulse {
          display: block;
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #fff;
          animation: pulse 1.6s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { transform: scale(1);   opacity: 1; }
          50%      { transform: scale(1.3); opacity: 0.7; }
        }
        .step-dot-pending {
          flex-shrink: 0;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #F7F3EE;
          border: 2px solid #E8C99A;
          z-index: 1;
        }
      `}</style>
    </>
  )
}
