'use client'

import { ColumnDef } from '@tanstack/react-table'
import { VaultTemplate } from '../types/template'
import { formatDate } from 'lib/utils'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'

export const columns = (
  onSelect?: (template: VaultTemplate) => void
): ColumnDef<VaultTemplate>[] => [
  {
    accessorKey: 'title',
    header: 'Titre',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('title')}</span>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Catégorie',
  },
  {
    accessorKey: 'status',
    header: 'Statut',
  },
  {
    accessorKey: 'createdAt',
    header: 'Créé le',
    cell: ({ row }) =>
      formatDate(row.getValue('createdAt') as string),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSelect?.(row.original)}
      >
        <Eye className="w-4 h-4 mr-1" />
        Voir
      </Button>
    ),
  },
]
