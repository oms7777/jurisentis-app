import { writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getBufferFromRequest } from '@/lib/utils/getBufferFromRequest'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const templateId = formData.get('templateId') as string

  if (!file || !templateId) {
    return NextResponse.json({ error: 'Missing file or templateId' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filename = `${Date.now()}-${file.name}`
  const filePath = path.join(process.cwd(), 'public', 'uploads', filename)

  await writeFile(filePath, buffer)

  const fileUrl = `/uploads/${filename}`

  await prisma.vaultTemplate.update({
    where: { id: templateId },
    data: { fileUrl },
  })

  return NextResponse.json({ success: true, fileUrl })
}
