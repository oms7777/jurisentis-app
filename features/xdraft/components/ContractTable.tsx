'use client'

import { useEffect, useState } from 'react'
import { columns, Contract } from './columns'
import { DataTable } from './ui/data-table'

export default function ContractTable() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await fetch('/api/xdraft')
        const data = await res.json()
        setContracts(data)
      } catch (error) {
        console.error('Erreur lors du chargement des contrats :', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContracts()
  }, [])

  return (
    <div className="p-4">
      {loading ? (
        <div className="text-sm text-gray-500">Chargement des contrats...</div>
      ) : (
        <DataTable columns={columns} data={contracts} />
      )}
    </div>
  )
}
