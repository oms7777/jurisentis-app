// features/xdraft/types/contracts.ts

export type ContractStatus = 'signer' | 'review' | 'signe' | 'bloque'

export interface Contract {
  id: string
  title: string
  status: 'signer' | 'signe' | 'bloque' | 'review'
  createdAt: string
  updatedAt: string
  category: string
  tags?: string
  description?: string
  summary?: string
  rawText?: string
  createdById: string

  // Champs enrichis
  counterpartyName?: string
  agreementDate?: string
  region?: string
  isRedlined?: boolean
  projectedSpend?: number
  paymentTerms?: string
  department?: string
}
