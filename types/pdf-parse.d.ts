declare module 'pdf-parse' {
  interface PDFInfo {
    numpages: number;
    numrender: number;
    info: Record<string, any>;
    metadata: any;
    version: string;
  }

  interface PDFData {
    text: string;
    info: PDFInfo;
    metadata: any;
  }

  type BufferLike = Buffer | Uint8Array;

  export default function pdfParse(
    buffer: BufferLike,
    options?: any
  ): Promise<PDFData>;
}
