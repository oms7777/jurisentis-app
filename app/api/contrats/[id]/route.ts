// app/api/contrats/[id]/route.ts

import { prisma } from 'lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// ✅ GET : récupérer un contrat par ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contrat introuvable' }, { status: 404 })
    }

    return NextResponse.json(contract)
  } catch (error: any) {
    console.error('💥 Erreur GET contrat:', error.message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// 🔄 PATCH : mettre à jour un contrat
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const updated = await prisma.contract.update({
      where: { id: params.id },
      data: {
        title: body.title,
        status: body.status,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, contract: updated })
  } catch (error: any) {
    console.error('💥 Erreur PATCH contrat:', error.message)
    return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 })
  }
}

// ❌ DELETE : supprimer un contrat
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await prisma.contract.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, contract: deleted })
  } catch (error: any) {
    console.error('💥 Erreur DELETE contrat:', error.message)
    return NextResponse.json({ error: 'Contrat introuvable' }, { status: 404 })
  }
}
