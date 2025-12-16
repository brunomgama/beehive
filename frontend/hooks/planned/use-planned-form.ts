import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, addMonths, addYears } from 'date-fns'
import { useAuth } from '@/contexts/auth-context'
import { BankAccount, bankAccountApi } from '@/lib/api/bank/accounts-api'
import { plannedMovementApi } from '@/lib/api/bank/planned-api'
import { MovementCategory, MovementStatus, MovementType, MovementRecurrence } from '@/lib/api/types'

export interface PlannedFormData {
  accountId: number
  description: string
  amount: number
  type: MovementType
  category: MovementCategory
  recurrence: MovementRecurrence
  nextExecution: string
  endDate: string
  status: MovementStatus
}

const getCronExpression = (recurrence: MovementRecurrence, date: Date): string => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const dayOfWeek = date.getDay()
  
  switch (recurrence) {
    case 'DAILY': return '0 0 * * *'
    case 'WEEKLY': return `0 0 * * ${dayOfWeek}`
    case 'MONTHLY': return `0 0 ${day} * *`
    case 'YEARLY': return `0 0 ${day} ${month} *`
    case 'CUSTOM': return '0 0 * * *'
    default: return '0 0 * * *'
  }
}

const getDefaultEndDate = (recurrence: MovementRecurrence, startDate: Date): Date => {
  switch (recurrence) {
    case 'DAILY': return addMonths(startDate, 1)
    case 'WEEKLY': return addMonths(startDate, 3)
    case 'MONTHLY': return addYears(startDate, 1)
    case 'YEARLY': return addYears(startDate, 5)
    case 'CUSTOM': return addMonths(startDate, 1)
    default: return addMonths(startDate, 1)
  }
}

export function usePlannedForm(plannedId?: number) {
  const router = useRouter()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  
  const today = new Date()
  const [formData, setFormData] = useState<PlannedFormData>({
    accountId: 0,
    description: '',
    amount: 0,
    type: 'EXPENSE',
    category: 'OTHER',
    recurrence: 'MONTHLY',
    nextExecution: format(today, 'yyyy-MM-dd'),
    endDate: format(addYears(today, 1), 'yyyy-MM-dd'),
    status: 'PENDING'
  })

  useEffect(() => { fetchAccounts() }, [user?.id])
  useEffect(() => { if (plannedId) fetchPlanned() }, [plannedId])

  const fetchAccounts = async () => {
    if (!user?.id) return
    try {
      setLoading(true)
      const result = await bankAccountApi.getByUserId(user.id)
      if (result.data && result.data.length > 0) {
        setAccounts(result.data)
        if (!plannedId) setFormData(prev => ({ ...prev, accountId: result.data![0].id! }))
      } else {
        setError('No accounts found')
      }
    } catch (err) {
      setError('Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }

  const fetchPlanned = async () => {
    if (!plannedId) return
    try {
      setLoading(true)
      const result = await plannedMovementApi.getById(plannedId)
      if (result.data) {
        setFormData({
          accountId: result.data.accountId,
          description: result.data.description,
          amount: Math.abs(result.data.amount),
          type: result.data.type,
          category: result.data.category,
          recurrence: result.data.recurrence,
          nextExecution: result.data.nextExecution,
          endDate: result.data.endDate,
          status: result.data.status
        })
      }
    } catch (err) {
      setError('Failed to load planned transaction')
      router.push('/planned')
    } finally {
      setLoading(false)
    }
  }

  const updateField = <K extends keyof PlannedFormData>(field: K, value: PlannedFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleRecurrenceChange = (recurrence: MovementRecurrence) => {
    const startDate = new Date(formData.nextExecution)
    const endDate = getDefaultEndDate(recurrence, startDate)
    setFormData(prev => ({
      ...prev,
      recurrence,
      endDate: format(endDate, 'yyyy-MM-dd')
    }))
  }

  const validateForm = (): string | null => {
    if (!formData.accountId) return 'Please select an account'
    if (!formData.description.trim()) return 'Description is required'
    if (formData.amount <= 0) return 'Amount must be greater than 0'
    return null
  }

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
      
      const cron = getCronExpression(formData.recurrence, new Date(formData.nextExecution))
      const amount = formData.type === 'EXPENSE' ? -Math.abs(formData.amount) : Math.abs(formData.amount)
      const plannedData = { ...formData, amount, cron }

      if (plannedId) {
        const result = await plannedMovementApi.update(plannedId, plannedData)
        if (result.error) {
          setError(result.error)
          return false
        }
      } else {
        const result = await plannedMovementApi.create(plannedData)
        if (result.error) {
          setError(result.error)
          return false
        }
      }
      router.push('/planned')
      return true
    } catch (err) {
      setError('Failed to save planned transaction')
      return false
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => { router.push('/planned') }

  return {
    formData,
    updateField,
    handleRecurrenceChange,
    accounts,
    loading,
    saving,
    error,
    isEditing: !!plannedId,
    handleSubmit,
    handleCancel,
  }
}