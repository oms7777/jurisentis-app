// jurisentis-app/app/admin/page.tsx
'use client'

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">🔐 Administration & Sécurité</h1>
      <p className="text-gray-600">
        Gérer les accès utilisateurs, les rôles, et l’audit des connexions.
      </p>

      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <p className="text-gray-500">
          ⚙️ Ce module permettra bientôt de :
        </p>
        <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
          <li>Attribuer des rôles par utilisateur (CLO, juriste, admin…)</li>
          <li>Activer ou désactiver des comptes</li>
          <li>Gérer les permissions par module (lecture / écriture)</li>
          <li>Auditer les connexions et accès sensibles</li>
        </ul>
        <p className="text-sm text-gray-400">
          Module en cours de développement.
        </p>
      </div>
    </div>
  )
}
