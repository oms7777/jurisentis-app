'use client'

import { useRef, useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ImportTemplateButtonProps {
  templateId: string // 👈 Ajout nécessaire
  onSuccess?: (fileUrl: string) => void
}

export default function ImportTemplateButton({ templateId, onSuccess }: ImportTemplateButtonProps) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    toast('📂 Importation en cours...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('templateId', templateId) // ✅ important

      const res = await fetch('/api/xvault/upload-temp', {
        method: 'POST',
        body: formData,
      })


      const contentType = res.headers.get('content-type') || ''
      const isJson = contentType.includes('application/json')
      const data = isJson ? await res.json() : null

      if (!res.ok) {
        throw new Error(data?.error || 'Erreur inconnue')
      }

      toast.success('✅ Fichier importé avec succès')
      onSuccess?.(data.fileUrl)
    } catch (error: any) {
      toast.error(`❌ Échec de l'import : ${error.message}`)
    } finally {
      setLoading(false)
      event.target.value = '' // reset
    }
  }

  return (
    <>
      <input
        type="file"
        accept=".pdf,.docx"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button onClick={() => fileInputRef.current?.click()} disabled={loading} variant="outline">
        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Upload className="h-4 w-4" />}
        Importer un fichier
      </Button>
    </>
  )
}
