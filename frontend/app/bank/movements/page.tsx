'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { movementApi, bankAccountApi, Movement, BankAccount } from '@/lib/api/bank-api'
import { LoadingPage } from '@/components/mobile/loading/loading-page'
import { DashboardLayout } from '@/components/desktop/sidebar/dashboard-layout'
import { useIsMobile } from '@/hooks/use-mobile'
import { MovementsList as MovementsPageMobile } from '@/components/mobile/movements/movements'
import { MovementsList as MovementsPageDesktop } from '@/components/desktop/movements/movements'

export default function MovementsPage() {
  const isMobile = useIsMobile()

  const [movements, setMovements] = useState<Movement[]>([])
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [filteredMovements, setFilteredMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = movements.filter(movement => {
      const account = accounts.find(acc => acc.id === movement.accountId)
      const accountName = account?.accountName || ''
      
      return movement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accountName.toLowerCase().includes(searchTerm.toLowerCase())
    })
    setFilteredMovements(filtered)
  }, [movements, accounts, searchTerm])

  const fetchData = async () => {
    setLoading(true)
    const [movementsResult, accountsResult] = await Promise.all([
      movementApi.getAll(),
      bankAccountApi.getAll()
    ])
    
    if (movementsResult.data) {
      setMovements(movementsResult.data)
    } else {
      setError(movementsResult.error || 'Failed to fetch movements')
    }

    if (accountsResult.data) {
      setAccounts(accountsResult.data)
    }
    
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this movement?')) return
    
    const result = await movementApi.delete(id)
    if (result.status === 200) {
      setMovements(movements.filter(movement => movement.id !== id))
    } else {
      setError('Failed to delete movement')
    }
  }

  const getAccountName = (accountId: number) => {
    const account = accounts.find(acc => acc.id === accountId)
    return account?.accountName || 'Unknown Account'
  }

  if (loading) {
    return (<LoadingPage title="Movements listing..." loadingText="Processing • Please wait • Processing • " />)
  }

  return (
      (isMobile ? (
          <MovementsPageMobile movements={movements} accounts={accounts}
          onBack={() => router.push("/")} />
        ) : (
          <DashboardLayout title="Bank Movements">
            <MovementsPageDesktop
              movements={movements}
              filteredMovements={filteredMovements}
              accounts={accounts}
              searchTerm={searchTerm}
              error={error}
              onSearchChangeAction={(value) => setSearchTerm(value)}
              onAddAction={() => router.push('/bank/movements/new')}
              onViewAction={(id) => router.push(`/bank/movements/${id}`)}
              onEditAction={(id) => router.push(`/bank/movements/${id}/edit`)}
              onDeleteAction={handleDelete}
              getAccountNameAction={getAccountName}
            />
          </DashboardLayout>
        ))
    )
}