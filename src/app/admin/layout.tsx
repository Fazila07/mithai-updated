'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { Toaster } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/new': 'Add Product',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/coupons': 'Coupons',
  '/admin/inventory': 'Inventory',
  '/admin/navigation': 'Navigation',
  '/admin/settings': 'Settings',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()

  // Admin login page — render without shell and without auth check
  const isLoginPage = pathname === '/admin/login'

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Auth guard — redirect non-admin users
  useEffect(() => {
    if (isLoginPage) return
    if (status === 'loading') return
    if (!session) {
      router.replace('/admin/login')
      return
    }
    if (session.user?.role !== 'ADMIN') {
      router.replace('/')
    }
  }, [session, status, isLoginPage, router])

  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading while checking auth
  if (status === 'loading' || !session || session.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#3d1c1c] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ffa520] to-[#900c00] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">M</span>
          </div>
          <Loader2 size={24} className="animate-spin text-[#ffa520] mx-auto" />
        </div>
      </div>
    )
  }

  const title = Object.entries(PAGE_TITLES).find(([key]) =>
    pathname === key || (key !== '/admin' && pathname.startsWith(key))
  )?.[1] ?? 'Admin'

  return (
    <div className="min-h-screen bg-[#faf4e8] flex">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content — shifts right for sidebar */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#900c00', secondary: '#fff' } },
        }}
      />
    </div>
  )
}
