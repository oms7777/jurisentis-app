'use client'

import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { VaultTemplate } from '../types/template'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Eye, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'


const PdfViewer = dynamic(() => import('@/components/pdf/PdfViewer'), { ssr: false })

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
    cell: ({ row }) => formatDate(row.getValue('createdAt') as string),
  },
  {
    id: 'pdf',
    header: 'PDF',
    cell: ({ row }) => {
      const fileUrl = row.original.fileUrl
      const [open, setOpen] = useState(false)

      const cleanedUrl = useMemo(() => {
        if (!fileUrl) return ''
        return fileUrl.startsWith('/uploads/') ? fileUrl : `/uploads/${fileUrl}`
      }, [fileUrl])

      return (
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">📄 Voir PDF</Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-full h-[90vh] p-0 overflow-hidden">
              <DialogTitle>Prévisualisation PDF</DialogTitle>
              {cleanedUrl ? (
                <PdfViewer fileUrl={cleanedUrl} />
              ) : (
                <div className="text-red-500 p-4">PDF non disponible</div>
              )}
            </DialogContent>
          </Dialog>
          <a
            href={cleanedUrl}
            download
            className="text-xs text-blue-600 hover:underline"
          >
            ⬇️ Télécharger
          </a>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const router = useRouter()

      const handleDelete = async () => {
        const confirmed = confirm('Confirmer la suppression ?')
        if (!confirmed) return

        const res = await fetch(`/api/templates/${row.original.id}`, {
          method: 'DELETE',
        })

        if (res.ok) {
          toast.success('🗑️ Modèle supprimé')
          router.refresh()
        } else {
          toast.error('❌ Erreur lors de la suppression')
        }
      }

      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (onSelect) {
                onSelect(row.original)
              } else {
                router.push(`/xvault/view/${row.original.id}`)
              }
            }}
          >
            <Eye className="w-4 h-4 mr-1" /> Voir
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]
