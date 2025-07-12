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
import { Plus, FileText, Sparkles, Inbox, Loader2 } from 'lucide-react'
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
  const [mode, setMode] = useState<'manual' | 'model' | 'import'>('manual')

  const [fileName, setFileName] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [importLoading, setImportLoading] = useState(false)

  const fetchTemplates = async () => {
    const res = await fetch('/api/xvault')
    const data = await res.json()
    setTemplates(data)
  }

  useEffect(() => {
    if (open && mode === 'model') fetchTemplates()
  }, [open, mode])

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

      setOpen(false)
      resetForm()
      onCreated?.()
    } catch {
      toast.error('Erreur', { description: 'Impossible de créer le contrat.' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setStatus('signer')
    setCategory('')
    setTags('')
    setDescription('')
    setFileName('')
    setContent('')
    setSummary('')
    setImportLoading(false)
    setMode('manual')
  }

  const applyTemplate = (template: VaultTemplate) => {
    setTitle(template.title)
    setCategory(template.category)
    setStatus(template.status || 'signer')
    setTags(template.tags?.join(', ') || '')
    setDescription(template.clauses?.join('\n') || '')
    toast.info('Modèle appliqué ✨')
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportLoading(true)
    setFileName(file.name)
    toast.info('📄 Lecture du contrat en cours...')

    try {
      const text = await file.text()
      setContent(text.slice(0, 2000) + '...')
      const fakeSummary = `🧠 Résumé IA : Ce contrat concerne les termes de collaboration entre parties A et B...`
      setSummary(fakeSummary)
      toast.success('Résumé généré ✅')
    } catch {
      toast.error('Erreur lors du traitement du fichier')
    } finally {
      setImportLoading(false)
    }
  }

  const handleImportSave = async () => {
    if (!fileName) return

    try {
      const formData = new FormData()
      formData.append('file', new File([content], fileName, { type: 'application/pdf' }))
      formData.append('title', fileName.replace('.pdf', ''))
      formData.append('category', category || 'autre')
      formData.append('tags', tags || '')
      formData.append('clauses', description || '')
      formData.append('status', status || 'signer')

      const resUpload = await fetch('/api/upload-full', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await resUpload.json()

      if (!resUpload.ok) throw new Error(uploadData.error)

      const { fileUrl, id } = uploadData

      // Enregistrer aussi comme contrat dans /api/contrats
      const resContract = await fetch('/api/contrats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: fileName.replace('.pdf', ''),
          status,
          category,
          tags,
          description,
          fileUrl,
          rawText: content,
          summary,
        }),
      })

      if (!resContract.ok) throw new Error('Erreur API')

      toast.success('Contrat importé avec succès')
      setOpen(false)
      resetForm()
      onCreated?.()
    } catch (err: any) {
      toast.error('Erreur import', { description: err.message })
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="h-4 w-4" /> Nouveau contrat
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl rounded-xl px-6 py-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Créer un contrat
            </DialogTitle>
          </DialogHeader>

          {/* 🔀 Mode switch */}
          <div className="flex gap-2">
            <Button variant={mode === 'manual' ? 'default' : 'outline'} size="sm" onClick={() => setMode('manual')}>
              ✍️ Manuel
            </Button>
            <Button variant={mode === 'model' ? 'default' : 'outline'} size="sm" onClick={() => setMode('model')}>
              <Sparkles className="w-4 h-4" /> Modèle XVault
            </Button>
            <Button variant={mode === 'import' ? 'default' : 'outline'} size="sm" onClick={() => setMode('import')}>
              <Inbox className="w-4 h-4" /> Importer PDF
            </Button>
          </div>

          {/* ✨ MODELE */}
          {mode === 'model' && (
            <div className="border p-3 rounded-md bg-muted">
              <Label>Choisir un modèle :</Label>
              <div className="grid gap-2 mt-2">
                {templates.map((t) => (
                  <Button
                    key={t.id}
                    variant="secondary"
                    onClick={() => {
                      localStorage.setItem('selectedTemplateId', t.id)
                      window.location.href = '/xdraft/new'
                    }}
                    className="justify-start"
                  >
                    📄 {t.title} – {t.category}
                  </Button>
                ))}
              </div>
            </div>
          )}



          {/* 📄 IMPORT */}
          {mode === 'import' && (
            <div className="border p-3 rounded-md bg-muted space-y-4">
              <div>
                <Label>Fichier PDF</Label>
                <Input type="file" accept="application/pdf" onChange={handleFileChange} />
                {fileName && <p className="text-sm text-muted-foreground mt-1">📄 {fileName}</p>}
              </div>

              {importLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="animate-spin w-4 h-4" /> Analyse du contrat...
                </div>
              )}

              {!importLoading && content && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Contenu extrait (aperçu)</Label>
                    <Textarea value={content} readOnly rows={8} />
                  </div>
                  <div>
                    <Label>Résumé IA (Adya)</Label>
                    <Textarea value={summary} readOnly rows={8} />
                  </div>
                </div>
              )}

              <div className="text-right">
                <Button onClick={handleImportSave} disabled={importLoading || !summary}>
                  Sauvegarder dans XDraft
                </Button>
              </div>
            </div>
          )}

          {/* 📝 FORMULAIRE MANUEL */}
          {mode === 'manual' && (
            <div className="space-y-4">
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
              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                {loading ? 'Création en cours...' : 'Créer le contrat'}
              </Button>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}