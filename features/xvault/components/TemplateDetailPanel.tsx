'use client'

import { motion } from 'framer-motion'
import { X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VaultTemplate } from '../types/template'
import { formatDate } from 'lib/utils'

export default function TemplateDetailPanel({
  template,
  onClose,
  onUseTemplate,
}: {
  template: VaultTemplate
  onClose: () => void
  onUseTemplate?: (template: VaultTemplate) => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-end">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className="w-full max-w-xl h-full bg-white dark:bg-zinc-900 shadow-xl p-6 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Détails du modèle
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

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
                  <span
                    key={idx}
                    className="bg-muted text-xs px-2 py-1 rounded-full"
                  >
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
