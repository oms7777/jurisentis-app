// lib/utils/extractTextFromFile.ts

import { extractWithMammoth } from "../docx"
import { extractWithPdfParse } from "../pdf"


export async function extractTextFromFile(buffer: Buffer, type: string): Promise<string> {
  try {
    if (type === 'application/pdf') {
      console.log('➡️ Appel extractWithPdfParse')
      return extractWithPdfParse(buffer)
    }
    if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log('➡️ Appel extractWithMammoth')
      return extractWithMammoth(buffer)
    }
    throw new Error('Type de fichier non supporté')
  } catch (err) {
    console.error('❌ Erreur extractTextFromFile', err)
    throw err
  }
}
