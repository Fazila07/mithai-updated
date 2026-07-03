'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, Bell, LogOut, Package, ShoppingBag, AlertTriangle } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

interface Notification {
  id: string
  type: 'order' | 'lowStock'
  message: string
  time: string
}

interface Props {
  onMenuClick: () => void
  title: string
}

export default function AdminHeader({ onMenuClick, title }: Props) {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (data.error) return

      const notifs: Notification[] = []

      // Pending orders as notifications
      if (data.stats?.pendingOrders > 0) {
        notifs.push({
          id: 'pending-orders',
          type: 'order',
          message: `${data.stats.pendingOrders} pending order${data.stats.pendingOrders > 1 ? 's' : ''} waiting`,
          time: 'Now',
        })
      }

      // Today's orders
      if (data.stats?.todayOrders > 0) {
        notifs.push({
          id: 'today-orders',
          type: 'order',
          message: `${data.stats.todayOrders} order${data.stats.todayOrders > 1 ? 's' : ''} received today`,
          time: 'Today',
        })
      }

      // Low stock alerts
      if (data.lowStockProducts && data.lowStockProducts.length > 0) {
        data.lowStockProducts.slice(0, 3).forEach((p: any, i: number) => {
          notifs.push({
            id: `low-stock-${i}`,
            type: 'lowStock',
            message: `${p.name} — ${p.stock === 0 ? 'Out of stock' : `${p.stock} left`}`,
            time: 'Alert',
          })
        })
      }

      // Recent orders
      if (data.recentOrders && data.recentOrders.length > 0) {
        data.recentOrders.slice(0, 3).forEach((o: any) => {
          notifs.push({
            id: `order-${o._id}`,
            type: 'order',
            message: `Order #${o.orderNumber} from ${o.customer?.name || 'Customer'}`,
            time: new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          })
        })
      }

      setNotifications(notifs)
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleBellClick = () => {
    if (!showDropdown) {
      fetchNotifications()
    }
    setShowDropdown(!showDropdown)
  }

  const notifCount = notifications.filter((n) => n.type === 'order' || n.type === 'lowStock').length

  return (
    <header className="sticky top-0 z-30 bg-[#faf4e8]/95 backdrop-blur-sm border-b border-[#e8dcc8] px-4 sm:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[#e8dcc8] transition-colors"
        >
          <Menu size={20} className="text-[#3d1c1c]" />
        </button>
        <h1 className="font-bold text-[#3d1c1c] text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleBellClick}
            className="p-2 rounded-lg hover:bg-[#e8dcc8] transition-colors relative"
          >
            <Bell size={20} className="text-[#5a3a3a]" />
            {notifCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-[16px] rounded-full bg-[#900c00] text-white text-[9px] font-bold flex items-center justify-center px-1">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#e8dcc8] overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-[#f0e8d8] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#3d1c1c]">Notifications</h3>
                <span className="text-[10px] font-semibold text-[#900c00] bg-[#900c00]/10 px-2 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center text-sm text-[#8a7a6a]">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-[#8a7a6a]">
                    <Bell size={24} className="mx-auto mb-2 opacity-30" />
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 py-3 border-b border-[#f8f2e8] last:border-0 hover:bg-[#fdf8f0] transition-colors flex items-start gap-3"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        notif.type === 'lowStock'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {notif.type === 'lowStock' ? (
                          <AlertTriangle size={14} />
                        ) : (
                          <ShoppingBag size={14} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#3d1c1c] font-medium truncate">{notif.message}</p>
                        <p className="text-[10px] text-[#8a7a6a] mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-[#d4c4a8]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffa520] to-[#900c00] flex items-center justify-center text-white text-xs font-bold shadow-md">
            {session?.user?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-[#3d1c1c] leading-tight">{session?.user?.name ?? 'Admin'}</p>
            <p className="text-[10px] text-[#8a7a6a]">Administrator</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="ml-1 p-2 rounded-lg text-[#8a7a6a] hover:text-red-500 hover:bg-red-50 transition-all"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
