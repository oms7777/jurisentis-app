// app/xcomply/page.tsx
'use client'

export default function XComplyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">⚖️ Conformité & Risques</h1>
      <p className="text-gray-600">
        Visualisez les risques juridiques, suivez les incidents et évaluez votre conformité globale.
      </p>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <p className="text-gray-500">Aucun incident signalé pour le moment.</p>
        <p className="text-sm text-gray-400">Les données seront bientôt affichées automatiquement ici.</p>
      </div>
    </div>
  )
}
