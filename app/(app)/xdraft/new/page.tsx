'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { VaultTemplate } from '@/features/xvault/types/template'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function NewContractPage() {
  const [template, setTemplate] = useState<VaultTemplate | null>(null)
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('signer')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 🔁 Charger le modèle depuis localStorage
  useEffect(() => {
    const id = localStorage.getItem('selectedTemplateId')
    if (!id) {
      setLoading(false)
      return
    }

    fetch(`/api/templates/${id}`)
      .then((res) => res.json())
      .then((template: VaultTemplate) => {
        setTemplate(template)
        setTitle(template.title)
        setCategory(template.category)
        setStatus(template.status || 'signer')
        setTags(template.tags?.join(', ') || '')
        setDescription(template.clauses?.join('\n') || '')
      })
      .catch(() => {
        toast.error('Erreur lors du chargement du modèle')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleSubmit = async () => {
    if (!title) {
      toast.error('Titre requis')
      return
    }

    setSubmitting(true)

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

      if (!res.ok) throw new Error('Erreur')

      toast.success('Contrat créé avec succès ✅')
      window.location.href = '/xdraft'
    } catch {
      toast.error('Erreur lors de la création du contrat')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen gap-2 text-muted-foreground">
        <Loader2 className="animate-spin w-5 h-5" /> Chargement du modèle...
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Créer un contrat à partir d’un modèle</h1>

      <div className="space-y-4">
        <div>
          <Label>Titre</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Statut</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
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
          <Input value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div>
          <Label>Tags (séparés par virgule)</Label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
        </div>

        <div className="pt-4">
          <Button onClick={handleSubmit} disabled={submitting} className="w-full">
            {submitting ? 'Création en cours...' : 'Créer le contrat'}
          </Button>
        </div>
      </div>
    </div>
  )
}
