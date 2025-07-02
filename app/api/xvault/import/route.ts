import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { Buffer } from 'buffer'
import { authOptions } from 'lib/auth'
import { prisma } from 'lib/prisma'

console.log("🔥 API /api/xvault/import hit!")

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!user?.id) return error('Utilisateur non authentifié', 401)

    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return error('Fichier manquant', 400)

    const fileName = file.name.toLowerCase()
    const buffer = Buffer.from(await file.arrayBuffer())

    // Valeurs par défaut
    let title = 'Modèle importé'
    let category = 'import'
    let status = '📝 Brouillon'
    let tags: string[] = []
    let clauses: string[] = []

    // === JSON ===
    if (fileName.endsWith('.json')) {
      try {
        const json = JSON.parse(buffer.toString())
        const { title: t, category: c, status: s, clauses: cl, tags: tg } = json

        if (!t || !cl || !Array.isArray(cl) || cl.length === 0) {
          return error('Fichier JSON invalide ou incomplet', 400)
        }

        title = t
        category = c ?? category
        status = s ?? status
        clauses = cl
        tags = tg ?? []
      } catch {
        return error('Fichier JSON non lisible', 400)
      }
    }

    // === PDF ===
    else if (fileName.endsWith('.pdf')) {
      try {
        const result = await pdfParse(buffer)
        const text = result.text || ''
        clauses = extractClauses(text)
        title = extractTitle(text)
        if (clauses.length === 0) return error('PDF sans contenu utile', 400)
      } catch {
        return error('Erreur de lecture du fichier PDF', 500)
      }
    }

    // === DOCX ===
    else if (fileName.endsWith('.docx')) {
      try {
        const result = await mammoth.extractRawText({ buffer })
        const text = result.value || ''
        clauses = extractClauses(text)
        title = extractTitle(text)
        if (clauses.length === 0) return error('Word vide ou mal formaté', 400)
      } catch {
        return error('Erreur de lecture du fichier Word', 500)
      }
    }

    // === Non supporté ===
    else {
      return error('Format non supporté (.pdf, .docx, .json)', 415)
    }

    const created = await prisma.vaultTemplate.create({
      data: {
        title,
        category,
        status,
        clauses,
        tags,
        createdById: user.id,
      },
    })

    return NextResponse.json(created, { status: 201 })

  } catch (e: any) {
    console.error('[IMPORT_ERROR]', e)
    return error("Erreur serveur lors de l'import", 500)
  }
}

// === Helpers ===
function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function extractTitle(text: string): string {
  return text.split('\n').find(line => line.trim().length > 10)?.slice(0, 100) || 'Modèle sans titre'
}

function extractClauses(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 50)
}
