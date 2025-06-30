// app/xlegal/page.tsx
'use client'

export default function XLegalPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📂 Dossiers juridiques</h1>
      <p className="text-gray-600">
        Accédez à vos dossiers en cours, suivez leur avancement et collaborez efficacement.
      </p>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <p className="text-gray-500">Aucun dossier disponible pour le moment.</p>
        <button
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          onClick={() => alert('Fonctionnalité à venir')}
        >
          + Nouveau dossier
        </button>
      </div>
    </div>
  )
}
