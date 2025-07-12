// lib/pdf/extractTextFromPDF.ts
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'

export async function extractWithPdfjs(buffer: Buffer): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({ data: buffer })
  const pdf = await loadingTask.promise

  const texts: string[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()
    const pageText = content.items.map((item: any) => item.str).join(' ')
    texts.push(pageText)
  }

  return texts.join('\n')
}
