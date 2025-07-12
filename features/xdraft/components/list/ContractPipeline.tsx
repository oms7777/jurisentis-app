'use client'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Contract } from 'features/xdraft/types/contract'
import { cn } from 'lib/utils'

const STATUSES = [
  { key: 'signer', label: '✍️ À signer' },
  { key: 'review', label: '🔎 En review' },
  { key: 'signe', label: '✅ Signé' },
  { key: 'bloque', label: '🔒 Bloqué' },
] as const

type StatusKey = typeof STATUSES[number]['key']

export default function ContractPipeline() {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: '1',
      title: 'NDA Salesforce',
      status: 'signer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Confidentialité',
      createdById: 'user1',
    },
    {
      id: '2',
      title: 'SaaS Google',
      status: 'review',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'SaaS',
      createdById: 'user2',
    },
    {
      id: '3',
      title: 'Partenariat AWS',
      status: 'signer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Partenariat',
      createdById: 'user3',
    },
    {
      id: '4',
      title: 'Contrat Huawei',
      status: 'signe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Client',
      createdById: 'user4',
    },
  ])

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const contractId = active.id as string
    const newStatus = over.id as StatusKey

    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === contractId
          ? { ...contract, status: newStatus }
          : contract
      )
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        {STATUSES.map((status) => (
          <SortableContext
            key={status.key}
            items={contracts.filter((c) => c.status === status.key).map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="bg-gray-50 border rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-3">{status.label}</h4>
              <div className="space-y-2 min-h-[100px]">
                {contracts
                  .filter((c) => c.status === status.key)
                  .map((contract) => (
                    <Card key={contract.id} className="p-3 cursor-move shadow-sm bg-white">
                      <div className="text-sm font-medium text-gray-800">
                        {contract.title}
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          </SortableContext>
        ))}
      </div>
    </DndContext>
  )
}
