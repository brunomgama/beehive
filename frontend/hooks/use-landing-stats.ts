import { useState, useEffect } from 'react'
import { dataCache, CacheKeys } from '@/lib/util/cache'
import { apiService } from '@/lib/api/api-service'
import { API_ENDPOINTS } from '@/lib/api-config'

export interface BalanceTrendPoint {
  date: string
  fullDate: string
  actual: number | null
  projected: number | null
  isToday: boolean
  isFuture: boolean
}

export interface UpcomingPayment {
  id: number
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  date: string
  category: string
}

export interface LandingStats {
  balance: number
  income: number
  expenses: number
  expectedImpact: number
  accountCount: number
  balanceTrend: BalanceTrendPoint[]
  upcomingPayments: UpcomingPayment[]
}

/**
 * Hook to fetch all landing page data from a single API endpoint
 * Returns cached value instantly if available, otherwise fetches from API
 */
export function useLandingStats(userId: number | undefined) {
  const [stats, setStats] = useState<LandingStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchLandingStats = async () => {
      if (!userId) return

      try {
        setLoading(true)
        setError(null)

        const cached = dataCache.get<LandingStats>(CacheKeys.landingStats(userId))
        if (cached !== null) {
          setStats(cached)
          setLoading(false)
          return
        }

        const response = await apiService.get<LandingStats>(
          `${API_ENDPOINTS.bank.accounts}/landing/${userId}`
        )
        
        if (response.error) {
          throw new Error(response.error)
        }
        
        if (response.data) {
          dataCache.set(CacheKeys.landingStats(userId), response.data, 30 * 60 * 1000)
          setStats(response.data)
        }
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching landing stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLandingStats()
  }, [userId])

  return { stats, loading, error }
}
