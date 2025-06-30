'use client'

import { useEffect, useState } from 'react'
import { Contract } from '../../types/contract'
import { DataTable } from '@/components/ui/data-table'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

import CreateContractModal from '../modals/CreateContractModal'
import ContractChart from '../dashboard/ContractChart'
import ContractFilters from './ContractFilters'
import AdyaSuggestions from '../ai/AdyaSuggestions'
import KpiCards from '../dashboard/KpiCards'
import { getColumns } from './columns'

interface Props {
  contracts: Contract[]
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>
  fetchContracts: () => Promise<void>
  loading: boolean
  onSelect?: (contract: Contract) => void
}

export default function ContractTable({
  contracts,
  setContracts,
  fetchContracts,
  loading,
  onSelect,
}: Props) {
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredContracts(contracts)
    } else {
      setFilteredContracts(
        contracts.filter((c) => c.status === statusFilter)
      )
    }
  }, [statusFilter, contracts])

  const handleSelect = (contract: Contract) => {
    setSelectedContract(contract)
    onSelect?.(contract)
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground animate-pulse">
        Chargement des contrats...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-6 px-6 py-4">
      {/* 📁 Colonne gauche : Filtres + Actions + IA */}
      <div className="col-span-12 lg:col-span-3 space-y-4">
        <CreateContractModal onCreated={fetchContracts} />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📄 Tous les statuts</SelectItem>
            <SelectItem value="signer">✍️ À signer</SelectItem>
            <SelectItem value="review">🕵️ En review</SelectItem>
            <SelectItem value="signe">✅ Signé</SelectItem>
            <SelectItem value="bloque">🔒 Bloqué</SelectItem>
          </SelectContent>
        </Select>

        <ContractFilters
          onFilterChange={({ query, dateRange }) => {
            let filtered = contracts

            if (query) {
              filtered = filtered.filter((c) =>
                c.title?.toLowerCase().includes(query.toLowerCase())
              )
            }

            const from = dateRange?.from
            const to = dateRange?.to

            if (from && to) {
              filtered = filtered.filter((c) => {
                const created = new Date(c.createdAt)
                return created >= from && created <= to
              })
            }

            setFilteredContracts(filtered)
          }}
        />

        <AdyaSuggestions contracts={filteredContracts} />
      </div>

      {/* 📊 Colonne centrale : Vue principale */}
      <div className="col-span-12 lg:col-span-6 space-y-6">
        <KpiCards contracts={filteredContracts} />
        <ContractChart />

        <DataTable
          columns={getColumns(fetchContracts, setSelectedContract)}
          data={filteredContracts}
        />
      </div>

      {/* 📄 Colonne droite : Aperçu / fiche contrat */}
      <div className="col-span-12 lg:col-span-3 space-y-6">
        {selectedContract ? (
          <div className="rounded-xl border bg-white p-4">
            <div className="font-semibold mb-2">{selectedContract.title}</div>
            <div className="text-sm text-muted-foreground">
              Créé le {new Date(selectedContract.createdAt).toLocaleDateString()}
            </div>
            <div className="mt-2 text-sm">
              📌 Statut : <strong>{selectedContract.status}</strong>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border bg-white p-4 text-sm text-muted-foreground">
            📄 Sélectionnez un contrat pour afficher un résumé.
          </div>
        )}
      </div>
    </div>
  )
}
