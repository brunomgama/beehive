'use client'

import { TrendingUp, TrendingDown, Calendar, Wallet, BarChart3 } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { getThemeButtonStyle, getButtonStyle } from '@/lib/themes'
import { CATEGORY_COLORS } from '@/lib/util/categories'
import { formatBalance } from '@/lib/util/utils'
import { TimeFilter, useAnalytics } from '@/hooks/analytics/use-analytics'
import { Button } from '@/components/ui/button'

/**
 * Analytics Mobile Component
 * Displays financial analytics with charts and breakdowns
 */
export function AnalyticsMobile() {
  const { theme } = useTheme()
  const {timeFilter, setTimeFilter, stats, categoryData, chartData, maxValue, accounts, loading} = useAnalytics()

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-bold text-foreground mb-6">Analytics</h1>
        </div>
        <div className="px-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-3xl p-6 shadow-sm border animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (accounts.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-bold text-foreground mb-6"> Analytics </h1>
        </div>
        <div className="px-6">
          <div className="bg-card rounded-3xl p-8 shadow-sm border text-center">
            <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2"> No Accounts Yet </h2>
            <p className="text-sm text-muted-foreground"> Add your first bank account to see analytics </p>
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
        <div className="grid grid-cols-4 gap-2 bg-card rounded-2xl p-2 shadow-sm border">
          {(['day', 'week', 'month', 'year'] as TimeFilter[]).map((filter) => (
            <Button key={filter} onClick={() => setTimeFilter(filter)}
              className={`py-2 rounded-xl text-sm font-semibold transition-all ${timeFilter === filter ?
                 `${getButtonStyle(theme)} shadow-md` : 'text-muted-foreground hover:bg-muted'}`}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          
          {/* Income Card */}
          <div className="bg-card rounded-3xl p-5 shadow-sm border">
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
          <div className="bg-card rounded-3xl p-5 shadow-sm border">
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
        <div className="bg-card rounded-3xl p-6 shadow-sm border">
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
                        <div className="h-full bg-ok rounded-full transition-all duration-500"
                          style={{ width: `${(item.income / maxValue) * 100}%` }}/>
                      </div>
                      {/* Expense Bar */}
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-nok rounded-full transition-all duration-500"
                          style={{ width: `${(item.expense / maxValue) * 100}%` }}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
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
        <div className="bg-card rounded-3xl p-6 shadow-sm border">
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
                    <span className="text-sm font-semibold text-foreground">
                      {category.name}
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-foreground">
                        {formatBalance(category.amount)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${CATEGORY_COLORS[category.category]} rounded-full transition-all duration-500`}
                      style={{width: `${category.percentage}%`}}/>
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
          <p className="text-4xl font-bold text-white mb-2"> {formatBalance(stats.netBalance)} </p>
          <p className="text-sm text-white/70"> for this {timeFilter} </p>
        </div>
      </div>
    </div>
  )
}