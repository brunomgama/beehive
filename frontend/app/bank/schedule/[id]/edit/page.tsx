'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '../../../../../components/ui/button'
import { Input } from '../../../../../components/ui/input'
import { Label } from '../../../../../components/ui/label'
import { ArrowLeft } from 'lucide-react'
import { bankAccountApi, BankAccount, UpdatePlannedMovementData, plannedMovementApi } from '@/lib/api/bank-api'
import { LoadingPage } from '@/components/mobile/loading/loading-page'
import { DashboardLayout } from '@/components/desktop/sidebar/dashboard-layout'

export default function EditPlannedMovementPage() {
  const [formData, setFormData] = useState<UpdatePlannedMovementData>({
    accountId: 0,
    category: 'OTHER',
    type: 'EXPENSE',
    amount: 0,
    description: '',
    recurrence: 'MONTHLY',
    cron: '',
    nextExecution: '',
    endDate: '',
    status: 'PENDING'
  })
  const [balanceInput, setBalanceInput] = useState('')
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const id = parseInt(params.id as string)

  useEffect(() => {
    if (id) {
      fetchPlannedMovement()
      fetchAccounts()
    }
  }, [id])

  const fetchPlannedMovement = async () => {
    const result = await plannedMovementApi.getById(id)
    
    if (result.data) {
      const plannedMovement = result.data
      setBalanceInput(plannedMovement.amount.toString())
      setFormData({
        accountId: plannedMovement.accountId,
        category: plannedMovement.category,
        type: plannedMovement.type,
        amount: plannedMovement.amount,
        description: plannedMovement.description,
        recurrence: plannedMovement.recurrence,
        cron: plannedMovement.cron,
        nextExecution: plannedMovement.nextExecution,
        endDate: plannedMovement.endDate,
        status: plannedMovement.status
      })
      setError('')
    } else {
      setError(result.error || 'Failed to fetch planned movement')
    }
  }

  const fetchAccounts = async () => {
    const result = await bankAccountApi.getAll()
    
    if (result.data) {
      setAccounts(result.data)
    } else {
      setError('Failed to fetch accounts')
    }
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : 
              name === 'accountId' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.description || formData.accountId === 0 || formData.amount <= 0) {
      setError('Please fill in all required fields')
      setSubmitting(false)
      return
    }

    const result = await plannedMovementApi.update(id, formData)
    
    if (result.data) {
      router.push(`/bank/schedule/${id}`)
    } else {
      setError(result.error || 'Failed to update planned movement')
    }
    
    setSubmitting(false)
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

  const handleBalanceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ]
    
    const currentValue = balanceInput
    const isDigit = /^[0-9]$/.test(e.key)
    const isCommaOrPeriod = e.key === ',' || e.key === '.'
    const isAllowedKey = allowedKeys.includes(e.key)
    
    // Get cursor position
    const input = e.target as HTMLInputElement
    const cursorPosition = input.selectionStart || 0
    
    // Allow navigation keys
    if (isAllowedKey) {
      return
    }
    
    // Check for decimal separator rules
    if (isCommaOrPeriod) {
      // Don't allow if already has a decimal separator
      if (currentValue.includes('.') || currentValue.includes(',')) {
        e.preventDefault()
        return
      }
    }
    
    // Check for digits after decimal
    if (isDigit) {
      const hasDecimal = currentValue.includes('.') || currentValue.includes(',')
      if (hasDecimal) {
        const decimalIndex = Math.max(currentValue.indexOf('.'), currentValue.indexOf(','))
        
        // Only restrict if cursor is after the decimal point
        if (cursorPosition > decimalIndex) {
          const digitsAfterDecimal = currentValue.length - decimalIndex - 1
          
          // Don't allow more than 2 digits after decimal
          if (digitsAfterDecimal >= 2) {
            e.preventDefault()
            return
          }
        }
      }
    }
    
    // Block anything that's not a digit or decimal separator
    if (!isDigit && !isCommaOrPeriod) {
      e.preventDefault()
    }
  }

  const convertValue = (value: string) => {
    const cleanValue = value.replace(',', '.').replace(/[^0-9.]/g, '')
    
    const parts = cleanValue.split('.')
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('')
    }

    return cleanValue
  }


  if (loading) {
    return (<LoadingPage title="Processing Planned Movements" loadingText="Processing • Please wait • Processing • " />)
  }

  return (
    <DashboardLayout title="Edit Planned Movement">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
            <Button size="sm" onClick={() => router.push('/bank/schedule')} className="p-2">
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </div>

        {/* Form */}
        <div className="rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="accountId">Account *</Label>
                <select id="accountId" name="accountId" value={formData.accountId} onChange={handleChange} 
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm" required >
                  <option value={0}>Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountName} - {account.iban}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="type">Planned Movement Type *</Label>
                <select id="type" name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm">
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category">Category *</Label>
                <select id="category" name="category" value={formData.category} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm">
                  <option value="SHOPPING">Shopping</option>
                  <option value="NET">Net</option>
                  <option value="TECH">Tech</option>
                  <option value="FOOD">Food</option>
                  <option value="TRANSPORT">Transport</option>
                  <option value="ENTERTAINMENT">Entertainment</option>
                  <option value="HEALTH">Health</option>
                  <option value="UTILITIES">Utilities</option>
                  <option value="EDUCATION">Education</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm">
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Input id="description" name="description" value={formData.description} onChange={handleChange} 
              placeholder="Enter planned movement description" className="mt-1 shadow-sm" maxLength={255} required />
              <p className="text-sm text-gray-500 mt-1">
                Maximum 255 characters. Current length: {formData.description.length}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="balance">Amount *</Label>
                <div className="relative mt-1">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm mt-0.5">
                    € 
                  </span>
                  <Input id="balance" name="balance" type="text" value={balanceInput}
                    onChange={handleBalanceChange} onKeyDown={handleBalanceKeyDown} placeholder="0.00" className="shadow-sm pl-7 pr-12"/>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs mt-0.5">
                    EUR
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="recurrence">Recurrence *</Label>
                <select id="recurrence" name="recurrence" value={formData.recurrence} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm">
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex space-x-4 pt-4 justify-end">
                <Button type="submit" disabled={submitting} className="p-2">
                    {submitting ? 'Updating...' : 'Update Planned Movement'}
                </Button>
                <Button type="button" variant="destructive" onClick={() => router.push(`/bank/schedule/${id}`)}
                    className="p-2">
                    Cancel
                </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}