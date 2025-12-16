'use client'

import { TrendingUp, TrendingDown, Calendar, Wallet, BarChart3, PieChart } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { getThemeButtonStyle, getButtonStyle } from '@/lib/themes'
import { CATEGORY_COLORS } from '@/lib/util/categories'
import { formatBalance } from '@/lib/util/utils'
import { TimeFilter, useAnalytics } from '@/hooks/analytics/use-analytics'
import { Button } from '@/components/ui/button'

/**
 * Analytics Desktop Component
 * Enhanced desktop layout with better use of space
 */
export default function AnalyticsDesktop() {
  const { theme } = useTheme()
  const {timeFilter, setTimeFilter, stats, categoryData, chartData, maxValue, accounts, loading} = useAnalytics()

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-12 bg-muted rounded w-1/4 animate-pulse" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (<div key={i} className="bg-card rounded-3xl p-6 h-40 animate-pulse" />))}
          </div>
          <div className="bg-card rounded-3xl p-6 h-96 animate-pulse" />
        </div>
      </div>
    )
  }

  // Empty state
  if (accounts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Analytics</h1>
          <div className="bg-card rounded-3xl p-12 shadow-sm border text-center">
            <Wallet className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-3">No Accounts Yet</h2>
            <p className="text-muted-foreground">Add your first bank account to see detailed analytics</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Time Filter */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Analytics</h1>
          
          {/* Time Filter Tabs */}
          <div className="flex gap-2 bg-card rounded-2xl p-2 shadow-sm border">
            {(['day', 'week', 'month', 'year'] as TimeFilter[]).map((filter) => (
              <Button key={filter} onClick={() => setTimeFilter(filter)}
                className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${timeFilter === filter ?
                   `${getButtonStyle(theme)} shadow-md` : 'text-muted-foreground hover:bg-muted'}`} >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* Income Card */}
          <div className="bg-card rounded-3xl p-6 shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Income</p>
                <p className="text-3xl font-bold text-foreground"> {formatBalance(stats.totalIncome)} </p>
              </div>
              <div className="w-12 h-12 bg-ok/20 rounded-full flex items-center justify-center">
                <TrendingUp size={24} className="text-ok-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`font-semibold ${stats.incomeChange >= 0 ? 'text-ok-foreground' : 'text-nok-foreground'}`}>
                {stats.incomeChange >= 0 ? '+' : ''}{stats.incomeChange}%
              </span>
              <span className="text-muted-foreground">vs last {timeFilter}</span>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-card rounded-3xl p-6 shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
                <p className="text-3xl font-bold text-foreground">
                  {formatBalance(stats.totalExpenses)}
                </p>
              </div>
              <div className="w-12 h-12 bg-nok/20 rounded-full flex items-center justify-center">
                <TrendingDown size={24} className="text-nok-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`font-semibold ${stats.expenseChange <= 0 ? 'text-ok-foreground' : 'text-nok-foreground'}`}>
                {stats.expenseChange >= 0 ? '+' : ''}{stats.expenseChange}%
              </span>
              <span className="text-muted-foreground">vs last {timeFilter}</span>
            </div>
          </div>

          {/* Net Balance Card */}
          <div className={`rounded-3xl p-6 shadow-lg ${getThemeButtonStyle(theme, 'primary')}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-white/70 mb-1">Net Balance</p>
                <p className="text-3xl font-bold text-white">{formatBalance(stats.netBalance)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Calendar size={24} className="text-white" />
              </div>
            </div>
            <p className="text-sm text-white/70">for this {timeFilter}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* Income vs Expenses Chart - Takes 2 columns */}
          <div className="col-span-2 bg-card rounded-3xl p-6 shadow-sm border">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={24} className="text-primary" />
              <h3 className="text-xl font-bold text-foreground">Income vs Expenses</h3>
            </div>
            
            {chartData.length === 0 || (stats.totalIncome === 0 && stats.totalExpenses === 0) ? (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No data for this period</p>
              </div>
            ) : (
              <>

                {/* Bar Chart */}
                <div className="space-y-4 mb-6">
                  {chartData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span className="font-semibold text-foreground">{item.label}</span>
                        <div className="flex gap-6">
                          <span className="text-ok-foreground font-medium">
                            {formatBalance(item.income)}
                          </span>
                          <span className="text-nok-foreground font-medium">
                            {formatBalance(item.expense)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {/* Income Bar */}
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-ok rounded-full transition-all duration-500"
                            style={{ width: `${(item.income / maxValue) * 100}%` }}/>
                        </div>
                        {/* Expense Bar */}
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-nok rounded-full transition-all duration-500"
                            style={{ width: `${(item.expense / maxValue) * 100}%` }}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-8 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-ok rounded-full" />
                    <span className="text-sm text-muted-foreground font-medium">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-nok rounded-full" />
                    <span className="text-sm text-muted-foreground font-medium">Expenses</span>
                  </div>
                </div>

              </>
            )}
          </div>

          {/* Category Breakdown - Takes 1 column */}
          <div className="bg-card rounded-3xl p-6 shadow-sm border">
            <div className="flex items-center gap-2 mb-6">
              <PieChart size={24} className="text-primary" />
              <h3 className="text-xl font-bold text-foreground">By Category</h3>
            </div>
            
            {categoryData.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No expenses yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categoryData.slice(0, 8).map((category, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {category.name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {category.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${CATEGORY_COLORS[category.category]} rounded-full transition-all duration-500`}
                          style={{ width: `${category.percentage}%` }}/>
                      </div>
                      <span className="text-sm font-bold text-foreground whitespace-nowrap">
                        {formatBalance(category.amount)}
                      </span>
                    </div>
                  </div>
                ))}
                {categoryData.length > 8 && (
                  <p className="text-xs text-muted-foreground text-center pt-2"> +{categoryData.length - 8} more categories </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}