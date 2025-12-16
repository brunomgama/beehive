import { useState, useEffect, useMemo } from 'react'
import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear,
  format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isWithinInterval } from 'date-fns'
import { useAuth } from '@/contexts/auth-context'
import { Movement, movementApi } from '@/lib/api/bank/movements-api'
import { BankAccount, bankAccountApi } from '@/lib/api/bank/accounts-api'
import { useAnalyticsStats } from '@/hooks/analytics/use-analytics-stats'
import { useCategoryBreakdown } from '@/hooks/use-category-breakdown'

export type TimeFilter = 'day' | 'week' | 'month' | 'year'

export interface ChartDataPoint {
  label: string
  income: number
  expense: number
}

/**
 * Shared hook for analytics logic
 * Handles data fetching, filtering, and calculations
 */
export function useAnalytics() {
  const { user } = useAuth()
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month')
  const [movements, setMovements] = useState<Movement[]>([])
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)

  // Use cached hooks for stats and category data
  const { stats: cachedStats } = useAnalyticsStats(user?.id, timeFilter)
  const { categoryData: cachedCategoryData } = useCategoryBreakdown(user?.id, timeFilter)

  /**
   * Fetch all accounts and movements
   */
  useEffect(() => {
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
          setMovements(allMovements)
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  /**
   * Calculate date ranges based on filter
   */
  const dateRanges = useMemo(() => {
    const now = new Date()
    
    switch (timeFilter) {
      case 'day':
        return { start: startOfDay(now), end: endOfDay(now) }
      case 'week':
        return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) }
      case 'year':
        return { start: startOfYear(now), end: endOfYear(now) }
    }
  }, [timeFilter])

  /**
   * Use cached stats with fallback
   */
  const stats = cachedStats ?? {
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    incomeChange: 0,
    expenseChange: 0
  }

  /**
   * Use cached category data with fallback
   */
  const categoryData = cachedCategoryData ?? []

  /**
   * Generate chart data for visualization
   */
  const chartData = useMemo((): ChartDataPoint[] => {
    const currentMovements = movements.filter(m => {
      const date = new Date(m.date)
      return isWithinInterval(date, { start: dateRanges.start, end: dateRanges.end })
    })
    
    switch (timeFilter) {
      case 'day': {
        // 6-hour intervals
        const hours = ['00h', '06h', '12h', '18h', '24h']
        return hours.map((label, i) => {
          const hourStart = i * 6
          const hourEnd = (i + 1) * 6
          const hourMovements = currentMovements.filter(m => {
            const hour = new Date(m.date).getHours()
            return hour >= hourStart && hour < hourEnd
          })
          return {
            label,
            income: hourMovements.filter(m => m.type === 'INCOME').reduce((s, m) => s + m.amount, 0),
            expense: hourMovements.filter(m => m.type === 'EXPENSE').reduce((s, m) => s + Math.abs(m.amount), 0)
          }
        })
      }
      
      case 'week': {
        // Daily breakdown
        const days = eachDayOfInterval({ start: dateRanges.start, end: dateRanges.end })
        return days.map(day => {
          const dayMovements = currentMovements.filter(m => 
            format(new Date(m.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          )
          return {
            label: format(day, 'EEE'),
            income: dayMovements.filter(m => m.type === 'INCOME').reduce((s, m) => s + m.amount, 0),
            expense: dayMovements.filter(m => m.type === 'EXPENSE').reduce((s, m) => s + Math.abs(m.amount), 0)
          }
        })
      }
      
      case 'month': {
        // Weekly breakdown
        const weeks = eachWeekOfInterval({ start: dateRanges.start, end: dateRanges.end }, { weekStartsOn: 1 })
        return weeks.map((weekStart, i) => {
          const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
          const weekMovements = currentMovements.filter(m => {
            const date = new Date(m.date)
            return isWithinInterval(date, { start: weekStart, end: weekEnd })
          })
          return {
            label: `W${i + 1}`,
            income: weekMovements.filter(m => m.type === 'INCOME').reduce((s, m) => s + m.amount, 0),
            expense: weekMovements.filter(m => m.type === 'EXPENSE').reduce((s, m) => s + Math.abs(m.amount), 0)
          }
        })
      }
      
      case 'year': {
        // Monthly breakdown
        const months = eachMonthOfInterval({ start: dateRanges.start, end: dateRanges.end })
        return months.map(monthStart => {
          const monthEnd = endOfMonth(monthStart)
          const monthMovements = currentMovements.filter(m => {
            const date = new Date(m.date)
            return isWithinInterval(date, { start: monthStart, end: monthEnd })
          })
          return {
            label: format(monthStart, 'MMM'),
            income: monthMovements.filter(m => m.type === 'INCOME').reduce((s, m) => s + m.amount, 0),
            expense: monthMovements.filter(m => m.type === 'EXPENSE').reduce((s, m) => s + Math.abs(m.amount), 0)
          }
        })
      }
    }
  }, [movements, dateRanges, timeFilter])

  const maxValue = useMemo(() => 
    Math.max(...chartData.flatMap(d => [d.income, d.expense]), 1),
    [chartData]
  )

  return {
    timeFilter,
    setTimeFilter,
    stats,
    categoryData,
    chartData,
    maxValue,
    accounts,
    loading
  }
}