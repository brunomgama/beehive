import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from '@/contexts/theme-context'
import { getThemeColors } from '@/lib/themes'
import { useLandingStats } from '@/hooks/use-landing-stats'
import { dataCache, CacheKeys } from '@/lib/util/cache'
import { ChartConfig } from '@/components/ui/line-chart'

/**
 * Shared hook for landing page logic
 * Handles data fetching, refresh, and chart configuration
 */
export function useLanding() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Fetch landing stats
  const { stats, loading, error } = useLandingStats(user?.id)

  /**
   * Chart configuration with theme colors
   */
  const chartConfig = useMemo(() => ({
    balance: {
      label: 'Balance',
      color: getThemeColors(theme).primary,
    },
  }), [theme]) satisfies ChartConfig

  /**
   * Theme colors for charts
   */
  const themeColors = useMemo(() => getThemeColors(theme), [theme])

  /**
   * Calculate savings rate
   */
  const savingsRate = useMemo(() => {
    if (!stats || stats.income === 0) return 0
    return Math.round(((stats.income - stats.expenses) / stats.income) * 100)
  }, [stats])

  /**
   * Net balance (income - expenses)
   */
  const netBalance = useMemo(() => {
    if (!stats) return 0
    return stats.income - stats.expenses
  }, [stats])

  /**
   * Refresh landing data
   */
  const handleRefresh = async () => {
    if (!user?.id || isRefreshing) return
    
    setIsRefreshing(true)
    
    // Invalidate cache
    dataCache.invalidate(CacheKeys.landingStats(user.id))
    
    // Reload after short delay
    setTimeout(() => {
      window.location.reload()
    }, 300)
  }

  return {
    stats,
    loading,
    error,
    chartConfig,
    themeColors,
    savingsRate,
    netBalance,
    isRefreshing,
    handleRefresh,
  }
}