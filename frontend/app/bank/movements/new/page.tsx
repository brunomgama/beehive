'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { movementApi, bankAccountApi, CreateMovementData, BankAccount } from '@/lib/api/bank-api'
import { LoadingPage } from '@/components/mobile/loading/loading-page'
import { DashboardLayout } from '@/components/desktop/sidebar/dashboard-layout'
import { useIsMobile } from '@/hooks/use-mobile'
import { NewMovement as NewMovementDesktop } from '@/components/desktop/movements/new_movement'
import { NewMovement as NewMovementMobile } from '@/components/mobile/movements/new_movement'

export default function NewMovementPage() {

  const isMobile = useIsMobile()

  const [formData, setFormData] = useState<CreateMovementData>({
    accountId: 0,
    category: 'OTHER',
    type: 'EXPENSE',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'PENDING'
  })
  const [balanceInput, setBalanceInput] = useState('')
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    setLoadingAccounts(true)
    const result = await bankAccountApi.getAll()
    
    if (result.data) {
      setAccounts(result.data)
      if (result.data.length > 0) {
        setFormData(prev => ({ ...prev, accountId: result.data?.[0]?.id || 0 }))
      }
    } else {
      setError('Failed to fetch accounts')
    }
    setLoadingAccounts(false)
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
    setLoading(true)
    setError('')

    if (!formData.description || formData.accountId === 0 || formData.amount <= 0) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    const result = await movementApi.create(formData)
    
    if (result.data) {
      router.push('/bank/movements')
    } else {
      setError(result.error || 'Failed to create movement')
    }
    
    setLoading(false)
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

  const handleKeypadPress = (val: string) => {
    if (val === "backspace") {
      setBalanceInput((prev) => prev.slice(0, -1))
      return
    }
    setBalanceInput((prev) => (prev === "0" ? val : prev + val))
  }

  if (loadingAccounts) {
    return (<LoadingPage title="Loading Accounts..." loadingText="Processing • Please wait • Processing • " />)
  }

  return (isMobile ? (
    <NewMovementMobile
      accounts={accounts}
      loading={loading}
      error={error}
      balanceInput={balanceInput}
      formData={formData}
      onChange={handleChange}
      onBalanceChange={handleBalanceChange}
      onBalanceKeyDown={handleBalanceKeyDown}
      onSubmit={handleSubmit}
      onKeypadPress={handleKeypadPress}
      onBack={() => router.push("/")}
    />
  ) : (
    <DashboardLayout title="Create New Movement">
      <NewMovementDesktop
        accounts={accounts}
        loading={loading}
        error={error}
        balanceInput={balanceInput}
        formData={formData}
        onBalanceChange={handleBalanceChange}
        onBalanceKeyDown={handleBalanceKeyDown}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </DashboardLayout>
  ))
}