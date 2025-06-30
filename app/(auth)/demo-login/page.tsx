// app/demo-login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function DemoLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (res?.ok) {
      router.push('/dashboard')
    } else {
      setError("Échec de la connexion.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-5">
        <h1 className="text-2xl font-semibold text-center text-blue-700">Connexion Démo Jurisentis</h1>

        <p className="text-sm text-center text-gray-500">
          🧪 Vous utilisez une version démo de Jurisentis. Certaines fonctionnalités peuvent être limitées.
        </p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="ex: test@entreprise.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="Votre mot de passe"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Se connecter
        </button>
      </form>
    </div>
  )
}
