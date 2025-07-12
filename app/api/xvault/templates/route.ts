// app/api/templates/route.ts
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

// 📥 GET – Lister tous les modèles
export async function GET() {
  try {
    const templates = await prisma.vaultTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(templates)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur chargement modèles' }, { status: 500 })
  }
}

// ➕ POST – Créer un nouveau modèle
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await req.json()
    const { title, category, clauses, tags, status } = body

    if (!title || !category || !status) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const template = await prisma.vaultTemplate.create({
      data: {
        title,
        category,
        clauses,
        tags,
        status,
        createdById: user.id,
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Erreur POST /templates:', error)
    return NextResponse.json({ error: 'Erreur création modèle' }, { status: 500 })
  }
}
