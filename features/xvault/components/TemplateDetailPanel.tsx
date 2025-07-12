'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VaultTemplate } from '../types/template'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import ImportTemplateButton from './ImportTemplateButton'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import dynamic from 'next/dynamic'


const PdfViewer = dynamic(() => import('@/components/pdf/PdfViewer'), {
  ssr: false,
});


export default function TemplateDetailPanel({
  template,
  onClose,
  onUseTemplate,
  onUpdated,
}: {
  template: VaultTemplate
  onClose: () => void
  onUseTemplate?: (template: VaultTemplate) => void
  onUpdated?: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [rawText, setRawText] = useState(template.rawText || '')
  const [isSaving, setIsSaving] = useState(false)
  const [fileUrl, setFileUrl] = useState(template.fileUrl || '')


  async function handleSave() {
    setIsSaving(true)
    const res = await fetch(`/api/templates/${template.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: template.title,
        category: template.category,
        status: template.status,
        clauses: template.clauses,
        tags: template.tags,
        rawText,
      }),
    })

    if (res.ok) {
      toast.success('✅ Contenu brut mis à jour')
      setIsEditing(false)
      onUpdated?.()
    } else {
      const data = (await res.json()) as { error?: string }
      toast.error(`❌ Erreur : ${data.error || 'Erreur inconnue'}`)
    }

    setIsSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-end">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className="w-full max-w-xl h-full bg-white dark:bg-zinc-900 shadow-xl p-6 overflow-y-auto"
      >
        <Header onClose={onClose} />

        <div className="space-y-6 text-sm">
          <Section title="Informations">
            <Info label="Titre" value={template.title} />
            <Info label="Catégorie" value={template.category} />
            <Info label="Statut" value={template.status} />
            <Info label="Créé le" value={formatDate(template.createdAt)} />
          </Section>

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
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {template.clauses.map((clause, idx) => (
                  <li key={idx}>{clause}</li>
                ))}
              </ul>
            ) : (
              <div className="text-muted-foreground italic">Aucune clause définie</div>
            )}
          </Section>

          <Section title="Contenu brut du fichier">
            {isEditing ? (
              <Editor
                rawText={rawText}
                setRawText={setRawText}
                onCancel={() => setIsEditing(false)}
                onSave={handleSave}
                isSaving={isSaving}
              />
            ) : (
              <ReadOnlyView
                text={template.rawText}
                onEdit={() => setIsEditing(true)}
                templateId={template.id}
                onSuccess={onUpdated}
                setFileUrl={setFileUrl}
              />

            )}
          </Section>

          {fileUrl && (
            <Section title="Visualisation du PDF">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">📄 Voir le PDF original</Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl w-full h-[90vh] p-0 overflow-hidden">
                  <PdfViewer fileUrl={`/uploads/${template.fileUrl}`} />
                </DialogContent>
              </Dialog>
            </Section>
          )}

          <Section title="Actions">
            <Button onClick={() => onUseTemplate?.(template)}>
              📄 Créer un contrat à partir de ce modèle
            </Button>
          </Section>
        </div>
      </motion.div>
    </div>
  )
}

function Header({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <FileText className="w-5 h-5 text-purple-600" />
        Détails du modèle
      </h2>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="w-5 h-5" />
      </Button>
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
    <div className="flex justify-between border-b py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || '-'}</span>
    </div>
  )
}

function Editor({
  rawText,
  setRawText,
  onCancel,
  onSave,
  isSaving,
}: {
  rawText: string
  setRawText: (text: string) => void
  onCancel: () => void
  onSave: () => void
  isSaving: boolean
}) {
  return (
    <>
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        className="w-full p-2 text-sm bg-zinc-100 dark:bg-zinc-800 rounded border border-muted resize-none"
        rows={12}
      />
      <div className="flex gap-2 mt-2">
        <Button onClick={onSave} disabled={isSaving}>
          💾 {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </>
  )
}

function ReadOnlyView({
  text,
  onEdit,
  templateId,
  onSuccess,
  setFileUrl,
}: {
  text?: string
  onEdit: () => void
  templateId: string
  onSuccess?: () => void
  setFileUrl: (url: string) => void
}) {
  return (
    <div className="relative bg-muted p-3 rounded text-xs whitespace-pre-wrap text-muted-foreground max-h-64 overflow-y-auto">
      {text || 'Aucun contenu extrait'}
      <div className="absolute top-2 right-2 flex gap-2">
        <Button size="sm" variant="ghost" className="text-xs" onClick={onEdit}>
          ✏️ Modifier
        </Button>
        <ImportTemplateButton
          templateId={templateId}
          onSuccess={(newFileUrl) => {
            toast.success('✅ Contenu mis à jour via import')
            setFileUrl(newFileUrl)
            onSuccess?.()
          }}
        />
      </div>
    </div>
  )
}
