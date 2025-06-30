'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Inbox, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

export default function ContractImport({ onImport }: { onImport?: () => void }) {
  const [open, setOpen] = useState(false)
  const [fileName, setFileName] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setFileName(file.name)
    toast.info('📄 Lecture du contrat en cours...')

    try {
      const text = await file.text()
      setContent(text.slice(0, 2000) + '...')

      const fakeSummary = `🧠 Résumé IA : Ce contrat concerne les termes de collaboration entre parties A et B...`
      setSummary(fakeSummary)

      toast.success('Résumé généré ✅')
    } catch (err) {
      toast.error('Erreur lors du traitement du fichier')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch('/api/contrats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: fileName.replace('.pdf', ''),
          status: 'à signer',
          summary,
          rawText: content,
        }),
      })

      if (!res.ok) throw new Error('Erreur API')

      toast.success('Contrat importé avec succès')
      setOpen(false)
      onImport?.()
    } catch {
      toast.error('Erreur lors de l’enregistrement')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Inbox className="w-4 h-4" /> Importer PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <div>
            <Label>Fichier PDF</Label>
            <Input type="file" accept="application/pdf" onChange={handleFileChange} />
            {fileName && <p className="text-sm text-muted-foreground mt-1">📄 {fileName}</p>}
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="animate-spin w-4 h-4" /> Analyse du contrat...
            </div>
          )}

          {!loading && content && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contenu extrait (aperçu)</Label>
                <Textarea value={content} readOnly rows={10} />
              </div>
              <div>
                <Label>Résumé IA (Adya)</Label>
                <Textarea value={summary} readOnly rows={10} />
              </div>
            </div>
          )}

          <div className="text-right">
            <Button onClick={handleSave} disabled={loading || !summary}>
              Sauvegarder dans XDraft
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
