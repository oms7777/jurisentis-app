// components/OnboardForm.tsx
'use client'

import { useState } from 'react'

export default function OnboardForm({ onSubmit }: { onSubmit: (data: { name: string; password: string; organization?: string }) => void }) {
  const [form, setForm] = useState({ name: '', password: '', organization: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm block mb-1">Nom complet</label>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="text-sm block mb-1">Mot de passe</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="text-sm block mb-1">Nom de l’organisation (optionnel)</label>
        <input
          name="organization"
          type="text"
          value={form.organization}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Finaliser
      </button>
    </form>
  )
}
