'use client'

import ContractChart from './ContractChart'
import { Contract } from '../../types/contract'
import AdyaSuggestions from '../ai/AdyaSuggestions'
import KpiCards from './KpiCards'

export default function DashboardXDraft({
  contracts,
}: {
  contracts: Contract[]
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">📊 Tableau de bord</h2>

      {/* KPI globaux */}
      <KpiCards contracts={contracts} />

      {/* Évolution dans le temps */}
      <ContractChart />

      {/* Suggestions IA */}
      <AdyaSuggestions contracts={contracts} />
    </div>
  )
}
