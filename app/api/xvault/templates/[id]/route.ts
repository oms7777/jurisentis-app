import { prisma } from 'lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from 'lib/auth'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const template = await prisma.vaultTemplate.findUnique({
      where: { id: params.id },
    })

    if (!template) {
      return NextResponse.json({ error: 'Modèle introuvable' }, { status: 404 })
    }

    return NextResponse.json(template)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await req.json()
    const { title, category, clauses, tags, status } = body

    const updated = await prisma.vaultTemplate.update({
      where: { id: params.id },
      data: { title, category, clauses, tags, status },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur mise à jour modèle' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.vaultTemplate.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ message: 'Modèle supprimé' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression modèle' }, { status: 500 })
  }
}
