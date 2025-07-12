// app/providers.tsx
'use client'

import { ToastProvider } from '../components/ui/toast-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SessionProvider } from 'next-auth/react' // ✅ AJOUT ICI

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider> {/* ✅ WRAP ICI */}
      <DndProvider backend={HTML5Backend}>
        <ToastProvider />
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </DndProvider>
    </SessionProvider>
  )
}
