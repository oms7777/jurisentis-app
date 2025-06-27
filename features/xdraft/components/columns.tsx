'use client'

import { ColumnDef } from '@tanstack/react-table'
import { formatDate } from '../../../lib/utils'


export type Contract = {
  id: string
  title: string
  status: 'signé' | 'à signer' | 'bloqué'
  createdAt: string
}

// ✅ Badge de statut
function StatusBadge({ status }: { status: Contract['status'] }) {
  const base = 'text-xs font-medium px-2.5 py-0.5 rounded capitalize'
  const colorMap: Record<Contract['status'], string> = {
    signé: 'bg-green-100 text-green-800',
    'à signer': 'bg-blue-100 text-blue-800',
    bloqué: 'bg-red-100 text-red-800',
  }

  return (
    <span className={`${base} ${colorMap[status]}`}>
      {status}
    </span>
  )
}

// ✅ Colonnes du tableau
export const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: 'title',
    header: 'Titre',
    cell: ({ row }) => (
      <span className="font-medium">
        {row.getValue('title')}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.getValue('status') as Contract['status']
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
]
