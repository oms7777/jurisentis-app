// ✅ features/xdraft/components/EditContractModal.tsx

'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { FilePenLine } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Contract } from 'features/xdraft/types/contract'

export default function EditContractModal({
  contract,
  onUpdated
}: {
  contract: Contract
  onUpdated?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(contract.title)
  const [status, setStatus] = useState(contract.status)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    if (!title || !status) {
      toast.error('Champs manquants')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/xdraft/${contract.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status })
      })

      if (!res.ok) throw new Error('Échec MAJ')

      toast.success('Contrat modifié ✅')
      setOpen(false)
      onUpdated?.()
    } catch {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <FilePenLine className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-xl px-6 py-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <FilePenLine className="w-5 h-5 text-primary" />
              Modifier contrat
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />

            <Select value={status} onValueChange={(val) => setStatus(val as 'signer' | 'signe' | 'bloque')}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="signer">✍️ À signer</SelectItem>
                <SelectItem value="signe">✅ Signé</SelectItem>
                <SelectItem value="bloque">🔒 Bloqué</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleUpdate} disabled={loading} className="w-full">
              {loading ? 'Mise à jour...' : 'Enregistrer'}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
