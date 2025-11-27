// Example: Refactored new_movement.tsx (Desktop)
'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { LoadingPage } from "@/components/mobile/loading/loading-page"
import { BankAccount, CreateMovementData, MovementStatus, MovementType } from "@/lib/api/bank-api"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { 
  MovementTypeSelect,
  MovementStatusSelect,
  MovementCategorySelect 
} from "@/components/ui/movement-selects"

interface NewMovementDesktopProps {
  accounts: BankAccount[];
  loading: boolean;
  error: string | null;
  formData: {
    accountId: number;
    type: MovementType;
    category: string;
    status: MovementStatus;
    description: string;
    date: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<CreateMovementData>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function NewMovementDesktop({
  accounts, 
  loading, 
  error, 
  formData, 
  setFormData, 
  onChange, 
  onSubmit,
}: NewMovementDesktopProps) {
  const router = useRouter()
  const [balanceInput, setBalanceInput] = useState('')

  const convertValue = (value: string) => {
    const cleanValue = value.replace(',', '.').replace(/[^0-9.]/g, '')
    const parts = cleanValue.split('.')
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('')
    }
    return cleanValue
  }

  const handleBalanceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ]
    
    const currentValue = balanceInput
    const isDigit = /^[0-9]$/.test(e.key)
    const isCommaOrPeriod = e.key === ',' || e.key === '.'
    const isAllowedKey = allowedKeys.includes(e.key)
    
    const input = e.target as HTMLInputElement
    const cursorPosition = input.selectionStart || 0
    
    if (isAllowedKey) return
    
    if (isCommaOrPeriod) {
      if (currentValue.includes('.') || currentValue.includes(',')) {
        e.preventDefault()
        return
      }
    }
    
    if (isDigit) {
      const hasDecimal = currentValue.includes('.') || currentValue.includes(',')
      if (hasDecimal) {
        const decimalIndex = Math.max(currentValue.indexOf('.'), currentValue.indexOf(','))
        if (cursorPosition > decimalIndex) {
          const digitsAfterDecimal = currentValue.length - decimalIndex - 1
          if (digitsAfterDecimal >= 2) {
            e.preventDefault()
            return
          }
        }
      }
    }
    
    if (!isDigit && !isCommaOrPeriod) {
      e.preventDefault()
    }
  }

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setBalanceInput(value)
    
    const convertedValue = convertValue(value)
    setFormData(prev => ({
      ...prev,
      amount: parseFloat(convertedValue) || 0
    }))
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button size="sm" onClick={() => router.push("/bank/movements")} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Form */}
      <div className="rounded-lg shadow-sm border p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Row 1: account + type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="accountId">Account *</Label>
              <select id="accountId" name="accountId" value={formData.accountId} 
              onChange={onChange}className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm" required >
                <option value={0}>Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountName} - {account.iban}
                  </option>
                ))}
              </select>
            </div>

            <MovementTypeSelect id="type" name="type" label="Movement Type" value={formData.type} onChange={onChange} required/>
          </div>

          {/* Row 2: category + status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MovementCategorySelect id="category" name="category" label="Category" value={formData.category} onChange={onChange} required/>

            <MovementStatusSelect id="status" name="status" label="Status" value={formData.status} onChange={onChange} required/>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Input id="description" name="description" value={formData.description} onChange={onChange} 
              placeholder="Enter movement description" className="mt-1 shadow-sm" maxLength={255} required/>
            <p className="text-sm text-gray-500 mt-1">
              Maximum 255 characters. Current length: {formData.description.length}
            </p>
          </div>

          {/* Row 3: amount + date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="balance">Amount *</Label>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm mt-0.5">
                  €
                </span>
                <Input id="balance" name="balance" type="text" value={balanceInput} onChange={handleBalanceChange} 
                onKeyDown={handleBalanceKeyDown} placeholder="0.00" className="shadow-sm pl-7 pr-12"/>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs mt-0.5">
                  EUR
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="date">Date *</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={onChange} className="mt-1 shadow-sm" required/>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4 pt-4 justify-end">
            <Button disabled={loading} className="p-2">
              {loading ? (
                <LoadingPage title="Creating Movement..." loadingText="Processing • Please wait • Processing • "/>
              ) : (
                "Create Movement"
              )}
            </Button>

            <Button type="button" variant="destructive" onClick={() => router.push("/bank/movements")} className="p-2">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}