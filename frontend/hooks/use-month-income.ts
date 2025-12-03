import { useState, useEffect } from 'react'
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { dataCache, CacheKeys } from '@/lib/util/cache'
import { bankAccountApi } from '@/lib/api/bank/accounts-api'
import { movementApi, Movement } from '@/lib/api/bank/movements-api'

/**
 * Hook to fetch and cache month income
 * Returns cached value instantly if available, otherwise fetches from API
 */
export function useMonthIncome(userId: number | undefined) {
  const [monthIncome, setMonthIncome] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMonthIncome = async () => {
      if (!userId) return

      try {
        setLoading(true)
        setError(null)

        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1

        const cached = dataCache.get<number>(CacheKeys.monthIncome(userId, year, month))
        if (cached !== null) {
          setMonthIncome(cached)
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

          const income = monthMovements.filter(m => m.type === 'INCOME').reduce((sum, m) => sum + m.amount, 0)

          dataCache.set(CacheKeys.monthIncome(userId, year, month), income)
          setMonthIncome(income)
        }
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching month income:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMonthIncome()
  }, [userId])

  return { monthIncome, loading, error }
}
