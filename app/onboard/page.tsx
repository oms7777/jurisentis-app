'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import OnboardForm from '../../components/OnboardForm'

export default function OnboardPage() {
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')

  const handleSubmit = async (data: { name: string; password: string; organization?: string }) => {
    console.log('📤 Données envoyées à l’API :', { ...data, userId })

    const res = await fetch('/api/auth/complete-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId }),
    })

    const result = await res.json()

    console.log('📥 Réponse reçue de l’API :', result)

    if (res.ok && result.redirectTo) {
      console.log('🔁 Redirection vers :', result.redirectTo)
      router.push(result.redirectTo)
    } else {
      console.error('❌ Erreur :', result.error || 'Erreur serveur.')
      setError(result.error || 'Erreur serveur.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">Finaliser l’activation</h1>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <OnboardForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
