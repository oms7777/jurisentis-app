'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Plus, FileText, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { VaultTemplate } from 'features/xvault/types/template'


export default function CreateContractModal({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('signer')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const [templates, setTemplates] = useState<VaultTemplate[]>([])
  const [showModelSelector, setShowModelSelector] = useState(false)

  const fetchTemplates = async () => {
    const res = await fetch('/api/xvault')
    const data = await res.json()
    setTemplates(data)
  }

  useEffect(() => {
    if (open) fetchTemplates()
  }, [open])

  const handleSubmit = async () => {
    if (!title) {
      toast.error('Titre requis', {
        description: 'Veuillez indiquer un titre de contrat.',
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/contrats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          status,
          category,
          tags,
          description,
        }),
      })

      if (!res.ok) throw new Error('Erreur API')

      toast.success('Contrat créé ✅', {
        description: `Le contrat "${title}" a bien été ajouté.`,
      })

      setTitle('')
      setStatus('signer')
      setCategory('')
      setTags('')
      setDescription('')
      setOpen(false)
      onCreated?.()
    } catch (err) {
      toast.error('Erreur', {
        description: 'Impossible de créer le contrat.',
      })
    } finally {
      setLoading(false)
    }
  }

  const applyTemplate = (template: VaultTemplate) => {
    setTitle(template.title)
    setCategory(template.category)
    setStatus(template.status || 'signer')
    setTags(template.tags?.join(', ') || '')
    setDescription(template.clauses?.join('\n') || '')
    setShowModelSelector(false)
    toast.info('Modèle appliqué ✨')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau contrat
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-xl px-6 py-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Créer un contrat
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" /> Créer à partir d’un modèle
              </Button>
            </div>

            {showModelSelector && (
              <div className="border p-3 rounded-md bg-muted">
                <Label>Choisir un modèle :</Label>
                <div className="grid gap-2 mt-2">
                  {templates.map((t) => (
                    <Button
                      key={t.id}
                      variant="secondary"
                      onClick={() => applyTemplate(t)}
                      className="justify-start"
                    >
                      {t.title} – {t.category}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label>Titre</Label>
              <Input
                placeholder="Ex: Accord fournisseur 2025"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label>Statut</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut du contrat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signer">✍️ À signer</SelectItem>
                  <SelectItem value="signe">✅ Signé</SelectItem>
                  <SelectItem value="bloque">🔒 Bloqué</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nda">NDA</SelectItem>
                  <SelectItem value="partenariat">Partenariat</SelectItem>
                  <SelectItem value="fournisseur">Fournisseur</SelectItem>
                  <SelectItem value="prestation">Prestation</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tags (séparés par virgule)</Label>
              <Input
                placeholder="Ex: urgent, confidentiel"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div>
              <Label>Description (facultatif)</Label>
              <Textarea
                placeholder="Contexte, objectifs, parties concernées..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Création en cours...' : 'Créer le contrat'}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
