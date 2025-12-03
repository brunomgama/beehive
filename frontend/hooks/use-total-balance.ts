import { useState, useEffect } from 'react'
import { dataCache, CacheKeys } from '@/lib/util/cache'
import { bankAccountApi } from '@/lib/api/bank/accounts-api'

/**
 * Hook to fetch and cache total balance across all accounts
 * Returns cached value instantly if available, otherwise fetches from API
 */
export function useTotalBalance(userId: number | undefined) {
  const [totalBalance, setTotalBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTotalBalance = async () => {
      if (!userId) return

      try {
        setLoading(true)
        setError(null)

        const cached = dataCache.get<number>(CacheKeys.totalBalance(userId))
        if (cached !== null) {
          setTotalBalance(cached)
          setLoading(false)
          return
        }

        const accountsResult = await bankAccountApi.getByUserId(userId)
        if (accountsResult.data) {
          const total = accountsResult.data.reduce((sum, acc) => sum + acc.balance, 0)
          dataCache.set(CacheKeys.totalBalance(userId), total)
          setTotalBalance(total)
        }
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching total balance:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTotalBalance()
  }, [userId])

  return { totalBalance, loading, error }
}
