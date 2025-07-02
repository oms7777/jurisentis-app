'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface ModalTemplateFormProps {
  onCreated: () => void
}

export default function ModalTemplateForm({ onCreated }: ModalTemplateFormProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('actif')
  const [clauses, setClauses] = useState('')
  const [tags, setTags] = useState('')

  const handleSubmit = async () => {
    const res = await fetch('/api/xvault/templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        category,
        status,
        clauses: clauses.split('\n'),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      }),
    })

    if (res.ok) {
      toast.success('Modèle créé')
      setOpen(false)
      onCreated()
    } else {
      toast.error('Erreur lors de la création')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Nouveau modèle</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <Input
          placeholder="Titre du modèle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Input
          placeholder="Tags (séparés par virgule)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <Textarea
          placeholder="Clauses (une par ligne)"
          value={clauses}
          onChange={(e) => setClauses(e.target.value)}
        />
        <Button onClick={handleSubmit}>Créer</Button>
      </DialogContent>
    </Dialog>
  )
}
