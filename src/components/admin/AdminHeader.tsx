'use client'

import { Menu, Bell, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

interface Props {
  onMenuClick: () => void
  title: string
}

export default function AdminHeader({ onMenuClick, title }: Props) {
  const { data: session } = useSession()

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
        <button className="p-2 rounded-lg hover:bg-[#e8dcc8] transition-colors relative">
          <Bell size={20} className="text-[#5a3a3a]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#900c00]" />
        </button>

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
