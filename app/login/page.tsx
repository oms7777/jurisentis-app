'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCredentialsLogin = async () => {
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Email ou mot de passe incorrect')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenue sur <span className="text-blue-600">Jurisentis</span></h1>
          <p className="text-gray-500 text-sm mt-1">Connectez-vous pour continuer</p>
        </div>

        {error && (
          <div className="mb-3 text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Email & Password */}
        <div className="space-y-3 mb-5">
          <input
            type="email"
            placeholder="Email professionnel"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCredentialsLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Se connecter
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm text-gray-500">
            <span className="bg-white px-2">ou</span>
          </div>
        </div>

        {/* SSO Login */}
        <div className="space-y-3">
          <button
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md py-2 px-4 shadow-sm hover:bg-gray-50 transition"
          >
            <Image src="/google.svg" alt="Google Logo" width={20} height={20} />
            <span className="text-sm font-medium text-gray-700">Se connecter avec Google</span>
          </button>

          <button
            onClick={() => signIn('azure-ad')}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md py-2 px-4 shadow hover:bg-[#005EA6] transition"
          >
            <Image src="/microsoft.svg" alt="Microsoft Logo" width={20} height={20} />
            <span className="text-sm font-medium">Se connecter avec Microsoft</span>
          </button>
        </div>

        <p className="mt-6 text-xs text-center text-gray-400">
          En vous connectant, vous acceptez nos <a href="#" className="underline">Conditions</a> et notre <a href="#" className="underline">Politique de confidentialité</a>.
        </p>
      </div>
    </div>
  )
}
