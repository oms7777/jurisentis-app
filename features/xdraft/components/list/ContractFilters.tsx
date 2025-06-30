'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'



import { cn } from 'lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

type Props = {
  onFilterChange: (filters: {
    query: string
    dateRange: DateRange | undefined
  }) => void
}

export default function ContractFilters({ onFilterChange }: Props) {
  const [query, setQuery] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  useEffect(() => {
    const debounce = setTimeout(() => {
      onFilterChange({ query, dateRange })
    }, 400)

    return () => clearTimeout(debounce)
  }, [query, dateRange, onFilterChange])

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Input
        placeholder="Rechercher un contrat..."
        className="w-[250px]"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-[250px] justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'dd MMM yyyy', { locale: fr })} -{' '}
                  {format(dateRange.to, 'dd MMM yyyy', { locale: fr })}
                </>
              ) : (
                format(dateRange.from, 'dd MMM yyyy', { locale: fr })
              )
            ) : (
              <span>Filtrer par date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={new Date()}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
