import { useState, useEffect } from 'react'
import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear, subDays, subWeeks, subMonths, subYears, isWithinInterval } from 'date-fns'
import { dataCache } from '@/lib/util/cache'
import { useAllMovements } from '../use-all-movements'
import { Movement } from '@/lib/api/bank/movements-api'
import { TimeFilter } from './use-analytics'

export interface AnalyticsStats {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  incomeChange: number
  expenseChange: number
}

/**
 * Hook to calculate analytics stats for a specific time period
 * Uses shared movements data to avoid duplicate API calls
 */
export function useAnalyticsStats(userId: number | undefined, timeFilter: TimeFilter) {
  const { movements, loading: movementsLoading, error: movementsError } = useAllMovements(userId)
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId || !movements) {
      setStats(null)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1

      // Build cache key
      const cacheKey = `analytics:stats:${userId}:${timeFilter}:${year}-${month}`

      // Check cache first
      const cached = dataCache.get<AnalyticsStats>(cacheKey)
      if (cached !== null) {
        setStats(cached)
        setLoading(false)
        return
      }

      // Calculate date ranges
      let currentRange: { start: Date; end: Date }
      let previousRange: { start: Date; end: Date }

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

      // Filter movements by date range
      const filterByRange = (movs: Movement[], range: { start: Date; end: Date }) => {
        return movs.filter(m => {
          const date = new Date(m.date)
          return isWithinInterval(date, { start: range.start, end: range.end })
        })
      }

      const currentMovements = filterByRange(movements, currentRange)
      const previousMovements = filterByRange(movements, previousRange)

      // Calculate stats for current period
      const currentIncome = currentMovements
        .filter(m => m.type === 'INCOME' && m.status === 'CONFIRMED' && m.category !== 'TRANSFER')
        .reduce((sum, m) => sum + m.amount, 0)

      const currentExpenses = currentMovements
        .filter(m => m.type === 'EXPENSE' && m.status === 'CONFIRMED' && m.category !== 'TRANSFER')
        .reduce((sum, m) => sum + Math.abs(m.amount), 0)

      // Calculate stats for previous period
      const previousIncome = previousMovements
        .filter(m => m.type === 'INCOME' && m.status === 'CONFIRMED' && m.category !== 'TRANSFER')
        .reduce((sum, m) => sum + m.amount, 0)

      const previousExpenses = previousMovements
        .filter(m => m.type === 'EXPENSE' && m.status === 'CONFIRMED' && m.category !== 'TRANSFER')
        .reduce((sum, m) => sum + Math.abs(m.amount), 0)

      // Calculate percentage changes
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
    } catch (err) {
      setError(err as Error)
      console.error('Error calculating analytics stats:', err)
    } finally {
      setLoading(false)
    }
  }, [userId, timeFilter, movements])

  return { 
    stats, 
    loading: loading || movementsLoading, 
    error: error || movementsError 
  }
}