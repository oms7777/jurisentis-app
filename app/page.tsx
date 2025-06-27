// app/page.tsx
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard') // ou '/dashboard' selon ta logique future
}
