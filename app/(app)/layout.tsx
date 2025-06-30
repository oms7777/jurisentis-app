import '../globals.css'
import * as React from 'react'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import { Providers } from '../providers'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-900 flex overflow-hidden">
        <Providers>
          <Sidebar />
          <div className="flex-1 min-h-screen flex flex-col ml-64">
            <Header />
            <main className="flex-1 overflow-auto px-6 py-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
