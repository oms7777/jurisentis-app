'use client'

import ContractTable from "../../features/xdraft/components/ContractTable"


export default function XDraftPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Module : Contrats (XDraft)</h1>
      <ContractTable />
    </div>
  )
}
