import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { getModelById } from '@/lib/db/templates'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const template = await getModelById(params.id)

  if (!template?.fileUrl) {
    return new NextResponse('Fichier introuvable', { status: 404 })
  }

  // Supprimer le `/uploads/` du chemin si déjà inclus
  const safePath = template.fileUrl.startsWith('/uploads/')
    ? template.fileUrl.replace('/uploads/', '')
    : template.fileUrl

  const fileBuffer = await readFile(path.resolve('public/uploads', safePath))

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="modele.pdf"',
    },
  })
}
