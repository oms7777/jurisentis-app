'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Collaborator {
  name: string
  email: string
}

interface Props {
  open: boolean
  onClose: () => void
  collaborators: Collaborator[]
  onChange: (newList: Collaborator[]) => void
}

export default function ManageCollaboratorsModal({ open, onClose, collaborators, onChange }: Props) {
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')

  const handleAdd = () => {
    if (!newEmail || !newName) return
    onChange([...collaborators, { name: newName, email: newEmail }])
    setNewEmail('')
    setNewName('')
  }

  const handleRemove = (email: string) => {
    onChange(collaborators.filter(c => c.email !== email))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Gérer les collaborateurs</DialogTitle>
        </DialogHeader>

        {/* Liste des collaborateurs */}
        <ScrollArea className="h-40">
          <ul className="space-y-2">
            {collaborators.map((collab, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm"
              >
                <span>{collab.name} ({collab.email})</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemove(collab.email)}>
                  <Trash className="w-4 h-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>

        {/* Ajout de collaborateur */}
        <div className="grid gap-2 pt-4">
          <Input
            placeholder="Nom"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
