interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

const CACHE_DURATION = 48 * 60 * 60 * 1000 // 48 hours in milliseconds

class DataCache {
  private cache: Map<string, CacheEntry<any>> = new Map()

  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    const now = Date.now()
    if (now > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Set data in cache with automatic expiration
   */
  set<T>(key: string, data: T, customDuration?: number): void {
    const now = Date.now()
    const duration = customDuration || CACHE_DURATION
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + duration
    })
  }

  /**
   * Invalidate specific cache keys
   */
  invalidate(...keys: string[]): void {
    keys.forEach(key => this.cache.delete(key))
  }

  /**
   * Invalidate all cache keys that match a pattern
   */
  invalidatePattern(pattern: RegExp): void {
    const keysToDelete: string[] = []
    
    this.cache.forEach((_, key) => {
      if (pattern.test(key)) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.cache.delete(key))
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics (useful for debugging)
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Export singleton instance
export const dataCache = new DataCache()

// Cache key builders for different data types
export const CacheKeys = {
  // Landing page cards
  totalBalance: (userId: number) => `landing:total-balance:${userId}`,
  monthIncome: (userId: number, year: number, month: number) => `landing:month-income:${userId}:${year}-${month}`,
  monthExpenses: (userId: number, year: number, month: number) => `landing:month-expenses:${userId}:${year}-${month}`,
  upcomingPlanned: (userId: number) => `landing:upcoming-planned:${userId}`,
  balanceTrend: (userId: number) => `landing:balance-trend:${userId}`,
  
  // Patterns for invalidation
  patterns: {
    allLandingForUser: (userId: number) => new RegExp(`^landing:.*:${userId}`),
    monthDataForUser: (userId: number, year: number, month: number) => 
      new RegExp(`^landing:month.*:${userId}:${year}-${month}`),
    balanceRelated: (userId: number) => 
      new RegExp(`^landing:(total-balance|balance-trend):${userId}`)
  }
}

// Cache invalidation helpers
export const invalidateCache = {
  /**
   * When a movement is created/updated/deleted
   * This affects: income, expenses, balance, and trend
   */
  onMovementChange: (userId: number, movementType: 'INCOME' | 'EXPENSE', date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    
    // Invalidate the specific month data
    if (movementType === 'INCOME') {
      dataCache.invalidate(CacheKeys.monthIncome(userId, year, month))
    } else {
      dataCache.invalidate(CacheKeys.monthExpenses(userId, year, month))
    }
    
    // Always invalidate balance-related caches
    dataCache.invalidatePattern(CacheKeys.patterns.balanceRelated(userId))
  },

  /**
   * When a planned movement is created/updated/deleted
   * This affects: upcoming planned and balance trend
   */
  onPlannedMovementChange: (userId: number) => {
    dataCache.invalidate(
      CacheKeys.upcomingPlanned(userId),
      CacheKeys.balanceTrend(userId)
    )
  },

  /**
   * When an account is created/updated/deleted
   * This affects: total balance and balance trend
   */
  onAccountChange: (userId: number) => {
    dataCache.invalidatePattern(CacheKeys.patterns.balanceRelated(userId))
  },

  /**
   * Clear all cache for a user (e.g., on logout)
   */
  clearUserCache: (userId: number) => {
    dataCache.invalidatePattern(CacheKeys.patterns.allLandingForUser(userId))
  }
}
