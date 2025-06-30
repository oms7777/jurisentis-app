// app/providers.tsx
'use client'

import { ToastProvider } from '../components/ui/toast-provider'
import { TooltipProvider } from '@/components/ui/tooltip' // ✅ à importer
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <ToastProvider />
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </DndProvider>
  )
}
