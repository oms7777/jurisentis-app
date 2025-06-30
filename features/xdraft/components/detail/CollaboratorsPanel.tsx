'use client'

import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Collaborator {
  name: string
  email: string
}

interface Props {
  collaborators: Collaborator[]
  onManage?: () => void
}

export default function CollaboratorsPanel({ collaborators, onManage }: Props) {
  return (
    <div className="space-y-2">
      {collaborators.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">Aucun collaborateur</p>
      ) : (
        <ul className="space-y-2">
          {collaborators.map((user, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-foreground">{user.name}</div>
                <div className="text-xs">{user.email}</div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Button variant="outline" size="sm" onClick={onManage}>
        <UserPlus className="w-4 h-4 mr-2" />
        Gérer les collaborateurs
      </Button>
    </div>
  )
}
