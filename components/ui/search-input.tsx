'use client'

import { Input } from '@/components/ui/input'
import { cn } from 'lib/utils'
import { Search } from 'lucide-react'
import { useState } from 'react'

type SearchInputProps = {
  placeholder?: string
  onChange: (value: string) => void
  className?: string
}

export function SearchInput({ placeholder = 'Rechercher...', onChange, className }: SearchInputProps) {
  const [value, setValue] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onChange(newValue)
  }

  return (
    <div className={cn('relative w-full max-w-sm', className)}>
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  )
}
