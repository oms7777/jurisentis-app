import { cn } from "lib/utils";




type Status = 'signer' | 'signe' | 'bloque'

const statusMap: Record<Status, { label: string; color: string }> = {
  signer: { label: '✍️ À signer', color: 'bg-yellow-100 text-yellow-800' },
  signe: { label: '✅ Signé', color: 'bg-green-100 text-green-800' },
  bloque: { label: '🔒 Bloqué', color: 'bg-red-100 text-red-800' },
}

export function StatusBadge({ status }: { status: Status }) {
  const { label, color } = statusMap[status]

  return (
    <span
      className={cn(
        'text-xs font-medium px-2 py-1 rounded-full',
        color
      )}
    >
      {label}
    </span>
  )
}
