'use client'

import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import { useAuthStore } from '../../store/authStore'

export default function Dashboard() {
  const { user } = useAuthStore()

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="min-h-screen pl-72 pr-8 pt-8 transition-all">
          <h1 className="text-2xl font-bold">Bienvenue sur le tableau de bord</h1>

          {user?.isSandbox && (
            <p className="mt-2 text-yellow-600 font-medium">
              ⚠️ Vous êtes en mode démo. Certaines fonctionnalités sont limitées.
            </p>
          )}

          {user?.role && !user?.isSandbox && (
            <p className="mt-2 text-gray-600">
              Vous êtes connecté en tant que {user.role.toUpperCase()} ✅
            </p>
          )}
        </main>
      </div>
    </div>
  )
}
