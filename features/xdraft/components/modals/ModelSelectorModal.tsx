'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { VaultTemplate } from 'features/xvault/types/template'
import { motion } from 'framer-motion'

export default function ModelSelectorModal({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false)
  const [templates, setTemplates] = useState<VaultTemplate[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const selectedTemplate = templates.find((t) => t.id === selectedId)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/xvault')
        const data = await res.json()
        setTemplates(data)
      } catch (err) {
        toast.error('Erreur lors du chargement des modèles')
      }
    }

    if (open) fetchTemplates()
  }, [open])

  const handleCreate = async () => {
    if (!selectedTemplate) return

    setLoading(true)
    try {
      const res = await fetch('/api/contrats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedTemplate.title,
          status: selectedTemplate.status || 'signer',
          category: selectedTemplate.category,
          tags: selectedTemplate.tags.join(','),
          description: selectedTemplate.clauses.join('\n'),
          fromTemplateId: selectedTemplate.id, // facultatif pour historique
        }),
      })

      if (!res.ok) throw new Error('Erreur API')

      toast.success('Contrat généré depuis modèle ✅')
      setOpen(false)
      setSelectedId(null)
      onCreated?.()
    } catch (err) {
      toast.error('Erreur lors de la création du contrat')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">📄 Créer à partir d’un modèle</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl px-6 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">📚 Choisir un modèle</DialogTitle>
          </DialogHeader>

          <Select value={selectedId ?? ''} onValueChange={setSelectedId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un modèle..." />
            </SelectTrigger>
            <SelectContent>
              {templates.map((tpl) => (
                <SelectItem key={tpl.id} value={tpl.id}>
                  {tpl.title} — {tpl.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedTemplate && (
            <div>
              <label className="text-sm font-medium">Aperçu des clauses :</label>
              <Textarea value={selectedTemplate.clauses.join('\n\n')} rows={10} readOnly />
            </div>
          )}

          <div className="text-right">
            <Button onClick={handleCreate} disabled={!selectedId || loading}>
              {loading ? 'Création...' : 'Créer le contrat'}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
