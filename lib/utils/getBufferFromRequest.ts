// lib/utils/getBufferFromRequest.ts
export async function getBufferFromRequest(req: Request): Promise<Buffer> {
  const arrayBuffer = await req.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
