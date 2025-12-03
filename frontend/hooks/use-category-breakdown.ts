import { useState, useEffect } from 'react'
import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear,
  isWithinInterval } from 'date-fns'
import { dataCache, CacheKeys } from '@/lib/util/cache'
import { bankAccountApi } from '@/lib/api/bank/accounts-api'
import { movementApi, Movement, MovementCategory } from '@/lib/api/bank/movements-api'

export interface CategoryData {
  name: string
  amount: number
  percentage: number
  category: MovementCategory
}

type TimeFilter = 'day' | 'week' | 'month' | 'year'

/**
 * Hook to fetch and cache category breakdown for expenses
 * Returns cached value instantly if available, otherwise fetches from API
 */
export function useCategoryBreakdown(userId: number | undefined, timeFilter: TimeFilter) {
  const [categoryData, setCategoryData] = useState<CategoryData[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCategoryBreakdown = async () => {
      if (!userId) return

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
        let currentRange
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

          // Filter by date range and get expenses
          const currentMovements = allMovements.filter(m => {
            const date = new Date(m.date)
            return isWithinInterval(date, { start: currentRange.start, end: currentRange.end })
          })

          const expenses = currentMovements.filter(m => m.type === 'EXPENSE' && m.status === 'CONFIRMED')

          // Group by category
          const categoryTotals = expenses.reduce((acc, m) => {
            acc[m.category] = (acc[m.category] || 0) + Math.abs(m.amount)
            return acc
          }, {} as Record<MovementCategory, number>)

          const totalExpenses = Object.values(categoryTotals).reduce((s, v) => s + v, 0)

          // Import category labels dynamically to avoid circular dependency
          const { CATEGORY_LABELS } = await import('@/lib/util/category-constants')

          const breakdown = Object.entries(categoryTotals)
            .map(([category, amount]) => ({
              name: CATEGORY_LABELS[category as MovementCategory],
              amount,
              percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
              category: category as MovementCategory
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 6)

          // Cache for 1 hour
          dataCache.set(cacheKey, breakdown, 60 * 60 * 1000)
          setCategoryData(breakdown)
        }
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching category breakdown:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryBreakdown()
  }, [userId, timeFilter])

  return { categoryData, loading, error }
}
