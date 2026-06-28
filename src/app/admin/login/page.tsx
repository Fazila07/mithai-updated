'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, Loader2 } from 'lucide-react'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export default function AdminLoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [forbidden, setForbidden] = useState(false)

  // Check for forbidden error from middleware
  useEffect(() => {
    if (searchParams.get('error') === 'forbidden') {
      setForbidden(true)
    }
  }, [searchParams])

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      router.replace('/admin')
    }
  }, [status, session, router])

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a0a0a]">
        <Loader2 size={28} className="animate-spin text-[#ffa520]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8">
      {/* ── Luxury Background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a0a] via-[#2a0f0f] to-[#0d0505]" />

      {/* Animated radial glows */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-[0.07] blur-3xl animate-pulse"
        style={{ background: 'radial-gradient(circle, #ffa520 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.05] blur-3xl animate-pulse"
        style={{ background: 'radial-gradient(circle, #900c00 0%, transparent 70%)', animationDelay: '2s' }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,165,32,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,165,32,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative floating elements */}
      <motion.div
        className="absolute top-[15%] right-[15%] w-20 h-20 rounded-full border border-[#ffa520]/10"
        animate={{ y: [0, -15, 0], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[10%] w-14 h-14 rounded-2xl border border-[#900c00]/10 rotate-45"
        animate={{ y: [0, 12, 0], rotate: [45, 135, 45] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[40%] left-[5%] w-3 h-3 rounded-full bg-[#ffa520]/20"
        animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[25%] right-[30%] w-2 h-2 rounded-full bg-[#ffa520]/15"
        animate={{ y: [0, 15, 0], opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* ── Main Card ── */}
      <motion.div
        className="relative w-full max-w-[420px] z-10"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Glassmorphism card */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-b from-[#ffa520]/20 via-[#900c00]/10 to-transparent rounded-3xl" />

          <div className="relative bg-[#fdf6ec]/[0.92] backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/40">
            {/* ── Logo & Title ── */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              {/* Logo badge */}
              <div className="relative inline-flex mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffa520] to-[#900c00] flex items-center justify-center shadow-xl shadow-[#900c00]/30">
                  <span
                    className="text-white text-2xl"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                  >
                    M
                  </span>
                </div>
                {/* Shield badge */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#fdf6ec] flex items-center justify-center shadow-md">
                  <Shield size={13} className="text-[#900c00]" />
                </div>
              </div>

              <h1
                className="text-2xl text-[#1a0a0a] mb-1"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
              >
                Admin Portal
              </h1>
              <p className="text-sm text-[#3d1f1f]/50">
                Mithai 2.0 — Sign in to manage your store
              </p>
            </motion.div>

            {/* Forbidden warning */}
            {forbidden && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 bg-amber-50/80 backdrop-blur-sm text-amber-800 text-sm px-4 py-3 rounded-xl border border-amber-200/50"
              >
                Access denied. Only administrators can access this area.
              </motion.div>
            )}

            {/* Divider line */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#900c00]/15 to-transparent" />
              <span className="text-[10px] text-[#3d1f1f]/30 uppercase tracking-widest font-medium">Secure Login</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#900c00]/15 to-transparent" />
            </div>

            {/* Login Form */}
            <AdminLoginForm />

            {/* Footer */}
            <motion.div
              className="mt-8 pt-6 border-t border-[#900c00]/8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="text-center text-xs text-[#3d1f1f]/40">
                This portal is for authorized administrators only.
              </p>
              <p className="text-center mt-2">
                <a
                  href="/"
                  className="text-xs text-[#900c00]/60 font-medium hover:text-[#900c00] transition-colors inline-flex items-center gap-1"
                >
                  ← Back to Mithai 2.0 Store
                </a>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom glow accent */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-12 bg-[#ffa520]/10 blur-2xl rounded-full" />
      </motion.div>
    </div>
  )
}
