// app/(app)/page.tsx
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard') // ou /dashboard si tu le préfères
}
