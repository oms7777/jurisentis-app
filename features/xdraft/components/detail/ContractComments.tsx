'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Comment {
  author: string
  content: string
  timestamp: Date
}

export default function ContractComments() {
  const [comments, setComments] = useState<Comment[]>([
    {
      author: 'Omar',
      content: 'Revoir la clause de résiliation.',
      timestamp: new Date(),
    },
    {
      author: 'Fatima',
      content: 'Validé côté client.',
      timestamp: new Date(),
    },
  ])

  const [newComment, setNewComment] = useState('')

  const handleAdd = () => {
    if (!newComment.trim()) return

    setComments([
      ...comments,
      {
        author: 'Moi',
        content: newComment,
        timestamp: new Date(),
      },
    ])
    setNewComment('')
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2 text-sm text-muted-foreground">
        {comments.map((comment, i) => (
          <li key={i} className="border rounded-md p-2">
            <div className="font-medium">{comment.author}</div>
            <div>{comment.content}</div>
            <div className="text-xs text-muted-foreground">
              {comment.timestamp.toLocaleString()}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <Input
          placeholder="Ajouter un commentaire..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleAdd}>
          <Send className="w-4 h-4 mr-1" />
          Envoyer
        </Button>
      </div>
    </div>
  )
}
