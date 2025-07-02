'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Props {
  onImported: () => void
}

export default function ImportTemplateForm({ onImported }: Props) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Aucun fichier sélectionné')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/xvault/import', {
        method: 'POST',
        body: formData,
      })

      const contentType = res.headers.get('content-type')
      let data: any = {}

      if (contentType?.includes('application/json')) {
        data = await res.json()
      } else {
        throw new Error('Réponse non-JSON reçue du serveur')
      }

      if (!res.ok) {
        throw new Error(data.error || 'Erreur inconnue')
      }

      toast.success('Modèle importé avec succès')
      onImported()
      setOpen(false)
      setFile(null)
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l’importation du fichier')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">📄 Importer un modèle</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Importer un fichier</DialogTitle>
          <DialogDescription>
            Sélectionnez un fichier DOCX ou PDF contenant un modèle de contrat.
          </DialogDescription>
        </DialogHeader>

        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Importation…' : 'Importer'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
