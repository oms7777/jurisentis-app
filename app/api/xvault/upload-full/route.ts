import { writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTextFromFile } from '@/lib/utils/extractTextFromFile'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const tagsRaw = formData.get('tags') as string
    const clausesRaw = formData.get('clauses') as string
    const status = formData.get('status') as string

    if (!file || !title || !category) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }

    const tags = tagsRaw?.split(',').map(t => t.trim()).filter(Boolean) || []
    const clauses = clausesRaw?.split('\n').map(c => c.trim()).filter(Boolean) || []

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${file.name}`
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename)

    await writeFile(filePath, buffer)
    const fileUrl = `/uploads/${filename}`

    const rawText = await extractTextFromFile(buffer, file.type)

    const newTemplate = await prisma.vaultTemplate.create({
      data: {
        title,
        category,
        status: status || 'actif',
        tags,
        clauses,
        fileUrl,
        rawText,
        createdById: userId,
      },
    })

    return NextResponse.json({ success: true, fileUrl, id: newTemplate.id })
  } catch (err: any) {
    console.error('❌ Erreur upload full :', err)
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
