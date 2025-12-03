'use client'

import { useState, useEffect, useMemo } from 'react'
import { TrendingUp, TrendingDown, Calendar, Wallet, BarChart3 } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { useAuth } from '@/contexts/auth-context'
import { getThemeButtonStyle, getButtonStyle } from '@/lib/themes'
import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear,
   format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isWithinInterval } from 'date-fns'
import { Movement, movementApi } from '@/lib/api/bank/movements-api'
import { BankAccount, bankAccountApi } from '@/lib/api/bank/accounts-api'
import { formatBalance } from '@/lib/util/converter'
import { CATEGORY_COLORS } from '@/lib/util/category-constants'
import { useAnalyticsStats, TimeFilter } from '@/hooks/use-analytics-stats'
import { useCategoryBreakdown } from '@/hooks/use-category-breakdown'

interface ChartDataPoint {
  label: string
  income: number
  expense: number
}

export function AnalyticsMobile() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month')
  const [movements, setMovements] = useState<Movement[]>([])
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)

  // Use cached hooks
  const { stats: cachedStats } = useAnalyticsStats(user?.id, timeFilter)
  const { categoryData: cachedCategoryData } = useCategoryBreakdown(user?.id, timeFilter)

  // Fetch all accounts and movements for the user (for chart data fallback)
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        
        const accountsResult = await bankAccountApi.getByUserId(user.id)
        if (accountsResult.data) {
          setAccounts(accountsResult.data)
          
          const allMovements: Movement[] = []
          for (const account of accountsResult.data) {
            if (account.id) {
              const movementsResult = await movementApi.getByAccountId(account.id)
              if (movementsResult.data) {
                allMovements.push(...movementsResult.data)
              }
            }
          }
          setMovements(allMovements)
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  // Calculate date ranges based on filter
  const dateRanges = useMemo(() => {
    const now = new Date()
    
    switch (timeFilter) {
      case 'day':
        return { start: startOfDay(now), end: endOfDay(now) }
      case 'week':
        return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) }
      case 'year':
        return { start: startOfYear(now), end: endOfYear(now) }
    }
  }, [timeFilter])

  // Use cached stats if available
  const stats = cachedStats ?? {
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    incomeChange: 0,
    expenseChange: 0
  }

  // Use cached category data if available
  const categoryData = cachedCategoryData ?? []

  // Generate chart data (still calculated from movements for real-time granularity)
  const chartData = useMemo((): ChartDataPoint[] => {
    const currentMovements = movements.filter(m => {
      const date = new Date(m.date)
      return isWithinInterval(date, { start: dateRanges.start, end: dateRanges.end })
    })
    
    switch (timeFilter) {
      case 'day': {
        const hours = ['00h', '06h', '12h', '18h', '24h']
        return hours.map((label, i) => {
          const hourStart = i * 6
          const hourEnd = (i + 1) * 6
          const hourMovements = currentMovements.filter(m => {
            const hour = new Date(m.date).getHours()
            return hour >= hourStart && hour < hourEnd
          })
          return {
            label,
            income: hourMovements.filter(m => m.type === 'INCOME').reduce((s, m) => s + m.amount, 0),
            expense: hourMovements.filter(m => m.type === 'EXPENSE').reduce((s, m) => s + Math.abs(m.amount), 0)
          }
        })
      }
      case 'week': {
        const days = eachDayOfInterval({ start: dateRanges.start, end: dateRanges.end })
        return days.map(day => {
          const dayMovements = currentMovements.filter(m => 
            format(new Date(m.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          )
          return {
            label: format(day, 'EEE'),
            income: dayMovements.filter(m => m.type === 'INCOME').reduce((s, m) => s + m.amount, 0),
            expense: dayMovements.filter(m => m.type === 'EXPENSE').reduce((s, m) => s + Math.abs(m.amount), 0)
          }
        })
      }
      case 'month': {
        const weeks = eachWeekOfInterval({ start: dateRanges.start, end: dateRanges.end }, { weekStartsOn: 1 })
        return weeks.map((weekStart, i) => {
          const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
          const weekMovements = currentMovements.filter(m => {
            const date = new Date(m.date)
            return isWithinInterval(date, { start: weekStart, end: weekEnd })
          })
          return {
            label: `W${i + 1}`,
            income: weekMovements.filter(m => m.type === 'INCOME').reduce((s, m) => s + m.amount, 0),
            expense: weekMovements.filter(m => m.type === 'EXPENSE').reduce((s, m) => s + Math.abs(m.amount), 0)
          }
        })
      }
      case 'year': {
        const months = eachMonthOfInterval({ start: dateRanges.start, end: dateRanges.end })
        return months.map(monthStart => {
          const monthEnd = endOfMonth(monthStart)
          const monthMovements = currentMovements.filter(m => {
            const date = new Date(m.date)
            return isWithinInterval(date, { start: monthStart, end: monthEnd })
          })
          return {
            label: format(monthStart, 'MMM'),
            income: monthMovements.filter(m => m.type === 'INCOME').reduce((s, m) => s + m.amount, 0),
            expense: monthMovements.filter(m => m.type === 'EXPENSE').reduce((s, m) => s + Math.abs(m.amount), 0)
          }
        })
      }
    }
  }, [movements, dateRanges, timeFilter])

  const maxValue = Math.max(...chartData.flatMap(d => [d.income, d.expense]), 1)

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-bold text-foreground mb-6">Analytics</h1>
        </div>
        <div className="px-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-3xl p-6 shadow-sm border border-border animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-bold text-foreground mb-6">Analytics</h1>
        </div>
        <div className="px-6">
          <div className="bg-card rounded-3xl p-8 shadow-sm border border-border text-center">
            <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">No Accounts Yet</h2>
            <p className="text-sm text-muted-foreground">Add your first bank account to see analytics</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-4xl font-bold text-foreground mb-6">Analytics</h1>

        {/* Time Filter */}
        <div className="grid grid-cols-4 gap-2 bg-card rounded-2xl p-2 shadow-sm border border-border">
          {(['day', 'week', 'month', 'year'] as TimeFilter[]).map((filter) => (
            <button key={filter} onClick={() => setTimeFilter(filter)}
              className={`py-2 rounded-xl text-sm font-semibold transition-all ${
                timeFilter === filter ? `${getButtonStyle(theme)} shadow-md` : 'text-muted-foreground hover:bg-muted'}`}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          
          {/* Income Card */}
          <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-ok/20 rounded-full flex items-center justify-center">
                <TrendingUp size={20} className="text-ok-foreground" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Income</p>
            <p className="text-2xl font-bold text-foreground mb-2">
              {formatBalance(stats.totalIncome)}
            </p>
            <div className="flex items-center gap-1 text-xs">
              <span className={`font-semibold ${stats.incomeChange >= 0 ? 'text-ok-foreground' : 'text-nok-foreground'}`}>
                {stats.incomeChange >= 0 ? '+' : ''}{stats.incomeChange}%
              </span>
              <span className="text-muted-foreground">vs last {timeFilter}</span>
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-nok/20 rounded-full flex items-center justify-center">
                <TrendingDown size={20} className="text-nok-foreground" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Expenses</p>
            <p className="text-2xl font-bold text-foreground mb-2">
              {formatBalance(stats.totalExpenses)}
            </p>
            <div className="flex items-center gap-1 text-xs">
              <span className={`font-semibold ${stats.expenseChange <= 0 ? 'text-ok-foreground' : 'text-nok-foreground'}`}>
                {stats.expenseChange >= 0 ? '+' : ''}{stats.expenseChange}%
              </span>
              <span className="text-muted-foreground">vs last {timeFilter}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-6 mb-6">
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-bold text-foreground mb-6">Income vs Expenses</h3>
          
          {chartData.length === 0 || (stats.totalIncome === 0 && stats.totalExpenses === 0) ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No data for this period</p>
            </div>
          ) : (
            <>
              {/* Bar Chart */}
              <div className="space-y-4">
                {chartData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span className="font-semibold text-foreground">{item.label}</span>
                      <div className="flex gap-3">
                        <span className="text-ok-foreground">{formatBalance(item.income)}</span>
                        <span className="text-nok-foreground">{formatBalance(item.expense)}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {/* Income Bar */}
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-ok rounded-full transition-all duration-500"
                          style={{ width: `${(item.income / maxValue) * 100}%` }}
                        />
                      </div>
                      {/* Expense Bar */}
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-nok rounded-full transition-all duration-500"
                          style={{ width: `${(item.expense / maxValue) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-ok rounded-full" />
                  <span className="text-sm text-muted-foreground">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-nok rounded-full" />
                  <span className="text-sm text-muted-foreground">Expenses</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="px-6 mb-6">
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-bold text-foreground mb-6">Spending by Category</h3>
          
          {categoryData.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No expenses for this period</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{category.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-foreground">{formatBalance(category.amount)}</span>
                      <span className="text-xs text-muted-foreground ml-2">{category.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${CATEGORY_COLORS[category.category]} rounded-full transition-all duration-500`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Net Balance Summary */}
      <div className="px-6">
        <div className={`rounded-3xl p-6 shadow-lg ${getThemeButtonStyle(theme, 'primary')}`}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={20} className="text-white/70" />
            <p className="text-sm text-white/70">Net Balance</p>
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            {formatBalance(stats.netBalance)}
          </p>
          <p className="text-sm text-white/70">
            for this {timeFilter}
          </p>
        </div>
      </div>
    </div>
  )
}