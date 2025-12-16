import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Movement, movementApi } from '@/lib/api/bank/movements-api'
import { BankAccount, bankAccountApi } from '@/lib/api/bank/accounts-api'

/**
 * Shared hook for movements list management
 * Handles data fetching, filtering, and statistics
 */
export function useMovements() {
  const { user } = useAuth()
  const [movements, setMovements] = useState<Movement[]>([])
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL')
  const [filterAccount, setFilterAccount] = useState<number | null>(null)

  /**
   * Fetch all movements and accounts
   */
  useEffect(() => {
    fetchData()
  }, [user?.id])

  const fetchData = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const accountsResult = await bankAccountApi.getByUserId(user.id)
      
      if (accountsResult.data) {
        setAccounts(accountsResult.data)
        
        // Fetch movements for all accounts
        const allMovements: Movement[] = []
        for (const account of accountsResult.data) {
          if (account.id) {
            const movementsResult = await movementApi.getByAccountId(account.id)
            if (movementsResult.data) {
              allMovements.push(...movementsResult.data)
            }
          }
        }
        
        // Sort by date (newest first)
        setMovements(allMovements.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Delete a movement
   */
  const handleDelete = async (movementId: number) => {
    try {
      await movementApi.delete(movementId)
      await fetchData() // Refresh data
      return true
    } catch (error) {
      console.error('Error deleting movement:', error)
      return false
    }
  }

  /**
   * Filtered movements based on search and filters
   */
  const filteredMovements = useMemo(() => {
    return movements.filter(movement => {
      const matchesSearch = movement.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesType = filterType === 'ALL' || movement.type === filterType
      const matchesAccount = !filterAccount || movement.accountId === filterAccount
      return matchesSearch && matchesType && matchesAccount
    })
  }, [movements, searchQuery, filterType, filterAccount])

  /**
   * Calculate statistics
   */
  const stats = useMemo(() => ({
    total: filteredMovements.length,
    income: filteredMovements
      .filter(m => m.type === 'INCOME')
      .reduce((sum, m) => sum + m.amount, 0),
    expenses: filteredMovements
      .filter(m => m.type === 'EXPENSE')
      .reduce((sum, m) => sum + Math.abs(m.amount), 0),
  }), [filteredMovements])

  return {
    movements: filteredMovements,
    accounts,
    loading,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterAccount,
    setFilterAccount,
    stats,
    handleDelete,
    refreshData: fetchData,
  }
}