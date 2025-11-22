'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { ArrowLeft } from 'lucide-react'
import { bankAccountApi, CreateAccountData } from '@/lib/api/bank-api'
import { UserProfile, userProfileApi } from '@/lib/api/user-api'
import { DashboardLayout } from '@/components/desktop/sidebar/dashboard-layout'
import { LoadingPage } from '@/components/mobile/loading/loading-page'

export default function NewAccountPage() {
  const [formData, setFormData] = useState<CreateAccountData>({
    userId: 0,
    accountName: '',
    iban: '',
    balance: 0,
    type: 'CURRENT',
    priority: 1
  })
  const [allUsers, setAllUsers] = useState<UserProfile[]>([])
  
  const [balanceInput, setBalanceInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchAllUsers()
  }, [])

  const fetchAllUsers = async () => {
    const result = await userProfileApi.getAll()
    if (result.data) {
      setAllUsers(result.data)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : name === 'userId' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.accountName || !formData.iban || !formData.userId) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (formData.iban.length !== 25) {
      setError('IBAN must be exactly 25 characters')
      setLoading(false)
      return
    }

    const result = await bankAccountApi.create(formData)
    
    if (result.data) {
      router.push('/bank/accounts')
    } else {
      setError(result.error || 'Failed to create account')
    }
    
    setLoading(false)
  }

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setBalanceInput(value)
    
    const convertedValue = convertValue(value)
    setFormData(prev => ({
      ...prev,
      balance: parseFloat(convertedValue) || 0
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

  return (
    <DashboardLayout title="Create New Account">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
            <Button onClick={() => router.push('/bank/accounts')} className="p-2">
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </div>

        {/* Form */}
        <div className="rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="accountName">Account Name *</Label>
                <Input id="accountName"
                  name="accountName" value={formData.accountName} onChange={handleChange}
                  placeholder="Enter account name" className="mt-1" required/>
              </div>

              <div>
                <Label htmlFor="type">Account Type</Label>
                <select id="type" name="type" value={formData.type} onChange={handleChange} 
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm">
                  <option value="CURRENT">Current</option>
                  <option value="SAVINGS">Savings</option>
                  <option value="INVESTMENTS">Investments</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="iban">IBAN *</Label>
              <Input id="iban" name="iban" value={formData.iban} onChange={handleChange}
                placeholder="Enter 25-character IBAN"
                className="mt-1 font-mono" maxLength={25} required/>
              <p className="text-sm text-gray-500 mt-1">
                Must be exactly 25 characters. Current length: {formData.iban.length}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="balance">Initial Balance</Label>
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
                <Label htmlFor="userId">Account Owner *</Label>
                <select id="userId" name="userId" value={formData.userId} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm bg-white" required>
                  <option value="">Select a user...</option>
                  {allUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="accountPriority">Account Priority</Label>
                <Input id="accountPriority" name="accountPriority" value={formData.priority}
                  onChange={handleChange} placeholder="Choose a priority"
                  className="mt-1 shadow-sm" required />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex space-x-4 pt-4 justify-end">
              <Button type="submit" disabled={loading} 
                className="p-2">
                {loading ? <LoadingPage title="Creating Account..." loadingText="Processing • Please wait • Processing • " /> : 'Create Account'}
              </Button>
              <Button type="button" variant="destructive" onClick={() => router.push('/bank/accounts')}
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