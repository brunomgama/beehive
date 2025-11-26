'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { movementApi, bankAccountApi, UpdateMovementData, BankAccount } from '@/lib/api/bank-api'
import { LoadingPage } from '@/components/mobile/loading/loading-page'
import { DashboardLayout } from '@/components/desktop/sidebar/dashboard-layout'
import { useIsMobile } from '@/hooks/use-mobile'
import { EditMovement as EditMovementDesktop } from '@/components/desktop/movements/edit_movement'
import { EditMovement as EditMovementMobile } from '@/components/mobile/movements/edit_movement'

export default function EditMovementPage() {
  const isMobile = useIsMobile()

  const [formData, setFormData] = useState<UpdateMovementData>({
    accountId: 0,
    category: 'OTHER',
    type: 'EXPENSE',
    amount: 0,
    description: '',
    date: '',
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
      fetchMovement()
      fetchAccounts()
    }
  }, [id])

  const fetchMovement = async () => {
    const result = await movementApi.getById(id)
    
    if (result.data) {
      const movement = result.data
      setBalanceInput(movement.amount.toString())
      setFormData({
        accountId: movement.accountId,
        category: movement.category,
        type: movement.type,
        amount: movement.amount,
        description: movement.description,
        date: movement.date,
        status: movement.status
      })
      setError('')
    } else {
      setError(result.error || 'Failed to fetch movement')
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

    const result = await movementApi.update(id, formData)
    
    if (result.data) {
      router.push(`/bank/movements/${id}`)
    } else {
      setError(result.error || 'Failed to update movement')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (<LoadingPage title="Processing Movement" loadingText="Processing • Please wait • Processing • " />)
  }

  return (
    isMobile ? (
      <EditMovementMobile
        accounts={accounts}
        loading={submitting}
        error={error || null}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onBack={() => router.push(`/bank/movements/${id}`)}
      />
    ) : (
      <DashboardLayout title="Edit Movement">
        <EditMovementDesktop
          formData={formData}
          handleChange={handleChange}
          accounts={accounts}
          balanceInput={balanceInput}
          handleSubmit={handleSubmit}
          submitting={submitting}
          onBack={() => router.push('/bank/movements')}
          onCancel={() => router.push(`/bank/movements/${id}`)}
          error={error}
        />
      </DashboardLayout>
    )
  )
}
