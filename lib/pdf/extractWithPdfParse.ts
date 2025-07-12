// lib/pdf/extractWithPdfParse.ts

// lib/pdf/extractWithPdfParse.ts

import pdf from 'pdf-parse'
import { Buffer } from 'node:buffer'

export async function extractWithPdfParse(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer)
    return data.text
  } catch (error: any) {
    console.error('❌ pdf-parse error:', error)
    throw new Error('Échec de l’extraction du PDF')
  }
}
