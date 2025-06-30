'use client'

import { useAuthStore } from '../../../store/authStore'

export default function Dashboard() {
  const { user } = useAuthStore()

  return (
    <div>
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
    </div>
  )
}
