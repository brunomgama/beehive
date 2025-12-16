import { useState, useEffect } from 'react'
import { addDays, isAfter, isBefore } from 'date-fns'
import { dataCache } from '@/lib/util/cache'
import { bankAccountApi } from '@/lib/api/bank/accounts-api'
import { PlannedMovement, plannedMovementApi } from '@/lib/api/bank/planned-api'

/**
 * Hook to fetch and cache upcoming planned movements (next 30 days)
 * Returns cached value instantly if available, otherwise fetches from API
 */
export function useUpcomingPlanned(userId: number | undefined) {
  const [upcomingPlanned, setUpcomingPlanned] = useState<PlannedMovement[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isCancelled = false

    const fetchUpcomingPlanned = async () => {
      if (!userId) return

      try {
        setLoading(true)
        setError(null)

        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1
        
        // Fixed cache key (was using removed CacheKeys.upcomingPlanned)
        const cacheKey = `planned:upcoming:${userId}:${year}-${month}`

        // Check cache first
        const cached = dataCache.get<PlannedMovement[]>(cacheKey)
        if (cached !== null && !isCancelled) {
          setUpcomingPlanned(cached)
          setLoading(false)
          return
        }

        // Fetch accounts
        const accountsResult = await bankAccountApi.getByUserId(userId)
        if (isCancelled) return

        if (accountsResult.data) {
          const allPlannedMovements: PlannedMovement[] = []

          // Fetch planned movements for each account
          for (const account of accountsResult.data) {
            if (account.id) {
              const plannedResult = await plannedMovementApi.getByAccountId(account.id)
              if (plannedResult.data) {
                allPlannedMovements.push(...plannedResult.data)
              }
            }
          }

          if (isCancelled) return

          const futureDate = addDays(now, 30)

          const upcoming = allPlannedMovements
            .filter(pm => {
              const nextExecution = new Date(pm.nextExecution)
              return (
                pm.status !== 'CANCELLED' && 
                pm.status !== 'FAILED' &&
                isAfter(nextExecution, now) && 
                isBefore(nextExecution, futureDate)
              )
            })
            .sort((a, b) => new Date(a.nextExecution).getTime() - new Date(b.nextExecution).getTime()).slice(0, 3)

          if (!isCancelled) {
            dataCache.set(cacheKey, upcoming, 30 * 60 * 1000)
            setUpcomingPlanned(upcoming)
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err as Error)
          console.error('Error fetching upcoming planned:', err)
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchUpcomingPlanned()

    return () => {
      isCancelled = true
    }
  }, [userId])

  return { upcomingPlanned, loading, error }
}