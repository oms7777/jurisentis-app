import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    // Vérifie si le modèle existe
    const existing = await prisma.vaultTemplate.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Modèle non trouvé' }, { status: 404 })
    }

    // Supprime le modèle
    await prisma.vaultTemplate.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Modèle supprimé' })
  } catch (error) {
    console.error('[TEMPLATE_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
