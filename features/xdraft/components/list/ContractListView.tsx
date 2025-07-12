'use client'

import { useState } from 'react'
import { Contract } from '../../types/contract'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import ContractDetailPanel from '../detail/ContractDetailPanel'
import { getColumns } from './columns'
import CreateContractModal from '../modals/CreateContractModal'
import ContractImport from '../modals/ContractImport'
import PdfContractPanel from '../modals/PdfContractPanel'

interface Props {
  contracts: Contract[]
  fetchContracts: () => void
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>
  onSelect?: (contract: Contract, action: 'view' | 'pdf') => void
}

export default function ContractListView({
  contracts,
  fetchContracts,
  setContracts,
  onSelect,
}: Props) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [pdfContract, setPdfContract] = useState<Contract | null>(null)

  const filteredContracts = contracts.filter((c) => {
    const matchQuery = query ? c.title.toLowerCase().includes(query.toLowerCase()) : true
    const matchStatus = status === 'all' ? true : c.status === status
    const matchDate =
      dateRange?.from && dateRange?.to
        ? new Date(c.createdAt) >= dateRange.from && new Date(c.createdAt) <= dateRange.to
        : true
    return matchQuery && matchStatus && matchDate
  })

  const handleSelect = (contract: Contract, action: 'view' | 'pdf') => {
    if (onSelect) {
      onSelect(contract, action)
    } else {
      if (action === 'pdf') setPdfContract(contract)
      else setSelectedContract(contract)
    }
  }

  return (
    <div className="relative space-y-6">
      {/* 🔍 Filtres */}
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">🔍 Recherche</label>
          <Input placeholder="Titre, client..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className="w-48">
          <label className="block text-sm font-medium mb-1">📌 Statut</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="signer">✍️ À signer</SelectItem>
              <SelectItem value="review">🕵️ En review</SelectItem>
              <SelectItem value="signe">✅ Signé</SelectItem>
              <SelectItem value="bloque">🔒 Bloqué</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-72">
          <label className="block text-sm font-medium mb-1">📅 Dates</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from && dateRange?.to ? (
                  <span>
                    {format(dateRange.from, 'dd/MM/yyyy')} - {format(dateRange.to, 'dd/MM/yyyy')}
                  </span>
                ) : <span>Choisir...</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="ml-auto">
          <CreateContractModal onCreated={fetchContracts} />
        </div>
      </div>


      {/* 📊 Tableau */}
      <div className="bg-white border rounded-xl p-4">
        <DataTable
          columns={getColumns(fetchContracts, handleSelect)}
          data={filteredContracts}
          onRowClick={(row) => handleSelect(row, 'view')}
        />
      </div>

      {/* 📋 Détail contrat */}
      {selectedContract && (
        <ContractDetailPanel
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
          onUpdated={() => {
            fetchContracts()
            setSelectedContract(null)
          }}
        />
      )}

      {/* 📄 PDF panel */}
      {pdfContract && (
        <PdfContractPanel
          contractId={pdfContract.id}
          onClose={() => setPdfContract(null)}
        />
      )}
    </div>
  )
}
