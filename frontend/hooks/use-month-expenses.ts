import { useState, useEffect } from 'react'
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { dataCache, CacheKeys } from '@/lib/util/cache'
import { bankAccountApi } from '@/lib/api/bank/accounts-api'
import { movementApi, Movement } from '@/lib/api/bank/movements-api'

/**
 * Hook to fetch and cache month expenses
 * Returns cached value instantly if available, otherwise fetches from API
 */
export function useMonthExpenses(userId: number | undefined) {
  const [monthExpenses, setMonthExpenses] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMonthExpenses = async () => {
      if (!userId) return

      try {
        setLoading(true)
        setError(null)

        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1

        const cached = dataCache.get<number>(CacheKeys.monthExpenses(userId, year, month))
        if (cached !== null) {
          setMonthExpenses(cached)
          setLoading(false)
          return
        }

        const accountsResult = await bankAccountApi.getByUserId(userId)
        if (accountsResult.data) {
          const allMovements: Movement[] = []

          for (const account of accountsResult.data) {
            if (account.id) {
              const movementsResult = await movementApi.getByAccountId(account.id)
              if (movementsResult.data) {
                allMovements.push(...movementsResult.data)
              }
            }
          }

          const monthStart = startOfMonth(now)
          const monthEnd = endOfMonth(now)

          const monthMovements = allMovements.filter(m => {
            const date = new Date(m.date)
            return isWithinInterval(date, { start: monthStart, end: monthEnd }) &&
              m.status === 'CONFIRMED' &&
              m.category !== 'TRANSFER'
          })

          const expenses = monthMovements.filter(m => m.type === 'EXPENSE').reduce((sum, m) => sum + Math.abs(m.amount), 0)

          dataCache.set(CacheKeys.monthExpenses(userId, year, month), expenses)
          setMonthExpenses(expenses)
        }
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching month expenses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMonthExpenses()
  }, [userId])

  return { monthExpenses, loading, error }
}
