'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

type MonthlyData = {
  month: string
  contracts: number
}

const data: MonthlyData[] = [
  { month: 'Juil 2024', contracts: 8 },
  { month: 'Août 2024', contracts: 12 },
  { month: 'Sept 2024', contracts: 15 },
  { month: 'Oct 2024', contracts: 10 },
  { month: 'Nov 2024', contracts: 18 },
  { month: 'Déc 2024', contracts: 20 },
  { month: 'Janv 2025', contracts: 13 },
  { month: 'Févr 2025', contracts: 16 },
  { month: 'Mars 2025', contracts: 22 },
  { month: 'Avril 2025', contracts: 17 },
  { month: 'Mai 2025', contracts: 19 },
  { month: 'Juin 2025', contracts: 14 },
]

export default function ContractChart() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
      <h2 className="text-sm font-semibold text-muted-foreground mb-2">
        Évolution mensuelle des contrats
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="contracts"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
