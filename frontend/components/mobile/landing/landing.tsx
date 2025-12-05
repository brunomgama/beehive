'use client'

import { useMemo, useState } from "react"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Clock, RefreshCw } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { getCardStyle, getThemeColors } from "@/lib/themes"
import { XAxis, YAxis, Area, AreaChart } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/line-chart"
import { formatBalance } from "@/lib/util/converter"
import { useLandingStats } from "@/hooks/use-landing-stats"

export default function LandingMobile() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const { stats, loading, error } = useLandingStats(user?.id)

  const handleRefresh = async () => {
    if (!user?.id || isRefreshing) return
    
    setIsRefreshing(true)
    
    const { dataCache, CacheKeys } = await import('@/lib/util/cache')
    dataCache.invalidate(CacheKeys.landingStats(user.id))
    
    setTimeout(() => {
      window.location.reload()
    }, 300)
  }

  const chartConfig = useMemo(() => ({
    balance: {
      label: "Balance",
      color: getThemeColors(theme).primary,
    },
  }), [theme]) satisfies ChartConfig

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted to-background pb-32">
        <div className="px-6 pt-8 pb-4">
          <h1 className="text-4xl font-bold text-foreground">Finance</h1>
        </div>
        <div className="px-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-3xl p-6 shadow-sm border border-border animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !stats || stats.accountCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted to-background pb-32">
        <div className="px-6 pt-8 pb-4">
          <h1 className="text-4xl font-bold text-foreground">Finance</h1>
        </div>
        <div className="px-6">
          <div className="bg-card rounded-3xl p-8 shadow-sm border border-border text-center">
            <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Welcome!</h2>
            <p className="text-sm text-muted-foreground">Add your first bank account to get started</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-background pb-32">
      
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-foreground">Finance</h1>
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {stats.income >= stats.expenses ? "You're on Track" : "Watch Spending"}
          </h2>
          <h3 className="text-3xl font-light text-muted-foreground">this month</h3>
        </div>
      </div>

      {/* Total Balance Card */}
      <div className="px-6 mb-6">
        <div className={`p-6 shadow-lg ${getCardStyle(theme)} relative`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-white/70" />
            <p className="text-sm text-white/70">Total Balance</p>
          </div>
          <p className="text-4xl font-bold text-white mb-1">
            {formatBalance(stats.balance)}
          </p>
          <p className="text-sm text-white/70 mb-3">
            across {stats.accountCount} account{stats.accountCount !== 1 ? 's' : ''}
          </p>
          
          {/* Available Balance */}
          <div className="pt-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Available to Use</span>
              <span className="text-lg font-semibold text-white">
                {formatBalance(stats.availableBalance)}
              </span>
            </div>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50"
            aria-label="Refresh data"
          >
            <RefreshCw 
              size={18} 
              className={`text-white ${isRefreshing ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
      </div>

      {/* Balance Trend Chart */}
      <div className="px-6 mb-6">
        <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
          <p className="text-sm font-semibold text-foreground mb-4">Balance Trend</p>
          
          <ChartContainer config={chartConfig} className="h-[10rem] w-full">
            <AreaChart data={stats.balanceTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getThemeColors(theme).primary} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={getThemeColors(theme).primary} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getThemeColors(theme).primary} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={getThemeColors(theme).primary} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} 
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} interval="preserveStartEnd" />
              <YAxis hide domain={['dataMin - 200', 'dataMax + 200']} />
              <ChartTooltip cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '5 5' }}
                content={
                <ChartTooltipContent 
                  hideLabel 
                  formatter={(value, name) => {
                    return [`${formatBalance(value as number)}`, name === 'actual' ? ' Current' : ' Projected']
                  }}
                />} 
              />
              
              {/* Actual Balance Area (Past + Today) */}
              <Area type="monotone" dataKey="actual" stroke={getThemeColors(theme).primary} 
                strokeWidth={2.5} fill="url(#actualGradient)" connectNulls={false}/>
              
              {/* Projected Balance Area (Today + Future) */}
              <Area type="monotone" dataKey="projected" stroke={getThemeColors(theme).primary} 
                strokeWidth={2.5} strokeDasharray="6 4" fill="url(#projectedGradient)" connectNulls={false}/>
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      {/* Upcoming Payments */}
      {stats.upcomingPayments.length > 0 && (
        <div className="px-6 mb-6">
          <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">Upcoming Payments</p>
              </div>
              <span className="text-xs text-muted-foreground">Next 30 days</span>
            </div>
            
            <div className="pt-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Expected Impact</span>
              <span className={`text-base font-bold ${stats.expectedImpact >= 0 ? 'text-ok-foreground' : 'text-nok-foreground'}`}>
                {stats.expectedImpact >= 0 ? '+' : ''}{formatBalance(stats.expectedImpact)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Income & Expense Cards */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Income</p>
              <div className="w-8 h-8 bg-ok/20 rounded-full flex items-center justify-center">
                <ArrowUpRight size={16} className="text-ok-foreground" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatBalance(stats.income)}</p>
            <p className="text-xs text-muted-foreground mt-1">this month</p>
          </div>

          <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Expenses</p>
              <div className="w-8 h-8 bg-nok/20 rounded-full flex items-center justify-center">
                <ArrowDownRight size={16} className="text-nok-foreground" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatBalance(stats.expenses)}</p>
            <p className="text-xs text-muted-foreground mt-1">this month</p>
          </div>
        </div>
      </div>
    </div>
  )
}