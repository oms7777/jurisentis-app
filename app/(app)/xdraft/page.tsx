'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AnimatePresence } from 'framer-motion'
import { Contract } from 'features/xdraft/types/contract'

// 🧩 Composants XDraft
import DashboardXDraft from 'features/xdraft/components/dashboard/DashboardxDraft'
import ContractWorkflow from 'features/xdraft/components/workflow/ContractWorkflow'
import ContractListView from 'features/xdraft/components/list/ContractListView'
import ContractStats from 'features/xdraft/components/dashboard/ContractStats'
import ContractCollaboration from 'features/xdraft/components/detail/ContractCollaboration'
import ContractDetailPanel from 'features/xdraft/components/detail/ContractDetailPanel'
import PdfContractPanel from '@/features/xdraft/components/modals/PdfContractPanel'



export default function XDraftPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showPdf, setShowPdf] = useState(false)

  const fetchContracts = async () => {
    try {
      const res = await fetch('/api/contrats')
      if (!res.ok) throw new Error('Erreur réseau')
      const data = await res.json()
      setContracts(data)
    } catch (error) {
      console.error('Erreur lors du chargement des contrats :', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [])

  return (
    <div className="space-y-6 px-6 py-6">
      <h1 className="text-2xl font-bold">Module : Contrats (XDraft)</h1>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-4 flex flex-wrap gap-2">
          <TabsTrigger value="dashboard">📊 Tableau de bord</TabsTrigger>
          <TabsTrigger value="workflow">📁 Vue Workflow</TabsTrigger>
          <TabsTrigger value="liste">📋 Liste complète</TabsTrigger>
          <TabsTrigger value="stats">📈 Statistiques</TabsTrigger>
          <TabsTrigger value="collab">🤝 Collaboration</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardXDraft contracts={contracts} />
        </TabsContent>

        <TabsContent value="workflow">
          <ContractWorkflow contracts={contracts} setContracts={setContracts} />
        </TabsContent>

        <TabsContent value="liste">
          <ContractListView
            contracts={contracts}
            fetchContracts={fetchContracts}
            setContracts={setContracts}
            onSelect={(contract) => {
              setSelectedContract(contract)
              setShowPdf(true) // ou false selon vue par défaut
            }}
          />
        </TabsContent>

        <TabsContent value="stats">
          <ContractStats contracts={contracts} />
        </TabsContent>

        <TabsContent value="collab">
          <ContractCollaboration contracts={contracts} />
        </TabsContent>
      </Tabs>

      {/* 📄 Détail animé du contrat (vue PDF ou vue classique) */}
      <AnimatePresence>
        {selectedContract &&
          (showPdf ? (
            <PdfContractPanel
              contractId={selectedContract.id}
              onClose={() => setSelectedContract(null)}
            />

          ) : (
            <ContractDetailPanel
              contract={selectedContract}
              onClose={() => setSelectedContract(null)}
              onUpdated={() => {
                fetchContracts()
                setSelectedContract(null)
              }}
            />
          ))}
      </AnimatePresence>
    </div>
  )
}
