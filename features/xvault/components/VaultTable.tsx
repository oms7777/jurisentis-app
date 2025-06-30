'use client'

import { VaultTemplate } from '../types/template'
import { DataTable } from '@/components/ui/data-table'
import { columns as getColumns } from './columns'

export default function VaultTable({
  data,
  onSelect,
}: {
  data: VaultTemplate[]
  onSelect?: (template: VaultTemplate) => void
}) {
  const columns = getColumns(onSelect)

  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={onSelect} // 👈 pour que le clic sur la ligne fonctionne aussi
    />
  )
}
