// app/(auth)/layout.tsx
import '../globals.css'
import * as React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  )
}
