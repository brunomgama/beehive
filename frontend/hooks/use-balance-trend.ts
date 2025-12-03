import { useState, useEffect } from 'react'
import { subDays, addDays, isAfter, eachDayOfInterval, format } from 'date-fns'
import { dataCache, CacheKeys } from '@/lib/util/cache'
import { bankAccountApi } from '@/lib/api/bank/accounts-api'
import { movementApi, Movement } from '@/lib/api/bank/movements-api'
import { plannedMovementApi, PlannedMovement } from '@/lib/api/bank/planned-api'

export interface BalanceTrendData {
  date: string
  fullDate: string
  actual: number | null
  projected: number | null
  isToday: boolean
  isFuture: boolean
}

/**
 * Hook to fetch and cache balance trend (14 days past + 14 days future)
 * Returns cached value instantly if available, otherwise fetches from API
 */
export function useBalanceTrend(userId: number | undefined) {
  const [balanceTrend, setBalanceTrend] = useState<BalanceTrendData[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchBalanceTrend = async () => {
      if (!userId) return

      try {
        setLoading(true)
        setError(null)

        const cached = dataCache.get<BalanceTrendData[]>(CacheKeys.balanceTrend(userId))
        if (cached !== null) {
          setBalanceTrend(cached)
          setLoading(false)
          return
        }

        const accountsResult = await bankAccountApi.getByUserId(userId)
        if (accountsResult.data) {
          const allMovements: Movement[] = []
          const allPlannedMovements: PlannedMovement[] = []

          for (const account of accountsResult.data) {
            if (account.id) {
              const movementsResult = await movementApi.getByAccountId(account.id)
              if (movementsResult.data) {
                allMovements.push(...movementsResult.data)
              }

              const plannedResult = await plannedMovementApi.getByAccountId(account.id)
              if (plannedResult.data) {
                allPlannedMovements.push(...plannedResult.data)
              }
            }
          }

          const now = new Date()
          const startDate = subDays(now, 14)
          const endDate = addDays(now, 14)
          const days = eachDayOfInterval({ start: startDate, end: endDate })

          const currentBalance = accountsResult.data.reduce((sum, acc) => sum + acc.balance, 0)
          const confirmedMovements = allMovements.filter(m => m.status === 'CONFIRMED')
          const activePlanned = allPlannedMovements.filter(pm => pm.status !== 'CANCELLED' && pm.status !== 'FAILED')

          const balanceByDay = days.map(day => {
            const dayStr = format(day, 'yyyy-MM-dd')
            const nowStr = format(now, 'yyyy-MM-dd')
            const isToday = nowStr === dayStr
            const isFuture = isAfter(day, now)

            let dayBalance = currentBalance

            if (!isFuture && !isToday) {
              const pastMovements = confirmedMovements.filter(m => {
                const movDate = format(new Date(m.date), 'yyyy-MM-dd')
                return movDate > dayStr && movDate <= nowStr
              })

              pastMovements.forEach(m => {
                if (m.type === 'INCOME') {
                  dayBalance -= m.amount
                } else {
                  dayBalance += Math.abs(m.amount)
                }
              })
            } else if (isFuture) {
              const futureConfirmed = confirmedMovements.filter(m => {
                const movDate = format(new Date(m.date), 'yyyy-MM-dd')
                return movDate > nowStr && movDate <= dayStr
              })

              futureConfirmed.forEach(m => {
                if (m.type === 'INCOME') {
                  dayBalance += m.amount
                } else {
                  dayBalance -= Math.abs(m.amount)
                }
              })

              const plannedForDay = activePlanned.filter(pm => {
                const pmDate = format(new Date(pm.nextExecution), 'yyyy-MM-dd')
                return pmDate > nowStr && pmDate <= dayStr
              })

              plannedForDay.forEach(pm => {
                if (pm.type === 'INCOME') {
                  dayBalance += pm.amount
                } else {
                  dayBalance -= Math.abs(pm.amount)
                }
              })
            }

            return {
                date: format(day, 'MMM d'), fullDate: dayStr, actual: !isFuture ? dayBalance : null,
                projected: isFuture || isToday ? dayBalance : null, isToday, isFuture
            }
          })

          dataCache.set(CacheKeys.balanceTrend(userId), balanceByDay)
          setBalanceTrend(balanceByDay)
        }
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching balance trend:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBalanceTrend()
  }, [userId])

  return { balanceTrend, loading, error }
}
