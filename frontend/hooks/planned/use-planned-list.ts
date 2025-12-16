import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { PlannedMovement, plannedMovementApi } from '@/lib/api/bank/planned-api'
import { BankAccount, bankAccountApi } from '@/lib/api/bank/accounts-api'
import { MovementType, MovementRecurrence } from '@/lib/api/types'

export function usePlannedList() {
  const { user } = useAuth()
  const [plannedMovements, setPlannedMovements] = useState<PlannedMovement[]>([])
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'ALL' | MovementType>('ALL')
  const [filterRecurrence, setFilterRecurrence] = useState<'ALL' | MovementRecurrence>('ALL')
  const [filterAccount, setFilterAccount] = useState<number | null>(null)

  useEffect(() => { fetchData() }, [user?.id])

  const fetchData = async () => {
    if (!user?.id) return
    try {
      setLoading(true)
      const accountsResult = await bankAccountApi.getByUserId(user.id)
      if (accountsResult.data) {
        setAccounts(accountsResult.data)
        const allPlanned: PlannedMovement[] = []
        for (const account of accountsResult.data) {
          if (account.id) {
            const plannedResult = await plannedMovementApi.getByAccountId(account.id)
            if (plannedResult.data) allPlanned.push(...plannedResult.data)
          }
        }
        setPlannedMovements(allPlanned.sort((a, b) => 
          new Date(a.nextExecution).getTime() - new Date(b.nextExecution).getTime()
        ))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (plannedId: number) => {
    try {
      await plannedMovementApi.delete(plannedId)
      await fetchData()
      return true
    } catch (error) {
      console.error('Error deleting:', error)
      return false
    }
  }

  const filteredPlanned = useMemo(() => {
    return plannedMovements.filter(m => {
      const matchesSearch = m.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === 'ALL' || m.type === filterType
      const matchesRecurrence = filterRecurrence === 'ALL' || m.recurrence === filterRecurrence
      const matchesAccount = !filterAccount || m.accountId === filterAccount
      return matchesSearch && matchesType && matchesRecurrence && matchesAccount
    })
  }, [plannedMovements, searchQuery, filterType, filterRecurrence, filterAccount])

  const stats = useMemo(() => ({
    total: filteredPlanned.length,
    active: filteredPlanned.filter(m => m.status === 'PENDING' || m.status === 'CONFIRMED').length,
    monthlyIncome: filteredPlanned.filter(m => m.type === 'INCOME' && m.recurrence === 'MONTHLY').reduce((sum, m) => sum + m.amount, 0),
    monthlyExpenses: filteredPlanned.filter(m => m.type === 'EXPENSE' && m.recurrence === 'MONTHLY').reduce((sum, m) => sum + Math.abs(m.amount), 0),
  }), [filteredPlanned])

  return {
    plannedMovements: filteredPlanned,
    accounts,
    loading,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterRecurrence,
    setFilterRecurrence,
    filterAccount,
    setFilterAccount,
    stats,
    handleDelete,
    refreshData: fetchData,
  }
}