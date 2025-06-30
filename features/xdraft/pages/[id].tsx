'use client'

import { useParams } from 'next/navigation'

export default function ContractDetailPage() {
  const { id } = useParams()

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">🧾 Détail du contrat</h2>

      <div className="bg-white p-6 rounded-xl shadow border">
        <p>Contrat ID : <strong>{id}</strong></p>
        {/* 🔜 Ajouter ici : résumé IA, PDF viewer, historique, parties prenantes... */}
      </div>
    </div>
  )
}
