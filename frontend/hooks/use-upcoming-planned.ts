import { useState, useEffect } from 'react'
import { addDays, isAfter, isBefore } from 'date-fns'
import { dataCache, CacheKeys } from '@/lib/util/cache'
import { bankAccountApi } from '@/lib/api/bank/accounts-api'
import { plannedMovementApi, PlannedMovement } from '@/lib/api/bank/planned-api'

/**
 * Hook to fetch and cache upcoming planned movements (next 30 days)
 * Returns cached value instantly if available, otherwise fetches from API
 */
export function useUpcomingPlanned(userId: number | undefined) {
  const [upcomingPlanned, setUpcomingPlanned] = useState<PlannedMovement[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchUpcomingPlanned = async () => {
      if (!userId) return

      try {
        setLoading(true)
        setError(null)

        const cached = dataCache.get<PlannedMovement[]>(CacheKeys.upcomingPlanned(userId))
        if (cached !== null) {
          setUpcomingPlanned(cached)
          setLoading(false)
          return
        }

        const accountsResult = await bankAccountApi.getByUserId(userId)
        if (accountsResult.data) {
          const allPlannedMovements: PlannedMovement[] = []

          for (const account of accountsResult.data) {
            if (account.id) {
              const plannedResult = await plannedMovementApi.getByAccountId(account.id)
              if (plannedResult.data) {
                allPlannedMovements.push(...plannedResult.data)
              }
            }
          }

          const now = new Date()
          const futureDate = addDays(now, 30)

          const upcoming = allPlannedMovements
            .filter(pm => {
              const nextExecution = new Date(pm.nextExecution)
              return pm.status !== 'CANCELLED' && pm.status !== 'FAILED' &&
                isAfter(nextExecution, now) && isBefore(nextExecution, futureDate)
            }).sort((a, b) => new Date(a.nextExecution).getTime() - new Date(b.nextExecution).getTime()).slice(0, 3)

          dataCache.set(CacheKeys.upcomingPlanned(userId), upcoming)
          setUpcomingPlanned(upcoming)
        }
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching upcoming planned:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingPlanned()
  }, [userId])

  return { upcomingPlanned, loading, error }
}
