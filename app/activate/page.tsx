// ✅ app/activate/page.tsx
import { RegistrationCodeForm } from '../../components/auth/RegistrationCodeForm'

export default function ActivatePage({ searchParams }: { searchParams: { code?: string } }) {
  const prefillCode = searchParams.code || ''

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <RegistrationCodeForm prefillCode={prefillCode} />
    </div>
  )
}
