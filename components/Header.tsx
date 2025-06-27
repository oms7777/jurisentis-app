'use client'

import { useAuthStore } from '../store/authStore'
import { LogOut, Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 ml-64 border-b border-gray-200">
      <div className="text-lg font-semibold text-gray-800 tracking-tight">
        Jurisentis
      </div>

      <div className="flex items-center gap-4">
        {/* Notification icon */}
        <button
          className="text-gray-500 hover:text-gray-800 transition"
          title="Notifications"
        >
          <Bell size={20} />
        </button>

        {/* Avatar + Logout */}
        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${user?.email ?? 'U'}&background=0D8ABC&color=fff`}
            alt="avatar"
            className="w-8 h-8 rounded-full shadow hover:scale-105 transition duration-150"
          />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  )
}
