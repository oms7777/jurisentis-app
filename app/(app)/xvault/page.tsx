'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { VaultTemplate } from 'features/xvault/types/template'
import ModalTemplateForm from 'features/xvault/components/ModalTemplateForm'
import VaultTable from 'features/xvault/components/VaultTable'
import TemplateDetailPanel from 'features/xvault/components/TemplateDetailPanel'
import { toast } from 'sonner'

export default function XVaultPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<VaultTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<VaultTemplate | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/xvault/templates')
      if (!res.ok) throw new Error('Erreur lors du chargement des modèles')
      const data = await res.json()
      setTemplates(data)
    } catch (err: any) {
      toast.error(err.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">📁 Référentiels de contrats</h1>
          <p className="text-gray-600">
            Gérer les modèles, clauses types et structures contractuelles de votre organisation.
          </p>
        </div>
        <div className="flex gap-2">
          <ModalTemplateForm onCreated={fetchTemplates} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md min-h-[200px]">
        {loading ? (
          <p className="text-gray-500 italic">Chargement des modèles...</p>
        ) : templates.length === 0 ? (
          <div className="space-y-4">
            <p className="text-gray-500">Aucun modèle référencé pour l'instant.</p>
            <button
              onClick={() => router.push('/xdraft')}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Ajouter un premier modèle via XDraft
            </button>
          </div>
        ) : (
          <VaultTable data={templates} onSelect={setSelectedTemplate} />
        )}
      </div>

      {selectedTemplate && (
        <TemplateDetailPanel
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onUseTemplate={(tpl) => {
            localStorage.setItem('fromTemplate', JSON.stringify(tpl))
            router.push('/xdraft')
          }}
        />
      )}
    </div>
  )
}
