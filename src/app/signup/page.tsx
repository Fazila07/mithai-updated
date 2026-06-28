'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    // With Google-only auth, signup is handled automatically
    // Redirect users to the login page
    router.replace('/login')
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-mithai-off">
      <p className="text-sm text-slate-500">Redirecting to sign in…</p>
    </main>
  )
}

