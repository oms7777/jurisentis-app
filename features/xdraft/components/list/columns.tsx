'use client'

import { ColumnDef } from '@tanstack/react-table'
import { formatDate } from 'lib/utils'
import { Pencil, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Contract, ContractStatus } from 'features/xdraft/types/contract'
import EditContractModal from '../modals/EditContractModal'

function StatusBadge({ status }: { status: ContractStatus }) {
  const colorMap: Record<ContractStatus, string> = {
    signe: 'bg-emerald-100 text-emerald-800',
    signer: 'bg-blue-100 text-blue-800',
    bloque: 'bg-red-100 text-red-800',
    review: 'bg-yellow-100 text-yellow-800',
  }

  const labelMap: Record<ContractStatus, string> = {
    signe: '✅ Signé',
    signer: '✍️ À signer',
    bloque: '🔒 Bloqué',
    review: '🕵️ En review',
  }

  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${colorMap[status]}`}>
      {labelMap[status]}
    </span>
  )
}

export function getColumns(
  refetch: () => void,
  onSelect?: (contract: Contract) => void
): ColumnDef<Contract>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Titre',
      cell: ({ row }) => (
        <span
          className="font-medium cursor-pointer hover:underline"
          onClick={() => onSelect?.(row.original)}
        >
          {row.getValue('title')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.getValue('status') as ContractStatus
        return <StatusBadge status={status} />
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Créé le',
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as string
        return (
          <span className="text-sm text-muted-foreground">
            {formatDate(createdAt)}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const contract = row.original
        const [editOpen, setEditOpen] = useState(false)

        const handleDelete = async () => {
          try {
            const res = await fetch(`/api/xdraft/${contract.id}`, {
              method: 'DELETE',
            })

            if (!res.ok) throw new Error('Échec suppression')

            toast.success('Contrat supprimé', {
              description: `Le contrat "${contract.title}" a été supprimé.`,
            })

            refetch()
          } catch (error) {
            toast.error('Erreur', {
              description: 'Impossible de supprimer ce contrat.',
            })
          }
        }

        return (
          <div className="flex gap-1 items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => setEditOpen(true)} className="p-2">
                  <Pencil className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Modifier</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={handleDelete} className="text-red-500 hover:text-red-700 p-2">
                  <Trash className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Supprimer</TooltipContent>
            </Tooltip>

            <EditContractModal
              contract={contract}
              onUpdated={() => {
                refetch()
                setEditOpen(false)
              }}
            />
          </div>
        )
      },
    },
  ]
}
