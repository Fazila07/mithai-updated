'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle } from 'lucide-react'
import { adminLoginSchema } from '@/lib/validators'
import { motion } from 'framer-motion'

export default function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    // Validate with zod
    const result = adminLoginSchema.safeParse({ email, password })
    if (!result.success) {
      const errors: { email?: string; password?: string } = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string
        if (field === 'email' || field === 'password') {
          errors[field] = err.message
        }
      })
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: result.data.email,
        password: result.data.password,
      })

      if (res?.error) {
        setError('Invalid email or password. Please check your credentials.')
        setLoading(false)
        return
      }

      // Verify the user is actually an admin by checking the session
      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()

      if (!session?.user || session.user.role !== 'ADMIN') {
        // Sign out the non-admin user immediately
        await signIn('credentials', { redirect: false }) // This won't do anything useful but...
        setError('Access denied. This portal is for administrators only.')
        // Sign them out since they shouldn't be here
        await fetch('/api/auth/signout', { method: 'POST' })
        setLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again later.')
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Email */}
      <div>
        <label htmlFor="admin-email" className="block text-sm font-medium text-[#3d1f1f] mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#900c00]/40" />
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }))
            }}
            placeholder="admin@mithai.com"
            className={`w-full pl-10 pr-4 py-3 bg-white/60 border rounded-xl text-sm outline-none transition-all placeholder:text-[#900c00]/25
              ${fieldErrors.email
                ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-400'
                : 'border-[#900c00]/15 focus:ring-2 focus:ring-[#ffa520]/30 focus:border-[#ffa520]'
              }`}
          />
        </div>
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle size={12} /> {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="admin-password" className="block text-sm font-medium text-[#3d1f1f] mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#900c00]/40" />
          <input
            id="admin-password"
            type={showPass ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }))
            }}
            placeholder="Enter your password"
            className={`w-full pl-10 pr-12 py-3 bg-white/60 border rounded-xl text-sm outline-none transition-all placeholder:text-[#900c00]/25
              ${fieldErrors.password
                ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-400'
                : 'border-[#900c00]/15 focus:ring-2 focus:ring-[#ffa520]/30 focus:border-[#ffa520]'
              }`}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#900c00]/40 hover:text-[#900c00]/70 transition-colors"
            aria-label={showPass ? 'Hide password' : 'Show password'}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle size={12} /> {fieldErrors.password}
          </p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between">
        <label htmlFor="remember-me" className="flex items-center gap-2 cursor-pointer select-none">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-[#900c00]/20 text-[#900c00] focus:ring-[#ffa520]/30 cursor-pointer accent-[#900c00]"
          />
          <span className="text-xs text-[#3d1f1f]/70">Remember me</span>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50/80 backdrop-blur-sm text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200/50 flex items-start gap-2"
        >
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#900c00] to-[#b01600] text-white py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#900c00]/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Authenticating...
          </>
        ) : (
          'Sign In to Dashboard'
        )}
      </button>
    </motion.form>
  )
}
