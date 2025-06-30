// ✅ features/xdraft/components/KpiCards.tsx

'use client'

import { Contract } from 'features/xdraft/types/contract'
import { FileText, FileCheck, FileClock, Ban } from 'lucide-react'

const cardStyles =
  'flex flex-col gap-1 p-4 bg-white rounded-xl shadow-sm border w-full max-w-[240px] min-w-[200px]'

const titleStyles = 'text-xs text-muted-foreground uppercase tracking-wide'
const countStyles = 'text-2xl font-bold'

export default function KpiCards({ contracts }: { contracts: Contract[] }) {
  const total = contracts.length
  const signer = contracts.filter((c) => c.status === 'signer').length
  const signe = contracts.filter((c) => c.status === 'signe').length
  const bloque = contracts.filter((c) => c.status === 'bloque').length

  return (
    <div className="flex gap-4 flex-wrap">
      <div className={cardStyles}>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className={titleStyles}>Total contrats</span>
        </div>
        <div className={countStyles}>{total}</div>
      </div>

      <div className={cardStyles}>
        <div className="flex items-center gap-2">
          <FileClock className="w-5 h-5 text-yellow-600" />
          <span className={titleStyles}>À signer</span>
        </div>
        <div className={countStyles}>{signer}</div>
      </div>

      <div className={cardStyles}>
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-green-600" />
          <span className={titleStyles}>Signés</span>
        </div>
        <div className={countStyles}>{signe}</div>
      </div>

      <div className={cardStyles}>
        <div className="flex items-center gap-2">
          <Ban className="w-5 h-5 text-red-600" />
          <span className={titleStyles}>Bloqués</span>
        </div>
        <div className={countStyles}>{bloque}</div>
      </div>
    </div>
  )
}
