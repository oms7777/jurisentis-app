export interface VaultTemplate {
  id: string
  title: string
  category: string
  clauses: string[]
  tags: string[]
  status: string
  rawText?: string
  fileUrl?: string
  createdAt: Date
  updatedAt: Date
}
