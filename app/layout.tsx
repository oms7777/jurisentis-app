import './globals.css'
import * as React from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '../components/Sidebar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Liste des routes sans sidebar (auth, public, etc.)
  const hiddenRoutes = ['/login', '/register', '/onboard', '/demo-login']
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  const showSidebar = !hiddenRoutes.includes(pathname)

  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-900 flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  )
}
