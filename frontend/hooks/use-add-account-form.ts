import { useState } from 'react'
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
 * Shared hook for add account form logic
 * Keeps business logic separate from UI
 */
export function useAddAccountForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<AccountFormData>({ accountName: '', iban: '', balance: 0, type: 'CURRENT', priority: 0 })

  const accountTypes: AccountType[] = ['CURRENT', 'SAVINGS', 'INVESTMENTS', 'CLOSED']

  /**
   * Update a single form field
   */
  const updateField = <K extends keyof AccountFormData>(field: K, value: AccountFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
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

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return false
    }

    try {
      setSaving(true)
      setError(null)
      
      const result = await bankAccountApi.create({
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
      console.error('Error creating account:', err)
      setError('Failed to create account. Please try again.')
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
  return {formData, updateField, accountTypes, saving, error, handleSubmit, handleCancel}
}