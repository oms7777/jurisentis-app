'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { VaultTemplate } from 'features/xvault/types/template'
import ModalTemplateForm from 'features/xvault/components/ModalTemplateForm'
import VaultTable from 'features/xvault/components/VaultTable'
import TemplateDetailPanel from 'features/xvault/components/TemplateDetailPanel'
import ImportTemplateForm from 'features/xvault/components/ImportTemplateForm'

export default function XVaultPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<VaultTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<VaultTemplate | null>(null)

  const fetchTemplates = async () => {
    const res = await fetch('/api/xvault/templates')
    const data = await res.json()
    setTemplates(data)
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
          <ImportTemplateForm onImported={fetchTemplates} />
          <ModalTemplateForm onCreated={fetchTemplates} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        {templates.length === 0 ? (
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
