'use client'

import { useDrop } from 'react-dnd'
import { useRef, useEffect } from 'react'
import { cn } from 'lib/utils'
import { Contract, ContractStatus } from 'features/xdraft/types/contract'
import ContractCard from './ContractCard'



const STATUSES: {
  key: ContractStatus
  label: string
  emoji: string
  color: string
}[] = [
  { key: 'signer', label: 'À signer', emoji: '✍️', color: 'border-blue-500' },
  { key: 'review', label: 'En review', emoji: '🔎', color: 'border-yellow-500' },
  { key: 'signe', label: 'Signé', emoji: '✅', color: 'border-green-500' },
  { key: 'bloque', label: 'Bloqué', emoji: '🔒', color: 'border-red-500' },
]

export default function ContractWorkflow({
  contracts,
  setContracts,
  onSelect,
}: {
  contracts: Contract[]
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>
  onSelect?: (contract: Contract) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {STATUSES.map((status) => (
        <Column
          key={status.key}
          status={status}
          contracts={contracts.filter((c) => c.status === status.key)}
          onDrop={(id) => {
            setContracts((prev) =>
              prev.map((c) => (c.id === id ? { ...c, status: status.key } : c))
            )
          }}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

function Column({
  status,
  contracts,
  onDrop,
  onSelect,
}: {
  status: {
    key: ContractStatus
    label: string
    emoji: string
    color: string
  }
  contracts: Contract[]
  onDrop: (id: string) => void
  onSelect?: (contract: Contract) => void
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  const [{ isOver }, drop] = useDrop({
    accept: 'CONTRACT',
    drop: (item: { id: string }) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  useEffect(() => {
    if (ref.current) {
      drop(ref)
    }
  }, [drop])

  return (
    <div
      ref={ref}
      className={cn(
        'bg-muted rounded-xl border p-4 min-h-[300px] flex flex-col gap-4 transition-colors',
        status.color,
        isOver && 'bg-accent'
      )}
    >
      <div className="text-sm font-semibold flex items-center gap-2">
        <span className="text-xl">{status.emoji}</span>
        {status.label} ({contracts.length})
      </div>

      {contracts.map((contract) => (
        <ContractCard
          key={contract.id}
          contract={contract}
          onClick={() => onSelect?.(contract)}
        />
      ))}
    </div>
  )
}
