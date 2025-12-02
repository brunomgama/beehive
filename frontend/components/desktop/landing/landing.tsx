'use client'

import { useState, useEffect, useMemo } from "react"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Calendar, CreditCard } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { getCardStyle, getThemeColors } from "@/lib/themes"
import { startOfMonth, endOfMonth, isWithinInterval, eachDayOfInterval, format, subDays } from "date-fns"
import { XAxis, YAxis, Area, AreaChart } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/line-chart"
import { Button } from "@/components/ui/button"
import { Movement, movementApi } from "@/lib/api/bank/movements-api"
import { BankAccount, bankAccountApi } from "@/lib/api/bank/accounts-api"
import { formatBalance } from "@/lib/util/converter"

export default function LandingDesktop() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [movements, setMovements] = useState<Movement[]>([])
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)

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
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    
    const monthMovements = movements.filter(m => {
      const date = new Date(m.date)
      return isWithinInterval(date, { start: monthStart, end: monthEnd }) && m.status === 'CONFIRMED'
    })
    
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
    const monthIncome = monthMovements.filter(m => m.type === 'INCOME').reduce((sum, m) => sum + m.amount, 0)
    const monthExpenses = monthMovements.filter(m => m.type === 'EXPENSE').reduce((sum, m) => sum + Math.abs(m.amount), 0)
    
    return { totalBalance, monthIncome, monthExpenses }
  }, [movements, accounts])

  const balanceTrend = useMemo(() => {
    const now = new Date()
    const startDate = subDays(now, 29)
    const days = eachDayOfInterval({ start: startDate, end: now })
    
    const currentBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
    const confirmedMovements = movements.filter(m => m.status === 'CONFIRMED')
    
    const balanceByDay = days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const futureMovements = confirmedMovements.filter(m => {
        const movDate = format(new Date(m.date), 'yyyy-MM-dd')
        return movDate > dayStr
      })
      
      let dayBalance = currentBalance
      futureMovements.forEach(m => {
        if (m.type === 'INCOME') {
          dayBalance -= m.amount
        } else {
          dayBalance += Math.abs(m.amount)
        }
      })
      
      return {
        date: format(day, 'MMM d'),
        balance: dayBalance
      }
    })
    
    return balanceByDay
  }, [movements, accounts])

  const recentMovements = useMemo(() => {
    return movements
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8)
  }, [movements])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-span-3 bg-card rounded-3xl p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto">
          <div className="bg-card rounded-3xl p-12 text-center">
            <Wallet className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-3">Welcome to BeeHive!</h2>
            <p className="text-lg text-muted-foreground">Add your first bank account to get started</p>
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
              {stats.monthIncome >= stats.monthExpenses ? "You're on track this month" : "Watch your spending this month"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-card rounded-2xl px-4 py-2">
              <span className="text-sm text-muted-foreground">Current Month</span>
              <p className="text-lg font-bold text-foreground">{format(new Date(), 'MMMM yyyy')}</p>
            </div>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Total Balance - Theme Glass Card with True Transparency */}
          <div className="col-span-4 relative rounded-3xl p-8 shadow-xl overflow-hidden backdrop-blur-2xl">
            {/* Transparent gradient background - reduced opacity for see-through effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getCardStyle(theme)} opacity-40`}></div>
            
            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <TrendingUp size={24} className="drop-shadow-lg" />
                </div>
                <div>
                  <p className="text-sm font-medium drop-shadow">Total Balance</p>
                  <p className="text-xs drop-shadow">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <p className="text-5xl font-bold mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                {formatBalance(stats.totalBalance)}
              </p>
              <div className="flex items-center gap-2 mt-4 drop-shadow">
                <Calendar size={16} />
                <span className="text-sm">Updated just now</span>
              </div>
            </div>
            
            {/* Inner glow for glass effect */}
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_rgba(255,255,255,0.1)] pointer-events-none"></div>
          </div>

          {/* Income Card - True White Glass with Transparency */}
          <div className="col-span-4 relative rounded-3xl p-8 shadow-lg overflow-hidden backdrop-blur-2xl">
            {/* Transparent white background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/20"></div>
            
            {/* Subtle white blur elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
            
            {/* Content */}
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
                {formatBalance(stats.monthIncome)}
              </p>
              <div className="flex items-center gap-2 text-ok text-sm font-medium drop-shadow-sm">
                <span>+12% from last month</span>
              </div>
            </div>
            
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.2)] pointer-events-none"></div>
          </div>

          {/* Expense Card - True White Glass with Transparency */}
          <div className="col-span-4 relative rounded-3xl p-8 shadow-lg overflow-hidden backdrop-blur-2xl">
            {/* Transparent white background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/20"></div>
            
            {/* Subtle white blur elements */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
            
            {/* Content */}
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
                {formatBalance(stats.monthExpenses)}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium drop-shadow-sm">
                <span>-5% from last month</span>
              </div>
            </div>
            
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.2)] pointer-events-none"></div>
          </div>
        </div>

        {/* Chart and Details Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Balance Trend Chart - True White Glass with Transparency */}
          <div className="col-span-8 relative rounded-3xl p-8 shadow-lg overflow-hidden backdrop-blur-2xl">
            {/* Transparent white background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/20"></div>
            
            {/* Decorative blur elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold drop-shadow-sm">Balance Trend</h3>
                  <p className="text-sm drop-shadow-sm">Last 30 days overview</p>
                </div>
              </div>
              
              <ChartContainer config={chartConfig} className="h-[20rem] w-full">
                <AreaChart data={balanceTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={getThemeColors(theme).primary} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={getThemeColors(theme).primary} stopOpacity={0.05} />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={12} tick={{ fontSize: 12, fill: getThemeColors(theme).secondary }} 
                  interval="preserveStartEnd"/>
                  <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel 
                      formatter={(value) => formatBalance(value as number)}/>} />
                  <Area type="monotone" dataKey="balance" stroke={getThemeColors(theme).primary} strokeWidth={3}
                   fill="url(#balanceGradient)" filter="url(#glow)" />
                </AreaChart>
              </ChartContainer>
            </div>
            
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_rgba(255,255,255,0.2)] pointer-events-none"></div>
          </div>

          {/* Net Summary & Quick Stats */}
          <div className="col-span-4 space-y-6">
            
            {/* Net Summary - True Theme Glass with Transparency */}
            <div className="relative rounded-3xl p-6 shadow-lg overflow-hidden backdrop-blur-2xl">
              {/* Transparent gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stats.monthIncome - stats.monthExpenses >= 0 ? 'from-green-400 to-emerald-500' : 'from-red-400 to-rose-500'} opacity-40`}>
              </div>
              
              {/* Decorative blur elements */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/15 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/15 rounded-full blur-3xl"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium mb-1 drop-shadow">Net This Month</p>
                    <p className="text-3xl font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                      {stats.monthIncome - stats.monthExpenses >= 0 ? '+' : ''}
                      {formatBalance(stats.monthIncome - stats.monthExpenses)}
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
                    {stats.monthIncome - stats.monthExpenses >= 0 ? (
                      <TrendingUp size={32} className="drop-shadow-lg" />
                    ) : (
                      <ArrowDownRight size={32} className="drop-shadow-lg" />
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="drop-shadow">Savings Rate</span>
                    <span className="font-bold drop-shadow">
                      {stats.monthIncome > 0 ? Math.round(((stats.monthIncome - stats.monthExpenses) / stats.monthIncome) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.15)] pointer-events-none"></div>
            </div>

            {/* Accounts Overview - Solid Card */}
            <div className="rounded-3xl p-6 border border-border shadow-sm" style={{ backgroundColor: "var(--card-darker)" }}>
              <div className="flex items-center gap-3 mb-4">
                <CreditCard size={20} className="text-muted-foreground" />
                <h3 className="text-lg font-bold text-foreground">Your Accounts</h3>
              </div>
              <div className="space-y-3">
                {accounts.slice(0, 3).map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{account.accountName}</p>
                      <p className="text-xs text-muted-foreground">{account.type}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">{formatBalance(account.balance)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions - Solid Card */}
        <div className="rounded-3xl p-8 border border-border shadow-sm" style={{ backgroundColor: "var(--card-darker)" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Recent Transactions</h3>
              <p className="text-sm text-muted-foreground">Your latest financial activity</p>
            </div>
            <Button className="px-4 py-2 rounded-xl bg-muted/50 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {recentMovements.map((movement) => (
              <div key={movement.id} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all hover:shadow-sm cursor-pointer">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${movement.type === 'INCOME' ? 'bg-ok/10' : 'bg-nok/10'}`} >
                  {movement.type === 'INCOME' ? (
                    <ArrowUpRight size={20} className="text-ok" />
                  ) : (
                    <ArrowDownRight size={20} className="text-nok" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {movement.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{format(new Date(movement.date), 'MMM dd, yyyy')}</span>
                    <span>•</span>
                    <span className="capitalize">{movement.category.toLowerCase()}</span>
                  </div>
                </div>

                <p className={`text-lg font-bold ${movement.type === 'INCOME' ? 'text-ok' : 'text-foreground'}`} >
                  {movement.type === 'INCOME' ? '+' : '-'}
                  {formatBalance(Math.abs(movement.amount))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}