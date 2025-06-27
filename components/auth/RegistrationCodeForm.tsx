'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function RegistrationCodeForm({ prefillCode = '' }: { prefillCode?: string }) {
  const [code, setCode] = useState(prefillCode.toUpperCase())
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const res = await fetch('/api/auth/validate-registration-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    if (res.ok) {
      const data = await res.json()
      const userId = data.userId
      setSuccess('Code validé ! Redirection en cours...')
      setTimeout(() => router.push(`/onboard?userId=${userId}`), 1500)
    } else {
      const data = await res.json()
      setError(data.message || 'Erreur')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-12">
      <h1 className="text-xl font-bold">Activer mon compte</h1>
      <p className="text-sm text-gray-600">
        Entrez le code reçu pour activer votre accès.
      </p>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Code d'activation"
        className="w-full border border-gray-300 rounded px-3 py-2"
        required
      />
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Valider
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
    </form>
  )
}
