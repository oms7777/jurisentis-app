'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Contract } from '../../types/contract'
import { Users } from 'lucide-react'

interface Props {
  contracts: Contract[]
}

export default function ContractCollaboration({ contracts }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Users className="w-5 h-5 text-green-600" />
        Collaboration sur les contrats
      </h2>

      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-sm">
            (🤝 Ici seront affichés les contributeurs, permissions, commentaires à venir…)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
