import { useParams } from 'next/navigation'
import PdfWithDetailPanel from '@/features/xvault/components/PdfWithDetailPanel'

export default function VaultViewPage() {
  const { id } = useParams()
  if (!id || typeof id !== 'string') return <div>❌ ID invalide</div>

  return <PdfWithDetailPanel contratId={id} />
}
