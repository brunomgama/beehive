import { useState, useEffect } from 'react'
import { dataCache } from '@/lib/util/cache'
import { bankAccountApi } from '@/lib/api/bank/accounts-api'
import { Movement, movementApi } from '@/lib/api/bank/movements-api'

/**
 * Shared hook to fetch all movements for a user
 * This prevents duplicate API calls across multiple hooks
 * Returns cached value instantly if available
 */
export function useAllMovements(userId: number | undefined) {
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isCancelled = false

    const fetchAllMovements = async () => {
      if (!userId) return

      try {
        setLoading(true)
        setError(null)

        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1
        const cacheKey = `movements:all:${userId}:${year}-${month}`

        // Check cache first
        const cached = dataCache.get<Movement[]>(cacheKey)
        if (cached !== null && !isCancelled) {
          setMovements(cached)
          setLoading(false)
          return
        }

        // Fetch accounts
        const accountsResult = await bankAccountApi.getByUserId(userId)
        if (isCancelled) return

        if (accountsResult.data) {
          const allMovements: Movement[] = []

          // Fetch movements for each account
          for (const account of accountsResult.data) {
            if (account.id) {
              const movementsResult = await movementApi.getByAccountId(account.id)
              if (movementsResult.data) {
                allMovements.push(...movementsResult.data)
              }
            }
          }

          if (!isCancelled) {
            // Cache for 30 minutes
            dataCache.set(cacheKey, allMovements, 30 * 60 * 1000)
            setMovements(allMovements)
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err as Error)
          console.error('Error fetching all movements:', err)
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchAllMovements()

    return () => {
      isCancelled = true
    }
  }, [userId])

  return { movements, loading, error }
}