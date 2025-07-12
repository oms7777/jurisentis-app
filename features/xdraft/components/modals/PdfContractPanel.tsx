'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import PdfViewer from '@/components/pdf/PdfViewer'

interface Props {
  contractId: string
  onClose: () => void
}

export default function PdfContractPanel({ contractId, onClose }: Props) {
  const [contract, setContract] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/contrats/${contract.fileUrl}`)
        const data = await res.json()
        setContract(data)
      } catch (err) {
        toast.error('Erreur chargement contrat')
      }
    }
    fetchData()
  }, [contractId])

  if (!contract) return null

  const fileUrl = `/uploads/${contract.fileUrl}`

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex">
      <div className="flex-1 bg-white dark:bg-zinc-900">
        <PdfViewer fileUrl={fileUrl} />
      </div>

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className="w-full max-w-md h-full bg-white dark:bg-zinc-900 shadow-xl p-6 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Détails du contrat</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="text-sm space-y-4">
          <Info label="Fournisseur" value={contract.fournisseur} />
          <Info label="Montant" value={contract.montant} />
          <Info label="Date d'effet" value={contract.dateDebut} />
          <Info label="Date de fin" value={contract.dateFin} />
          <Info label="Responsable" value={contract.assignedTo} />

          <div>
            <p className="text-muted-foreground font-medium mb-1">Résumé IA</p>
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded whitespace-pre-wrap">
              {contract.resume || 'Pas de résumé disponible'}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between border-b py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || '-'}</span>
    </div>
  )
}
