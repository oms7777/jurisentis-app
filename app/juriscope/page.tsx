// app/juriscope/page.tsx
'use client'


export default function JuriscopePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📰 Veille juridique intelligente</h1>
      <p className="text-gray-600">
        Retrouvez ici les actualités, réglementations et changements impactant votre organisation.
      </p>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-2">
        <p className="text-gray-500">Aucune actualité disponible pour le moment.</p>
        <p className="text-sm text-gray-400">
          Les recommandations de l'IA Adya apparaîtront ici dès l'intégration des flux réglementaires.
        </p>
      </div>
    </div>
  )
}
