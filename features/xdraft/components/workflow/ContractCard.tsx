'use client'

import { useDrag } from 'react-dnd'
import { useRef, useEffect } from 'react'
import { Contract } from 'features/xdraft/types/contract'


export default function ContractCard({
  contract,
  onClick,
}: {
  contract: Contract
  onClick?: () => void
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'CONTRACT',
    item: { id: contract.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  useEffect(() => {
    if (ref.current) {
      drag(ref)
    }
  }, [ref, drag])

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-opacity ${
        isDragging ? 'opacity-30' : 'opacity-100'
      }`}
    >
      <div className="text-sm font-medium">{contract.title}</div>
      <div className="text-xs text-gray-500">
        Créé le {new Date(contract.createdAt).toLocaleDateString()}
      </div>
    </div>
  )
}
