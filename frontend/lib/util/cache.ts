// ============================================================================
// CACHE CONFIGURATION
// ============================================================================
const CACHE_DURATION = 48 * 60 * 60 * 1000 // 48 hours
const STORAGE_PREFIX = 'beehive_cache_'

// ============================================================================
// CACHE TYPES
// ============================================================================
interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

// ============================================================================
// DATA CACHE CLASS
// ============================================================================
class DataCache {
  private memoryCache: Map<string, CacheEntry<any>> = new Map()
  private useStorage: boolean

  constructor() {
    this.useStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  }

  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const storageKey = STORAGE_PREFIX + key
    
    let entry = this.memoryCache.get(key)
    
    // Try to load from localStorage if not in memory
    if (!entry && this.useStorage) {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          entry = JSON.parse(stored)
          if (entry) {
            this.memoryCache.set(key, entry)
          }
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error)
      }
    }
    
    if (!entry) {
      return null
    }

    // Check if expired
    const now = Date.now()
    if (now > entry.expiresAt) {
      this.memoryCache.delete(key)
      if (this.useStorage) {
        try {
          localStorage.removeItem(storageKey)
        } catch (error) {
          console.error('Error removing from localStorage:', error)
        }
      }
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
    const storageKey = STORAGE_PREFIX + key
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + duration
    }

    this.memoryCache.set(key, entry)

    if (this.useStorage) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(entry))
      } catch (error) {
        console.error('Error writing to localStorage:', error)
        this.cleanupOldEntries()
      }
    }
  }

  /**
   * Invalidate specific cache keys
   */
  invalidate(...keys: string[]): void {
    keys.forEach(key => {
      this.memoryCache.delete(key)
      if (this.useStorage) {
        try {
          localStorage.removeItem(STORAGE_PREFIX + key)
        } catch (error) {
          console.error('Error removing from localStorage:', error)
        }
      }
    })
  }

  /**
   * Invalidate all cache keys that match a pattern
   */
  invalidatePattern(pattern: RegExp): void {
    const keysToDelete: string[] = []
    
    // Check memory cache
    this.memoryCache.forEach((_, key) => {
      if (pattern.test(key)) {
        keysToDelete.push(key)
      }
    })

    // Check localStorage
    if (this.useStorage) {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const storageKey = localStorage.key(i)
          if (storageKey?.startsWith(STORAGE_PREFIX)) {
            const key = storageKey.substring(STORAGE_PREFIX.length)
            if (pattern.test(key) && !keysToDelete.includes(key)) {
              keysToDelete.push(key)
            }
          }
        }
      } catch (error) {
        console.error('Error scanning localStorage:', error)
      }
    }

    keysToDelete.forEach(key => this.invalidate(key))
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.memoryCache.clear()
    
    if (this.useStorage) {
      try {
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key?.startsWith(STORAGE_PREFIX)) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
      } catch (error) {
        console.error('Error clearing localStorage:', error)
      }
    }
  }

  /**
   * Clean up expired entries from localStorage
   */
  private cleanupOldEntries(): void {
    if (!this.useStorage) return

    const now = Date.now()
    const keysToRemove: string[] = []

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i)
        if (storageKey?.startsWith(STORAGE_PREFIX)) {
          const stored = localStorage.getItem(storageKey)
          if (stored) {
            const entry = JSON.parse(stored)
            if (now > entry.expiresAt) {
              keysToRemove.push(storageKey)
            }
          }
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Error during cleanup:', error)
    }
  }

  /**
   * Get cache statistics (useful for debugging)
   */
  getStats(): { size: number; keys: string[]; storageSize?: number } {
    const stats = {
      size: this.memoryCache.size,
      keys: Array.from(this.memoryCache.keys()),
      storageSize: 0
    }

    if (this.useStorage) {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key?.startsWith(STORAGE_PREFIX)) {
            stats.storageSize!++
          }
        }
      } catch (error) {
        console.error('Error getting storage stats:', error)
      }
    }

    return stats
  }

  /**
   * Get all cache entries (for debugging)
   */
  getAllEntries(): Array<{ key: string; data: any; timestamp: number; expiresAt: number; expiresIn: string }> {
    const now = Date.now()
    const entries: Array<{ key: string; data: any; timestamp: number; expiresAt: number; expiresIn: string }> = []

    this.memoryCache.forEach((entry, key) => {
      entries.push({
        key,
        data: entry.data,
        timestamp: entry.timestamp,
        expiresAt: entry.expiresAt,
        expiresIn: `${Math.round((entry.expiresAt - now) / 1000 / 60)} minutes`
      })
    })

    if (this.useStorage) {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const storageKey = localStorage.key(i)
          if (storageKey?.startsWith(STORAGE_PREFIX)) {
            const key = storageKey.substring(STORAGE_PREFIX.length)
            if (!this.memoryCache.has(key)) {
              const stored = localStorage.getItem(storageKey)
              if (stored) {
                const entry = JSON.parse(stored)
                entries.push({
                  key,
                  data: entry.data,
                  timestamp: entry.timestamp,
                  expiresAt: entry.expiresAt,
                  expiresIn: `${Math.round((entry.expiresAt - now) / 1000 / 60)} minutes`
                })
              }
            }
          }
        }
      } catch (error) {
        console.error('Error reading entries from localStorage:', error)
      }
    }

    return entries
  }

  /**
   * Debug helper to log cache information
   */
  debug(): void {
    console.group('🗄️ Cache Debug')
    const stats = this.getStats()
    console.log(`Memory entries: ${stats.size}`)
    console.log(`Storage entries: ${stats.storageSize}`)
    console.table(this.getAllEntries())
    console.groupEnd()
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================
export const dataCache = new DataCache()

// Enable debug access in browser console
if (typeof window !== 'undefined') {
  (window as any).__cache = dataCache
  console.log('💡 Cache debug available: Run __cache.debug() in console')
}

// ============================================================================
// CACHE KEY BUILDERS (TypeScript-safe)
// ============================================================================
export const CacheKeys = {
  // Landing page
  landingStats: (userId: number) => `landing:stats:${userId}` as const,
  
  // Patterns for invalidation
  patterns: {
    allLandingForUser: (userId: number) => new RegExp(`^landing:.*:${userId}`),
    balanceRelated: (userId: number) => new RegExp(`^landing:(total-balance|balance-trend|stats):${userId}`)
  }
} as const

// ============================================================================
// CACHE INVALIDATION HELPERS
// ============================================================================
export const invalidateCache = {
  /**
   * When a movement is created/updated/deleted
   * This affects: income, expenses, balance, and trend
   */
  onMovementChange: (userId: number) => {
    dataCache.invalidatePattern(CacheKeys.patterns.balanceRelated(userId))
  },

  /**
   * When a planned movement is created/updated/deleted
   * This affects: upcoming planned and balance trend
   */
  onPlannedMovementChange: (userId: number) => {
    dataCache.invalidatePattern(CacheKeys.patterns.balanceRelated(userId))
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