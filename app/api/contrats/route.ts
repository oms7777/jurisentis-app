// app/api/contrats/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from 'lib/prisma'
import { authOptions } from 'lib/auth'

// 🔄 GET : Récupérer tous les contrats
export async function GET() {
  try {
    const contrats = await prisma.contract.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(contrats)
  } catch (err: any) {
    console.error('💥 Erreur récupération contrats:', err.message)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// ➕ POST : Créer un contrat
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await req.json()
  const { title, status, category, tags, description } = body

  if (!title || !status) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
  }

  try {
    const nouveauContrat = await prisma.contract.create({
      data: {
        title,
        status,
        category,
        tags,
        description,
        createdById: user.id,
      },
    })
    return NextResponse.json(nouveauContrat)
  } catch (err: any) {
    console.error('💥 Erreur création contrat:', err.message)
    return NextResponse.json({ error: 'Erreur interne', details: err.message }, { status: 500 })
  }
}
