'use client'

import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Calendar, CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import { XAxis, YAxis, Area, AreaChart } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/line-chart'
import { useTheme } from '@/contexts/theme-context'
import { getCardStyle } from '@/lib/themes'
import { formatBalance } from '@/lib/util/utils'
import { useLanding } from '@/hooks/use-landing'

/**
 * Landing Desktop Component
 * Financial overview dashboard for desktop
 */
export default function LandingDesktop() {
  const { theme } = useTheme()
  const {stats, loading, error, chartConfig, themeColors, savingsRate, netBalance} = useLanding()

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-span-3 bg-card rounded-3xl p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/2 mb-4" />
                <div className="h-10 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (error || !stats || stats.accountCount === 0) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto">
          <div className="bg-card rounded-3xl p-12 text-center">
            <Wallet className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-3">Welcome to BeeHive!</h2>
            <p className="text-lg text-muted-foreground">
              Add your first bank account to get started
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background p-8">
      <div className="mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Financial Overview</h1>
            <p className="text-lg text-muted-foreground">
              {stats.income >= stats.expenses ? "You're on track this month" : 'Watch your spending this month'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-card rounded-2xl px-4 py-2">
              <span className="text-sm text-muted-foreground">Current Month</span>
              <p className="text-lg font-bold text-foreground">{format(new Date(), 'MMMM yyyy')} </p>
            </div>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Total Balance Card */}
          <div className="col-span-4 relative rounded-3xl p-8 shadow-xl overflow-hidden backdrop-blur-2xl">
            <div className={`absolute inset-0 bg-gradient-to-br ${getCardStyle(theme)} opacity-40`} />
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium drop-shadow">Total Balance</p>
                  <p className="text-xs drop-shadow">{stats.accountCount} account{stats.accountCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <p className="text-5xl font-bold mb-2">
                {formatBalance(stats.balance)}
              </p>
              <div className="flex items-center gap-2 mt-4 drop-shadow">
                <Calendar size={16} />
                <span className="text-sm">Updated just now</span>
              </div>
            </div>
            
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_rgba(255,255,255,0.1)] pointer-events-none" />
          </div>

          {/* Income Card */}
          <div className="col-span-4 relative rounded-3xl p-8 shadow-lg overflow-hidden backdrop-blur-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/20" />
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-semibold mb-1 drop-shadow-sm">Monthly Income</p>
                  <p className="text-xs drop-shadow-sm">This month</p>
                </div>
                <div className="w-12 h-12 bg-ok/15 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <ArrowUpRight size={24} className="text-ok drop-shadow" />
                </div>
              </div>
              <p className="text-4xl font-bold mb-2 drop-shadow-sm">
                {formatBalance(stats.income)}
              </p>
            </div>
            
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.2)] pointer-events-none" />
          </div>

          {/* Expense Card */}
          <div className="col-span-4 relative rounded-3xl p-8 shadow-lg overflow-hidden backdrop-blur-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/20" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-semibold mb-1 drop-shadow-sm">Monthly Expenses</p>
                  <p className="text-xs drop-shadow-sm">This month</p>
                </div>
                <div className="w-12 h-12 bg-nok/15 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <ArrowDownRight size={24} className="text-nok drop-shadow" />
                </div>
              </div>
              <p className="text-4xl font-bold mb-2 drop-shadow-sm">
                {formatBalance(stats.expenses)}
              </p>
            </div>
            
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.2)] pointer-events-none" />
          </div>
        </div>

        {/* Chart and Details Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Balance Trend Chart */}
          <div className="col-span-8 relative rounded-3xl p-8 shadow-lg overflow-hidden backdrop-blur-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold drop-shadow-sm">Balance Trend</h3>
                  <p className="text-sm drop-shadow-sm">Last 30 days overview</p>
                </div>
              </div>
              
              <ChartContainer config={chartConfig} className="h-[20rem] w-full">
                <AreaChart data={stats.balanceTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={themeColors.primary} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={themeColors.primary} stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={themeColors.primary} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={themeColors.primary} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={12} 
                  tick={{ fontSize: 12, fill: themeColors.secondary }} interval="preserveStartEnd"/>
                  <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                  
                  <ChartTooltip cursor={false} content={
                      <ChartTooltipContent hideLabel formatter={(value, name) => [
                          `${formatBalance(value as number)}`,
                          name === 'actual' ? 'Current' : 'Projected'
                      ]} />
                    } 
                  />
                  
                  {/* Actual Balance Area */}
                  <Area type="monotone" dataKey="actual" stroke={themeColors.primary} strokeWidth={2.5} 
                  fill="url(#actualGradient)" connectNulls={false}/>
                  
                  {/* Projected Balance Area */}
                  <Area type="monotone" dataKey="projected" stroke={themeColors.primary} strokeWidth={2.5} 
                  strokeDasharray="6 4" fill="url(#projectedGradient)" connectNulls={false}/>
                </AreaChart>
              </ChartContainer>
            </div>
            
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_rgba(255,255,255,0.2)] pointer-events-none" />
          </div>

          {/* Net Summary & Quick Stats */}
          <div className="col-span-4 space-y-6">
            
            {/* Net Summary Card */}
            <div className="relative rounded-3xl p-6 shadow-lg overflow-hidden backdrop-blur-2xl">
              <div className={`absolute inset-0 bg-gradient-to-br 
                ${netBalance >= 0 ? 'from-green-400 to-emerald-500' : 'from-red-400 to-rose-500'} opacity-40`} />
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/15 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/15 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium mb-1 drop-shadow">Net This Month</p>
                    <p className="text-3xl font-bold">
                      {netBalance >= 0 ? '+' : ''} {formatBalance(netBalance)}
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
                    {netBalance >= 0 ? (
                      <TrendingUp size={32} className="drop-shadow-lg" />
                    ) : (
                      <ArrowDownRight size={32} className="drop-shadow-lg" />
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="drop-shadow">Savings Rate</span>
                    <span className="font-bold drop-shadow">{savingsRate}%</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.15)] pointer-events-none" />
            </div>

            {/* Upcoming Payments */}
            {stats.upcomingPayments.length > 0 && (
              <div className="rounded-3xl p-6 border shadow-sm" style={{ backgroundColor: 'var(--card-darker)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard size={20} className="text-muted-foreground" />
                  <h3 className="text-lg font-bold text-foreground">Upcoming Payments</h3>
                </div>
                <div className="space-y-3">
                  {stats.upcomingPayments.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{payment.description}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(payment.date), 'MMM dd')}</p>
                      </div>
                      <p className={`text-sm font-bold ${payment.type === 'INCOME' ? 'text-ok' : 'text-foreground'}`}>
                        {payment.type === 'INCOME' ? '+' : '-'} {formatBalance(payment.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}