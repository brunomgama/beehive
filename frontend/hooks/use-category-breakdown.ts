import { useState, useEffect } from 'react'
import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear, isWithinInterval } from 'date-fns'
import { dataCache } from '@/lib/util/cache'
import { useAllMovements } from './use-all-movements'
import { CATEGORY_LABELS } from '@/lib/util/categories'
import { MovementCategory } from '@/lib/api/types'

export interface CategoryData {
  name: string
  amount: number
  percentage: number
  category: MovementCategory
}

export type TimeFilter = 'day' | 'week' | 'month' | 'year'

/**
 * Hook to calculate category breakdown for expenses
 * Uses shared movements data to avoid duplicate API calls
 */
export function useCategoryBreakdown(userId: number | undefined, timeFilter: TimeFilter) {
  const { movements, loading: movementsLoading, error: movementsError } = useAllMovements(userId)
  const [categoryData, setCategoryData] = useState<CategoryData[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId || !movements) {
      setCategoryData(null)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1

      // Build cache key
      const cacheKey = `analytics:categories:${userId}:${timeFilter}:${year}-${month}`

      // Check cache first
      const cached = dataCache.get<CategoryData[]>(cacheKey)
      if (cached !== null) {
        setCategoryData(cached)
        setLoading(false)
        return
      }

      // Calculate current date range
      let currentRange: { start: Date; end: Date }
      
      switch (timeFilter) {
        case 'day':
          currentRange = { start: startOfDay(now), end: endOfDay(now) }
          break
        case 'week':
          currentRange = { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
          break
        case 'month':
          currentRange = { start: startOfMonth(now), end: endOfMonth(now) }
          break
        case 'year':
          currentRange = { start: startOfYear(now), end: endOfYear(now) }
          break
      }

      // Filter by date range and get expenses
      const currentMovements = movements.filter(m => {
        const date = new Date(m.date)
        return isWithinInterval(date, { start: currentRange.start, end: currentRange.end })
      })

      const expenses = currentMovements.filter(
        m => m.type === 'EXPENSE' && m.status === 'CONFIRMED' && m.category !== 'TRANSFER'
      )

      // Group by category
      const categoryTotals = expenses.reduce((acc, m) => {
        acc[m.category] = (acc[m.category] || 0) + Math.abs(m.amount)
        return acc
      }, {} as Record<MovementCategory, number>)

      const totalExpenses = Object.values(categoryTotals).reduce((s, v) => s + v, 0)

      // Create breakdown with category labels
      const breakdown = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
          name: CATEGORY_LABELS[category as MovementCategory] || category,
          amount,
          percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
          category: category as MovementCategory
        }))
        .sort((a, b) => b.amount - a.amount).slice(0, 6)

      dataCache.set(cacheKey, breakdown, 60 * 60 * 1000)
      setCategoryData(breakdown)
    } catch (err) {
      setError(err as Error)
      console.error('Error calculating category breakdown:', err)
    } finally {
      setLoading(false)
    }
  }, [userId, timeFilter, movements])

  return { 
    categoryData, 
    loading: loading || movementsLoading, 
    error: error || movementsError 
  }
}