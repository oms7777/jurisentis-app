'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'

// 👇 Typage des props attendues
interface PdfProps {
  fileUrl: string
}

// Chargement dynamique avec typage explicite
const HighlightablePdfViewer = dynamic<PdfProps>(
  () => import('../pdf/HighlightPdfViewer'),
  { ssr: false }
)

export default function PdfDialogButton({ fileUrl }: PdfProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          📄 Voir PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full h-[90vh] p-0 overflow-hidden">
        <HighlightablePdfViewer fileUrl={fileUrl} />
      </DialogContent>
    </Dialog>
  )
}
