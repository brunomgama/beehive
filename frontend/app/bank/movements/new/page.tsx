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
  
    const payload: CreateMovementData = {
      ...formData,
      status: isMobile ? 'CONFIRMED' : formData.status,
    }
  
    if (!payload.description || payload.accountId === 0 || payload.amount <= 0) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }
    const result = await movementApi.create(payload)
    if (result.data) {
      isMobile ? router.push('/') : router.push('/bank/movements')
    } else {
      setError(result.error || 'Failed to create movement')
    }
    setLoading(false)
  }

  if (loadingAccounts) {
    return (<LoadingPage title="Loading Accounts..." loadingText="Processing • Please wait • Processing • " />)
  }

  return (isMobile ? (
    <NewMovementMobile
      accounts={accounts}
      loading={loading}
      error={error}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onBack={() => router.push("/")}
    />
  ) : (
    <DashboardLayout title="Create New Movement">
      <NewMovementDesktop
        accounts={accounts}
        loading={loading}
        error={error}
        formData={formData}
        setFormData={setFormData}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </DashboardLayout>
  ))
}