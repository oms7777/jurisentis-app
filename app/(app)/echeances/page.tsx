// app/echeances/page.tsx
'use client'

export default function EcheancesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📆 Échéancier intelligent</h1>
      <p className="text-gray-600">
        Visualisez toutes les échéances contractuelles importantes, classées par priorité et date.
      </p>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-gray-500">Aucune échéance à afficher pour le moment.</p>
        <p className="text-sm text-gray-400 mt-2">
          Lors de la création d’un contrat, les échéances seront automatiquement générées ici.
        </p>
      </div>
    </div>
  )
}
