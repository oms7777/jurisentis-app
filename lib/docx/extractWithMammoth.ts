// lib/docx/extractWithMammoth.ts ✅
// lib/docx/extractWithMammoth.ts

import mammoth from 'mammoth'
import { Buffer } from 'node:buffer'

export async function extractWithMammoth(buffer: Buffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ buffer })
  return value
}
