'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Movement, BankAccount } from '@/lib/api/bank-api'

interface ViewMovementProps {
  movements: Movement[]
  accounts: BankAccount[]
}

type MovementGroup = {
  dateKey: string
  label: string
  total: number
  movements: Movement[]
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)

const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

const normalizeDate = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate())

const getDayLabel = (dateString: string) => {
  const d = normalizeDate(new Date(dateString))
  const today = normalizeDate(new Date())
  const diffDays =
    (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'

  // e.g. "Fri, 21 Nov"
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

const groupByDay = (movements: Movement[]): MovementGroup[] => {
  const map = new Map<string, MovementGroup>()

  for (const m of movements) {
    const d = new Date(m.date)
    const dateKey = d.toISOString().split('T')[0]

    if (!map.has(dateKey)) {
      map.set(dateKey, {
        dateKey,
        label: getDayLabel(m.date),
        total: 0,
        movements: [],
      })
    }

    const group = map.get(dateKey)!
    group.movements.push(m)

    // expenses count as negative for the total
    const signedAmount = m.type === 'EXPENSE' ? -m.amount : m.amount
    group.total += signedAmount
  }

  return Array.from(map.values()).sort((a, b) =>
    a.dateKey < b.dateKey ? 1 : -1
  )
}

export function ViewMovement({movements, accounts}: ViewMovementProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const term = search.toLowerCase()

    return movements.filter((m) => {
      const account = accounts.find((a) => a.id === m.accountId)
      const accountName = account?.accountName || ''

      return (
        m.description.toLowerCase().includes(term) ||
        m.category.toLowerCase().includes(term) ||
        m.status.toLowerCase().includes(term) ||
        m.type.toLowerCase().includes(term) ||
        accountName.toLowerCase().includes(term)
      )
    })
  }, [movements, accounts, search])

  const grouped = useMemo(() => groupByDay(filtered), [filtered])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header + search */}
      <header className="px-4 pt-4 pb-3">
        <h1 className="text-2xl font-bold text-color">Transactions</h1>

        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-normal-blue" />
            <Input
              placeholder="Search movements"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 h-10 rounded-full bg-card border-none shadow-sm text-sm"
            />
          </div>
          <p className="mt-1 text-[11px] text-normal-blue">
            {filtered.length} of {movements.length} movements
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-4 space-y-6 overflow-y-auto">
        {grouped.length === 0 ? (
          <p className="text-sm text-normal-blue mt-4">
            {search ? 'No movements match your search.' : 'No movements found.'}
          </p>
        ) : (
          grouped.map((group) => (
            <section key={group.dateKey}>
              {/* Day header + daily total */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-color">
                  {group.label}
                </h2>
                <span className={`text-sm font-semibold ${group.total >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(group.total)}
                </span>
              </div>

              {/* Movements for this day */}
              <div className="space-y-2">
                {group.movements.map((movement) => (
                  <button key={movement.id} type="button" onClick={() => router.push(`/bank/movements/${movement.id}`)} className="w-full text-left" >
                    <div className="flex items-center rounded-2xl bg-card shadow-sm px-4 py-3">
                      {/* Left icon / initial */}
                      <div className="w-10 h-10 rounded-2xl bg-background-darker-blue flex items-center justify-center mr-3">
                        <span className="text-sm font-semibold card-text">
                          {movement.description.trim().charAt(0).toUpperCase() || '•'}
                        </span>
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-color">
                          {movement.description}
                        </p>
                        <p className="text-xs text-normal-blue">
                          {formatTime(movement.date)}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className="ml-3 text-right">
                        <p
                          className={`text-sm font-semibold ${
                            movement.type === 'INCOME'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        >
                          {movement.type === 'EXPENSE' ? '-' : '+'}
                          {formatCurrency(movement.amount)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  )
}
