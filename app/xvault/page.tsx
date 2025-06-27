// app/xvault/page.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function XVaultPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📁 Référentiels de contrats</h1>
      <p className="text-gray-600">
        Gérer les modèles, clauses types et structures contractuelles de votre organisation.
      </p>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <p className="text-gray-500">Aucun modèle référencé pour l'instant.</p>
        <button
          onClick={() => router.push('/xdraft')}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Ajouter un premier modèle via XDraft
        </button>
      </div>
    </div>
  )
}
