'use client'

import { useState, useEffect, useMemo } from "react"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Clock } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { getCardStyle, getThemeColors } from "@/lib/themes"
import { XAxis, YAxis, Area, AreaChart } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/line-chart"
import { Movement, movementApi } from "@/lib/api/bank/movements-api"
import { BankAccount, bankAccountApi } from "@/lib/api/bank/accounts-api"
import { PlannedMovement, plannedMovementApi } from "@/lib/api/bank/planned-api"
import { formatBalance } from "@/lib/util/converter"
import { useTotalBalance } from "@/hooks/use-total-balance"
import { useMonthIncome } from "@/hooks/use-month-income"
import { useMonthExpenses } from "@/hooks/use-month-expenses"
import { useUpcomingPlanned } from "@/hooks/use-upcoming-planned"
import { useBalanceTrend } from "@/hooks/use-balance-trend"

export default function LandingMobile() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [ movements, setMovements ] = useState<Movement[]>([])
  const [ plannedMovements, setPlannedMovements ] = useState<PlannedMovement[]>([])
  const [ accounts, setAccounts ] = useState<BankAccount[]>([])
  const [ loading, setLoading ] = useState(true)
  
  const { totalBalance } = useTotalBalance(user?.id)
  const { monthIncome } = useMonthIncome(user?.id)
  const { monthExpenses } = useMonthExpenses(user?.id)
  const { upcomingPlanned: cachedUpcomingPlanned } = useUpcomingPlanned(user?.id)
  const { balanceTrend: cachedBalanceTrend } = useBalanceTrend(user?.id)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        const accountsResult = await bankAccountApi.getByUserId(user.id)
        if (accountsResult.data) {
          setAccounts(accountsResult.data)
          
          const allMovements: Movement[] = []
          const allPlannedMovements: PlannedMovement[] = []
          
          for (const account of accountsResult.data) {
            if (account.id) {
              const movementsResult = await movementApi.getByAccountId(account.id)
              if (movementsResult.data) {
                allMovements.push(...movementsResult.data)
              }
              
              const plannedResult = await plannedMovementApi.getByAccountId(account.id)
              if (plannedResult.data) {
                allPlannedMovements.push(...plannedResult.data)
              }
            }
          }
          setMovements(allMovements)
          setPlannedMovements(allPlannedMovements)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  const chartConfig = useMemo(() => ({
    balance: {
      label: "Balance",
      color: getThemeColors(theme).primary,
    },
  }), [theme]) satisfies ChartConfig

  const stats = useMemo(() => {
    const calculatedBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
    
    return {
      totalBalance: totalBalance ?? calculatedBalance,
      monthIncome: monthIncome ?? 0,
      monthExpenses: monthExpenses ?? 0
    }
  }, [accounts, totalBalance, monthIncome, monthExpenses])

  const upcomingPlanned = cachedUpcomingPlanned ?? []
  
  const plannedStats = useMemo(() => {
    const totalIncome = upcomingPlanned.filter(pm => pm.type === 'INCOME').reduce((sum, pm) => sum + pm.amount, 0)
    const totalExpenses = upcomingPlanned.filter(pm => pm.type === 'EXPENSE').reduce((sum, pm) => sum + Math.abs(pm.amount), 0)
    return { totalIncome, totalExpenses, count: upcomingPlanned.length }
  }, [upcomingPlanned])

  const balanceTrend = cachedBalanceTrend ?? []

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted to-background pb-32">
        <div className="px-6 pt-8 pb-4">
          <h1 className="text-4xl font-bold text-foreground">Finance</h1>
        </div>
        <div className="px-6 space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card rounded-3xl p-6 shadow-sm border border-border animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (accounts.length === 0) {
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-foreground">Finance</h1>
        </div>

        {/* Hero Text */}
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {stats.monthIncome >= stats.monthExpenses ? "You're on Track" : "Watch Spending"}
          </h2>
          <h3 className="text-3xl font-light text-muted-foreground">
            this month
          </h3>
        </div>
      </div>

      {/* Total Balance Card */}
      <div className="px-6 mb-6">
        <div className={`p-6 shadow-lg ${getCardStyle(theme)}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-white/70" />
            <p className="text-sm text-white/70">Total Balance</p>
          </div>
          <p className="text-4xl font-bold text-white mb-1">
            {formatBalance(stats.totalBalance)}
          </p>
          <p className="text-sm text-white/70">
            across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Balance Trend Chart with Future Projection */}
      <div className="px-6 mb-6">
        <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-foreground">Balance Trend</p>
          </div>
          
          <ChartContainer config={chartConfig} className="h-[10rem] w-full">
            <AreaChart data={balanceTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                content={<ChartTooltipContent 
                  hideLabel 
                  formatter={(value, name) => {
                    return [`${formatBalance(value as number)}`, name === 'actual' ? 'Current' : 'Projected']
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

      {/* Upcoming Planned Movements Card */}
      {upcomingPlanned.length > 0 && (
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
              <span className={`text-base font-bold ${plannedStats.totalIncome - plannedStats.totalExpenses >= 0 ? 'text-ok-foreground' : 'text-nok-foreground'}`}>
                {plannedStats.totalIncome - plannedStats.totalExpenses >= 0 ? '+' : ''}{formatBalance(plannedStats.totalIncome - plannedStats.totalExpenses)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Income & Expense Cards */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          
          {/* Income Card */}
          <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Income</p>
              <div className="w-8 h-8 bg-ok/20 rounded-full flex items-center justify-center">
                <ArrowUpRight size={16} className="text-ok-foreground" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatBalance(stats.monthIncome)}</p>
            <p className="text-xs text-muted-foreground mt-1">this month</p>
          </div>

          {/* Expense Card */}
          <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Expenses</p>
              <div className="w-8 h-8 bg-nok/20 rounded-full flex items-center justify-center">
                <ArrowDownRight size={16} className="text-nok-foreground" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatBalance(stats.monthExpenses)}</p>
            <p className="text-xs text-muted-foreground mt-1">this month</p>
          </div>
        </div>
      </div>
    </div>
  )
}