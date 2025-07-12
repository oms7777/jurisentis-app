'use client'

import { useEffect, useState } from 'react'
import { VaultTemplate } from '@/features/xvault/types/template'
import PdfViewer from '@/components/pdf/PdfViewer'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PdfWithDetailPanel({ contratId }: { contratId: string }) {
  const [template, setTemplate] = useState<VaultTemplate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/templates/${contratId}`)
        if (!res.ok) throw new Error('Erreur réseau')
        const data = await res.json()
        setTemplate(data)
      } catch (err) {
        toast.error('Erreur lors du chargement du modèle')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [contratId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-6 h-6" />
        <span className="ml-2">Chargement du modèle...</span>
      </div>
    )
  }

  if (!template) {
    return <div className="text-center p-10 text-red-500">Modèle introuvable.</div>
  }

  const fileUrl = template.fileUrl?.startsWith('/uploads/')
    ? template.fileUrl
    : `/uploads/${template.fileUrl}`

  return (
    <div className="flex h-screen">
      {/* 🧾 PDF à gauche */}
      <div className="w-2/3 border-r overflow-hidden">
        <PdfViewer fileUrl={fileUrl} />
      </div>

      {/* 📊 Métadonnées à droite */}
      <div className="w-1/3 p-6 overflow-y-auto space-y-6">
        <h2 className="text-xl font-semibold">📄 Détails du modèle</h2>

        <Info label="Titre" value={template.title} />
        <Info label="Catégorie" value={template.category} />
        <Info label="Statut" value={template.status} />
        <Info label="Créé le" value={formatDate(template.createdAt)} />

        <Section title="Tags">
          {template.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag, idx) => (
                <span key={idx} className="bg-muted text-xs px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground italic">Aucun tag</div>
          )}
        </Section>

        <Section title="Clauses">
          {template.clauses?.length ? (
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              {template.clauses.map((clause, idx) => (
                <li key={idx}>{clause}</li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground italic">Aucune clause</div>
          )}
        </Section>

        <Section title="Contenu extrait (brut)">
          <div className="text-xs bg-muted p-2 rounded whitespace-pre-wrap max-h-48 overflow-y-auto">
            {template.rawText || 'Aucun contenu extrait'}
          </div>
        </Section>

        <div className="pt-4">
          <Button onClick={() => alert('🚀 Action personnalisée ici')}>
            📄 Créer un contrat depuis ce modèle
          </Button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {children}
    </div>
  )
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between border-b py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || '-'}</span>
    </div>
  )
}
