'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Upload } from 'lucide-react'

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
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    if (!fileRef.current?.files?.[0]) {
      toast.error('Veuillez ajouter un fichier PDF.')
      return
    }

    const formData = new FormData()
    formData.append('file', fileRef.current.files[0])
    formData.append('title', title)
    formData.append('category', category)
    formData.append('status', status)
    formData.append('clauses', clauses)
    formData.append('tags', tags)

    setLoading(true)

    try {
      const res = await fetch('/api/xvault/upload-full', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        toast.success('Modèle créé avec succès 📄')
        setOpen(false)
        onCreated()
      } else {
        toast.error('Erreur lors de la création')
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Nouveau modèle</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <Input placeholder="Titre du modèle" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Catégorie" value={category} onChange={(e) => setCategory(e.target.value)} />
        <Input placeholder="Tags (séparés par virgule)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <Textarea placeholder="Clauses (une par ligne)" value={clauses} onChange={(e) => setClauses(e.target.value)} />
        <input ref={fileRef} type="file" accept=".pdf" />
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
          Créer avec PDF
        </Button>
      </DialogContent>
    </Dialog>
  )
}
