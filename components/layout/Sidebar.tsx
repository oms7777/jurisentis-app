'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Folder,
  Vault,

  ShieldCheck,
  Search,
  Calendar,
  Settings,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const links = [
  { label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Contrats', href: '/xdraft', icon: FileText },
  { label: 'Archivage', href: '/xvault', icon: Vault },
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
    <aside className="w-64 h-screen bg-gray-950 text-white border-r border-gray-800 fixed left-0 top-0 flex flex-col justify-between z-50">
      <div className="px-6 py-5">
        <h1 className="text-xl font-bold tracking-tight mb-8">Jurisentis</h1>

        <div className="text-xs text-gray-400 mb-8">
          👤 {user?.email ?? 'Utilisateur'}
        </div>

        <nav>
          <ul className="space-y-2">
            {links.map(({ label, href, icon: Icon }) => {
              const isActive = pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group
                      ${
                        isActive
                          ? 'bg-gray-800 text-white font-medium'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <Icon size={18} className="group-hover:scale-105 transition" />
                    <span>{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {user?.isSandbox && (
        <div className="px-6 py-3 bg-yellow-900/20 text-yellow-300 text-xs border-t border-yellow-700">
          ⚠️ Mode Démo activé
        </div>
      )}
    </aside>
  )
}
