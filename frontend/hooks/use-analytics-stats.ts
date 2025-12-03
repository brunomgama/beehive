import { useState, useEffect } from 'react'
import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear,
  subDays, subWeeks, subMonths, subYears, isWithinInterval } from 'date-fns'
import { dataCache, CacheKeys } from '@/lib/util/cache'
import { bankAccountApi } from '@/lib/api/bank/accounts-api'
import { movementApi, Movement } from '@/lib/api/bank/movements-api'

export type TimeFilter = 'day' | 'week' | 'month' | 'year'

export interface AnalyticsStats {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  incomeChange: number
  expenseChange: number
}

/**
 * Hook to fetch and cache analytics stats for a specific time period
 * Returns cached value instantly if available, otherwise fetches from API
 */
export function useAnalyticsStats(userId: number | undefined, timeFilter: TimeFilter) {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchAnalyticsStats = async () => {
      if (!userId) return

      try {
        setLoading(true)
        setError(null)

        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1

        // Build cache key based on time filter
        const cacheKey = `analytics:stats:${userId}:${timeFilter}:${year}-${month}`

        // Check cache first
        const cached = dataCache.get<AnalyticsStats>(cacheKey)
        if (cached !== null) {
          setStats(cached)
          setLoading(false)
          return
        }

        let currentRange, previousRange
        switch (timeFilter) {
          case 'day':
            currentRange = { start: startOfDay(now), end: endOfDay(now) }
            previousRange = { start: startOfDay(subDays(now, 1)), end: endOfDay(subDays(now, 1)) }
            break
          case 'week':
            currentRange = { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
            previousRange = { start: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }), end: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }) }
            break
          case 'month':
            currentRange = { start: startOfMonth(now), end: endOfMonth(now) }
            previousRange = { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) }
            break
          case 'year':
            currentRange = { start: startOfYear(now), end: endOfYear(now) }
            previousRange = { start: startOfYear(subYears(now, 1)), end: endOfYear(subYears(now, 1)) }
            break
        }

        // Fetch movements
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

          // Filter movements by date ranges
          const filterByRange = (movs: Movement[], range: { start: Date, end: Date }) => {
            return movs.filter(m => {
              const date = new Date(m.date)
              return isWithinInterval(date, { start: range.start, end: range.end })
            })
          }

          const currentMovements = filterByRange(allMovements, currentRange)
          const previousMovements = filterByRange(allMovements, previousRange)

          // Calculate stats
          const currentIncome = currentMovements
            .filter(m => m.type === 'INCOME' && m.status === 'CONFIRMED' && m.category !== 'TRANSFER')
            .reduce((sum, m) => sum + m.amount, 0)

          const currentExpenses = currentMovements
            .filter(m => m.type === 'EXPENSE' && m.status === 'CONFIRMED' && m.category !== 'TRANSFER')
            .reduce((sum, m) => sum + Math.abs(m.amount), 0)

          const previousIncome = previousMovements
            .filter(m => m.type === 'INCOME' && m.status === 'CONFIRMED' && m.category !== 'TRANSFER')
            .reduce((sum, m) => sum + m.amount, 0)

          const previousExpenses = previousMovements
            .filter(m => m.type === 'EXPENSE' && m.status === 'CONFIRMED' && m.category !== 'TRANSFER')
            .reduce((sum, m) => sum + Math.abs(m.amount), 0)

          const incomeChange = previousIncome > 0
            ? ((currentIncome - previousIncome) / previousIncome) * 100
            : currentIncome > 0 ? 100 : 0

          const expenseChange = previousExpenses > 0
            ? ((currentExpenses - previousExpenses) / previousExpenses) * 100
            : currentExpenses > 0 ? 100 : 0

          const calculatedStats: AnalyticsStats = {
            totalIncome: currentIncome,
            totalExpenses: currentExpenses,
            netBalance: currentIncome - currentExpenses,
            incomeChange: Number(incomeChange.toFixed(1)),
            expenseChange: Number(expenseChange.toFixed(1))
          }

          // Cache for 1 hour (analytics change more frequently than landing data)
          dataCache.set(cacheKey, calculatedStats, 60 * 60 * 1000)
          setStats(calculatedStats)
        }
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching analytics stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsStats()
  }, [userId, timeFilter])

  return { stats, loading, error }
}
