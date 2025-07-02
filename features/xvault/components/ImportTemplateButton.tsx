import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from 'lib/auth'
import { extractTextFromPDF } from 'lib/pdf'
import { prisma } from 'lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  try {
    const text = await extractTextFromPDF(buffer)

    // Exemple : découper en clauses par paragraphes
    const clauses = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)

    const template = await prisma.vaultTemplate.create({
      data: {
        title: file.name.replace(/\.pdf$/, ''),
        category: 'Importé',
        status: 'brouillon',
        clauses,
        tags: ['importé'],
        createdById: user.id,
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du parsing PDF' }, { status: 500 })
  }
}
