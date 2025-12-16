import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { bankAccountApi } from '@/lib/api/bank/accounts-api'
import { AccountType } from '@/lib/api/types'

export interface AccountFormData {
  accountName: string
  iban: string
  balance: number
  type: AccountType
  priority: number
}

/**
 * Shared hook for edit account form logic
 * Keeps business logic separate from UI
 */
export function useEditAccountForm(accountId: number | null) {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<AccountFormData>({
    accountName: '',
    iban: '',
    balance: 0,
    type: 'CURRENT',
    priority: 0
  })

  const accountTypes: AccountType[] = ['CURRENT', 'SAVINGS', 'INVESTMENTS', 'CLOSED']

  /**
   * Fetch account data on mount
   */
  useEffect(() => {
    if (accountId) {
      fetchAccount()
    } else {
      setLoading(false)
    }
  }, [accountId])

  /**
   * Fetch account by ID
   */
  const fetchAccount = async () => {
    if (!accountId) return
    
    try {
      setLoading(true)
      const result = await bankAccountApi.getById(accountId)
      
      if (result.error) {
        setError('Failed to load account')
        router.push('/accounts')
        return
      }

      if (result.data) {
        setFormData({
          accountName: result.data.accountName,
          iban: result.data.iban,
          balance: Math.round(result.data.balance * 100) / 100,
          type: result.data.type,
          priority: result.data.priority
        })
      }
    } catch (err) {
      console.error('Error fetching account:', err)
      setError('Failed to load account')
      router.push('/accounts')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update a single form field
   */
  const updateField = <K extends keyof AccountFormData>(
    field: K,
    value: AccountFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null) // Clear error on edit
  }

  /**
   * Validate form data
   */
  const validateForm = (): string | null => {
    if (!formData.accountName.trim()) {
      return 'Account name is required'
    }
    if (!formData.iban.trim()) {
      return 'IBAN is required'
    }
    if (formData.iban.length < 15) {
      return 'Please enter a valid IBAN'
    }
    return null
  }

  /**
   * Submit form
   */
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!user?.id) {
      setError('User not authenticated')
      return false
    }

    if (!accountId) {
      setError('Account ID is missing')
      return false
    }

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return false
    }

    try {
      setSaving(true)
      setError(null)
      
      const result = await bankAccountApi.update(accountId, {
        ...formData,
        userId: user.id
      })

      if (result.error) {
        setError(result.error)
        return false
      }

      // Success - redirect to accounts page
      router.push('/accounts')
      return true
    } catch (err) {
      console.error('Error updating account:', err)
      setError('Failed to update account. Please try again.')
      return false
    } finally {
      setSaving(false)
    }
  }

  /**
   * Cancel and go back
   */
  const handleCancel = () => {
    router.push('/accounts')
  }

  return {
    formData,
    updateField,
    accountTypes,
    loading,
    saving,
    error,
    handleSubmit,
    handleCancel,
  }
}