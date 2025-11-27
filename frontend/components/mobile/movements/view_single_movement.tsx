'use client'

import { CornerUpLeft, HelpCircle, Edit3, Trash2} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Movement, BankAccount } from '@/lib/api/bank-api'
import { getMovementCategoryColor, getMovementStatusColor, getMovementTypeColor} from '@/lib/bank/movement-colors'
import { formatCurrency, formatDayLabel } from '@/lib/utils'

interface ViewMovementProps {
  movement: Movement
  account?: BankAccount | null
  onBack?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function ViewMovement({movement, account, onBack, onEdit, onDelete}: ViewMovementProps) {
  const isIncome = movement.type === 'INCOME'

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between px-4 pt-4 pb-3 mb-4">
        <Button variant="outline" onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
          <CornerUpLeft className="!h-5 !w-5 text-color" />
        </Button>

        <h1 className="text-base font-semibold text-color">
          Movement
        </h1>

        <Button variant="default" className="w-12 h-12 rounded-2xl bg-background-darker-blue shadow-sm flex items-center justify-center">
          <HelpCircle className="!h-6 !w-6 card-text-color" />
        </Button>
      </header>

      <main className="flex-1 px-4 pb-6 space-y-4">
        <section className="rounded-3xl bg-card shadow-sm px-4 py-4">
          <div className="flex items-center justify-between text-xs text-normal-blue">
            <span>{account ? account.accountName : 'Account'}</span>
            {account?.iban && (
              <span className="font-mono text-[10px]">
                {account.iban}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className={`text-3xl font-bold font-sf-display ${isIncome ? 'income-text' : 'expense-text'}`}>
                {isIncome ? '+' : '-'}
                {formatCurrency(movement.amount)}
              </p>
              <p className="mt-1 text-xs text-normal-blue">
                {formatDayLabel(movement.date)}
              </p>
            </div>

            <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-medium ${getMovementTypeColor(movement.type)}`}>
              {movement.type}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-medium ${getMovementCategoryColor(movement.category)}`}>
              {movement.category}
            </span>

            <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-medium ${getMovementStatusColor(movement.status)}`}>
              {movement.status}
            </span>
          </div>
        </section>

        <section className="rounded-2xl bg-card shadow-sm px-4 py-3">
          <p className="text-[11px] text-normal-blue mb-1">
            Description
          </p>
          <p className="text-sm font-semibold text-color break-words">
            {movement.description || 'No description'}
          </p>
        </section>

        <section className="rounded-2xl bg-card shadow-sm px-4 py-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-normal-blue">Movement ID</span>
            <span className="font-medium text-color">
              #{movement.id}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-normal-blue">Account ID</span>
            <span className="font-medium text-color">{account ? account.accountName : 'Account'}</span>
              {/* {movement.accountId} */}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-normal-blue">Status</span>
            <span className="font-medium text-color">
              {movement.status}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-normal-blue">Category</span>
            <span className="font-medium text-color">
              {movement.category}
            </span>
          </div>
        </section>
      </main>

      {/* Sticky actions */}
      <footer className="sticky bottom-0 left-0 right-0 px-4 pb-5 pt-2 bg-background">
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1 h-11 rounded-full text-xs font-semibold flex items-center justify-center"
            onClick={onDelete} >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button type="button"
            className="flex-1 h-11 rounded-full text-xs font-semibold flex items-center justify-center bg-background-darker-blue card-text-color shadow-md"
            onClick={onEdit}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </footer>
    </div>
  )
}
