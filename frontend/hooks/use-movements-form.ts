import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { useAuth } from '@/contexts/auth-context'
import { BankAccount, bankAccountApi } from '@/lib/api/bank/accounts-api'
import { movementApi } from '@/lib/api/bank/movements-api'
import { MovementCategory, MovementStatus, MovementType } from '@/lib/api/types'

export interface MovementFormData {
  accountId: number
  description: string
  amount: number
  type: MovementType
  category: MovementCategory
  date: string
  status: MovementStatus
}

/**
 * Shared hook for movement form logic
 * Handles form state, validation, and submission
 */
export function useMovementForm(movementId?: number) {
  const router = useRouter()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  
  const [formData, setFormData] = useState<MovementFormData>({
    accountId: 0,
    description: '',
    amount: 0,
    type: 'EXPENSE',
    category: 'OTHER',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'CONFIRMED'
  })

  /**
   * Fetch accounts on mount
   */
  useEffect(() => {
    fetchAccounts()
  }, [user?.id])

  /**
   * Fetch existing movement if editing
   */
  useEffect(() => {
    if (movementId) {
      fetchMovement()
    }
  }, [movementId])

  /**
   * Fetch user accounts
   */
  const fetchAccounts = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const result = await bankAccountApi.getByUserId(user.id)
      
      if (result.data && result.data.length > 0) {
        setAccounts(result.data)
        
        // Set first account as default if not editing
        if (!movementId) {
          setFormData(prev => ({ ...prev, accountId: result.data![0].id! }))
        }
      } else {
        setError('No accounts found. Please create an account first.')
      }
    } catch (err) {
      console.error('Error fetching accounts:', err)
      setError('Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fetch movement for editing
   */
  const fetchMovement = async () => {
    if (!movementId) return
    
    try {
      setLoading(true)
      const result = await movementApi.getById(movementId)
      
      if (result.data) {
        setFormData({
          accountId: result.data.accountId,
          description: result.data.description,
          amount: Math.abs(result.data.amount),
          type: result.data.type,
          category: result.data.category,
          date: result.data.date,
          status: result.data.status
        })
      }
    } catch (err) {
      console.error('Error fetching movement:', err)
      setError('Failed to load movement')
      router.push('/movements')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update form field
   */
  const updateField = <K extends keyof MovementFormData>(
    field: K,
    value: MovementFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  /**
   * Validate form
   */
  const validateForm = (): string | null => {
    if (!formData.accountId) {
      return 'Please select an account'
    }
    if (!formData.description.trim()) {
      return 'Description is required'
    }
    if (formData.amount <= 0) {
      return 'Amount must be greater than 0'
    }
    return null
  }

  /**
   * Submit form (create or update)
   */
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return false
    }

    try {
      setSaving(true)
      setError(null)
      
      // Adjust amount based on type
      const amount = formData.type === 'EXPENSE' 
        ? -Math.abs(formData.amount) 
        : Math.abs(formData.amount)
      
      const movementData = {
        ...formData,
        amount
      }

      if (movementId) {
        // Update existing movement
        const result = await movementApi.update(movementId, movementData)
        if (result.error) {
          setError(result.error)
          return false
        }
      } else {
        // Create new movement
        const result = await movementApi.create(movementData)
        if (result.error) {
          setError(result.error)
          return false
        }
      }

      // Success - redirect
      router.push('/movements')
      return true
    } catch (err) {
      console.error('Error saving movement:', err)
      setError('Failed to save movement. Please try again.')
      return false
    } finally {
      setSaving(false)
    }
  }

  /**
   * Cancel and go back
   */
  const handleCancel = () => {
    router.push('/movements')
  }

  return {
    formData,
    updateField,
    accounts,
    loading,
    saving,
    error,
    handleSubmit,
    handleCancel,
  }
}