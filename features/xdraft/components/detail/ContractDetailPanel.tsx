'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Copy, Trash, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { formatDate } from 'lib/utils'
import { Contract } from '../../types/contract'
import CollaboratorsPanel from './CollaboratorsPanel'
import EditContractModal from '../modals/EditContractModal'
import ManageCollaboratorsModal from '../modals/ManageCollaboratorsModal'

export default function ContractDetailPanel({
  contract,
  onClose,
  onUpdated,
}: {
  contract: Contract & { fromTemplateId?: string } // ✅ Correction ici
  onClose: () => void
  onUpdated?: () => void
}) {
  const [collaborators, setCollaborators] = useState([
    { name: 'Omar Hajoui', email: 'omar@example.com' },
    { name: 'Fatima Z.', email: 'fatima@example.com' },
  ])
  const [openModal, setOpenModal] = useState(false)

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-end">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className="w-full max-w-xl h-full bg-white dark:bg-zinc-900 shadow-xl p-6 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Détails du contrat
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <Section title="Informations">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoRow label="Titre" value={contract.title} />
              <InfoRow label="Statut" value={contract.status} />
              <InfoRow label="Créé le" value={formatDate(contract.createdAt)} />
              {contract.updatedAt && (
                <InfoRow label="Modifié le" value={formatDate(contract.updatedAt)} />
              )}
              {contract.fromTemplateId && (
                <InfoRow label="Origine" value="🧹 Issu d’un modèle" />
              )}
            </div>
          </Section>

          <Section title="Résumé généré par Adya">
            <div className="bg-muted text-sm rounded-md p-4 leading-relaxed whitespace-pre-line">
              {contract.summary || 'Pas de résumé disponible'}
            </div>
          </Section>

          <Section title="Historique">
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>✅ Créé le {formatDate(contract.createdAt)}</li>
              <li>✏️ Titre modifié récemment</li>
              <li>🔁 Statut mis à jour</li>
            </ul>
          </Section>

          <Section title="Collaborateurs">
            <CollaboratorsPanel
              collaborators={collaborators}
              onManage={() => setOpenModal(true)}
            />
          </Section>

          <Section title="Actions">
            <div className="flex gap-2 flex-wrap">
              <EditContractModal
                contract={contract}
                onUpdated={() => {
                  onUpdated?.()
                  onClose()
                }}
              />
              <Button
                variant="outline"
                onClick={() => toast('📄 Dupliquer pas encore implémenté')}
              >
                <Copy className="w-4 h-4 mr-2" /> Dupliquer
              </Button>
              <Button
                variant="destructive"
                onClick={() => toast.error('❌ Suppression non active')}
              >
                <Trash className="w-4 h-4 mr-2" /> Supprimer
              </Button>
            </div>
          </Section>
        </div>
      </motion.div>

      <ManageCollaboratorsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        collaborators={collaborators}
        onChange={setCollaborators}
      />
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value || '-'}</div>
    </div>
  )
}
