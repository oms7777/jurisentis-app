'use client'

import { useState } from 'react'

export default function InternalAdminPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<{
    code?: string
    link?: string
    error?: string
  } | null>(null)

  const handleGenerateCode = async () => {
    setLoading(true)
    setResponse(null)

    try {
      const res = await fetch('/api/auth/generate-registration-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setResponse({
        code: data.registrationCode,
        link: data.activationLink,
      })
    } catch (err: any) {
      setResponse({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">🎯 Génération d’accès démo</h1>
      <p className="text-gray-600">Créer un lien d’activation pour un utilisateur qualifié.</p>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <p className="font-medium text-gray-700">📨 Entrer un email pour générer un code :</p>

        <input
          type="email"
          placeholder="Email du futur utilisateur"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleGenerateCode}
          disabled={!email || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Génération...' : 'Générer le code'}
        </button>

        {response?.code && (
          <div className="mt-4 text-green-600 space-y-1">
            <div>✅ <strong>Code :</strong> {response.code}</div>
            <div>
              🔗 <strong>Lien d’activation :</strong>{' '}
              <a href={response.link} className="underline text-blue-700" target="_blank" rel="noopener noreferrer">
                {response.link}
              </a>
            </div>
          </div>
        )}

        {response?.error && (
          <div className="mt-4 text-red-600">❌ Erreur : {response.error}</div>
        )}
      </div>
    </div>
  )
}
