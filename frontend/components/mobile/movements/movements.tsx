'use client'

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, CornerUpLeft, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Movement, BankAccount } from "@/lib/api/bank-api"
import { formatCurrency, formatDayLabel, getMovementCategoryColor, getMovementStatusColor, getMovementTypeColor} from "@/lib/bank/movement-colors"
import { MovementIcon } from "@/components/ui/movement-icon"

interface MovementsListProps {
  movements: Movement[]
  accounts: BankAccount[]
  onBack?: () => void
}

export function MovementsList({ movements, accounts, onBack }: MovementsListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const getAccountName = (accountId: number) =>
    accounts.find((a) => a.id === accountId)?.accountName || "Unknown account"

  const filteredMovements = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return movements

    return movements.filter((movement) => {
      const accountName = getAccountName(movement.accountId).toLowerCase()
      return (
        movement.description.toLowerCase().includes(term) ||
        movement.type.toLowerCase().includes(term) ||
        movement.category.toLowerCase().includes(term) ||
        movement.status.toLowerCase().includes(term) ||
        accountName.includes(term)
      )
    })
  }, [movements, searchTerm, accounts])

  const groupedByDay = useMemo(() => {
    const groups: {
      [dayKey: string]: {
        label: string
        movements: Movement[]
        total: number
      }
    } = {}

    filteredMovements.forEach((m) => {
      const d = new Date(m.date)
      const dayKey = d.toISOString().split("T")[0]
      const label = formatDayLabel(m.date)

      if (!groups[dayKey]) {
        groups[dayKey] = {
          label,
          movements: [],
          total: 0,
        }
      }

      const signedAmount = m.type === "INCOME" ? m.amount : -m.amount
      groups[dayKey].total += signedAmount
      groups[dayKey].movements.push(m)
    })

    return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1)).map(([, value]) => value)
  }, [filteredMovements])

  const handleRowClick = (id: number) => {
    router.push(`/bank/movements/${id}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background space-y-4">
      <header className="flex items-center justify-between px-4 pt-4 pb-3 mb-6">
        <Button variant={"outline"} onClick={onBack} className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
          <CornerUpLeft className="!h-5 !w-5 text-color"/>
        </Button>

        <h1 className="text-lg font-semibold text-color">
          Movements
        </h1>

        <Button variant={"default"} onClick={onBack} className="w-12 h-12 rounded-2xl bg-background-darker-blue shadow-sm flex items-center justify-center">
          <HelpCircle className="!h-6 !w-6 card-text-color" />
        </Button>
      </header>

      <div className="flex items-center px-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
          <Input placeholder="Search movements..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-9 pr-3 py-2 rounded-full bg-card border-none text-sm text-text-color shadow-sm"/>
        </div>
        <span className="ml-3 text-[11px] text-[#8A8A8A]">
          {filteredMovements.length}/{movements.length}
        </span>
      </div>

      {filteredMovements.length === 0 && (
        <div className="mt-6 text-center text-xs text-[#8A8A8A]">
          {searchTerm ? "No movements match your search." : "No movements found."}
        </div>
      )}

      <div className="space-y-4 px-4">
        {groupedByDay.map((group) => {
          const total = group.total
          const isPositive = total >= 0
          return (
            <div key={group.label} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-medium text-normal-blue">
                  {group.label}
                </span>
                <span className={`text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {isPositive ? "+" : "-"}
                  {formatCurrency(Math.abs(total))}
                </span>
              </div>

              <div className="space-y-2">
                {group.movements.map((movement) => (
                  <button key={movement.id} type="button" onClick={() => movement.id && handleRowClick(movement.id)} 
                  className="w-full rounded-2xl bg-card shadow-sm px-3 py-3 flex items-center justify-between active:scale-[0.99] transition">
                    <div className="flex items-center space-x-3">
                      <MovementIcon description={movement.description} category={movement.category} size="md"/>

                      <div className="flex flex-col items-start">
                        <p className="text-xs font-semibold text-color">
                          {movement.description.charAt(0).toUpperCase() + movement.description.slice(1)}
                        </p>
                        <p className="text-[10px] text-[#8A8A8A]">
                          {getAccountName(movement.accountId)}
                        </p>

                        <div className="mt-1 flex items-center space-x-1">
                          <span className={`inline-flex px-2 py-[2px] rounded-full text-[9px] font-medium ${getMovementTypeColor(movement.type)}`}>
                            {movement.type}
                          </span>
                          <span className={`inline-flex px-2 py-[2px] rounded-full text-[9px] font-medium ${getMovementStatusColor(movement.status)}`}>
                            {movement.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className={`text-sm font-semibold ${movement.type === "INCOME" ? "income-text" : "expense-text" }`}>
                        {movement.type === "EXPENSE" ? "-" : "+"}
                        {formatCurrency(movement.amount)}
                      </span>
                      <span className={`mt-1 inline-flex px-2 py-[2px] rounded-full text-[9px] font-medium ${getMovementCategoryColor(movement.category )}`}>
                        {movement.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}