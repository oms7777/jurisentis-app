'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Contract } from '../../types/contract'
import { BarChart3 } from 'lucide-react'

interface Props {
  contracts: Contract[]
}

export default function ContractStats({ contracts }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        Statistiques des contrats
      </h2>
      <Card>
        <CardHeader>
            <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Voici mes données</p>
        </CardContent>
        </Card>
    </div>
  )
}
