'use client'

import { Contract } from 'features/xdraft/types/contract'
import { Lightbulb } from 'lucide-react'


export default function AdyaSuggestions({ contracts }: { contracts: Contract[] }) {
  const oldPending = contracts.filter((c) => {
    if (c.status !== 'signer') return false
    const createdAt = new Date(c.createdAt)
    const daysDiff = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff > 30
  })

  return (
    <div className="mt-6 bg-blue-50 border border-blue-100 text-sm rounded-xl p-4">
      <div className="flex items-start gap-2 mb-2">
        <Lightbulb className="text-blue-500 w-5 h-5 mt-1" />
        <div className="font-medium text-blue-700">Suggestions intelligentes (Adya)</div>
      </div>
      <ul className="list-disc ml-6 space-y-1 text-blue-800">
        <li>{oldPending.length} contrats à signer depuis plus de 30 jours</li>
        <li>💬 Pensez à relancer vos clients pour accélérer la signature</li>
        <li>📊 Ajoutez un montant estimé pour chaque contrat pour une meilleure vision</li>
      </ul>
    </div>
  )
}
