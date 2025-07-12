// lib/utils/saveUploadedFileToPublicFolder.ts
import fs from 'fs'
import path from 'path'

export async function saveUploadedFileToPublicFolder(buffer: Buffer, filename: string): Promise<string> {
  const uploadPath = path.join(process.cwd(), 'public', 'uploads')

  // Créer le dossier s’il n’existe pas
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
  }

  const filePath = path.join(uploadPath, filename)
  fs.writeFileSync(filePath, buffer)

  // Retourner l’URL publique
  return `/uploads/${filename}`
}
