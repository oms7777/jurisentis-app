export type ContractStatus = 'À signer' | 'Signé' | 'Bloqué'

export interface Contract {
  id: string
  title: string
  status: ContractStatus
  createdAt: string
  updatedAt: string
  createdBy: string
}
