'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '../store/authStore'
import {
  LayoutDashboard,
  FileText,
  Folder,
  ShieldCheck,
  Search,
  Calendar,
  Settings
} from 'lucide-react'

const links = [
  { label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Contrats', href: '/xdraft', icon: FileText },
  { label: 'Référentiels', href: '/xvault', icon: Folder },
  { label: 'Dossiers juridiques', href: '/xlegal', icon: Folder },
  { label: 'Conformité & Risques', href: '/xcomply', icon: ShieldCheck },
  { label: 'Veille juridique', href: '/juriscope', icon: Search },
  { label: 'Échéances', href: '/echeances', icon: Calendar },
  { label: 'Admin', href: '/admin', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-6 fixed left-0 top-0 flex flex-col justify-between shadow-lg">
      <div>
        <div className="text-2xl font-bold mb-6">Jurisentis</div>
        <div className="text-sm mb-8 text-gray-400">👤 {user?.email}</div>
        <nav>
          <ul className="space-y-2">
            {links.map(({ label, href, icon: Icon }) => {
              const isActive = pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all
                      ${isActive ? 'bg-gray-800 text-white font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                    `}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {user?.isSandbox && (
        <div className="text-xs text-yellow-400 bg-yellow-900/30 px-3 py-2 rounded">
          ⚠️ Mode Démo activé
        </div>
      )}
    </aside>
  )
}
