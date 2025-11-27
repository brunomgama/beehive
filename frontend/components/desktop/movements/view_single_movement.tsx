'use client'

import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Movement, BankAccount } from "@/lib/api/bank-api"
import { getMovementCategoryColor, getMovementStatusColor, getMovementTypeColor } from "@/lib/bank/movement-colors"
import { formatCurrency, formatFullDate } from "@/lib/utils"

interface ViewMovementProps {
  movement: Movement
  account?: BankAccount | null
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ViewMovement({movement, account, onBack, onEdit, onDelete}: ViewMovementProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Movement Information */}
      <div className="rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Movement Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Movement ID
              </label>
              <p className="text-lg">#{movement.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <p className="text-lg">{formatFullDate(movement.date)}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <p className="text-lg p-3 rounded border">
                {movement.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Account</label>
              <p className="text-lg">
                {account ? account.accountName : `Account ID: ${movement.accountId}`}
                {account && (
                  <>
                    <br />
                    <span className="text-sm font-mono">{account.iban}</span>
                  </>
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <p className={`text-3xl font-bold ${movement.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                {movement.type === "EXPENSE" ? "-" : "+"}
                {formatCurrency(movement.amount)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getMovementTypeColor(movement.type)}`}>
                {movement.type}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category
              </label>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getMovementCategoryColor(movement.category)}`}>
                {movement.category}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getMovementStatusColor(movement.status)}`}>
                {movement.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
