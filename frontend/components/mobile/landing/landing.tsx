'use client'

import { useState, useEffect, useMemo } from "react"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { getCardStyle, getThemeColors } from "@/lib/themes"
import { startOfMonth, endOfMonth, isWithinInterval, eachDayOfInterval, format, subDays } from "date-fns"
import { XAxis, YAxis, Area, AreaChart } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/line-chart"
import { Movement, movementApi } from "@/lib/api/bank/movements-api"
import { BankAccount, bankAccountApi } from "@/lib/api/bank/accounts-api"
import { formatBalance } from "@/lib/util/converter"

const chartConfig = {
  balance: {
    label: "Balance",
    color: "var(--ok)",
  },
} satisfies ChartConfig

export default function LandingMobile() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [ movements, setMovements ] = useState<Movement[]>([])
  const [ accounts, setAccounts ] = useState<BankAccount[]>([])
  const [ loading, setLoading ] = useState(true)

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

  // Generate balance trend data for the last 14 days
  const balanceTrend = useMemo(() => {
    const now = new Date()
    const startDate = subDays(now, 13)
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

      {/* Balance Trend Chart */}
      <div className="px-6 mb-6">
        <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Balance Trend</p>
          </div>
          
          <ChartContainer config={chartConfig} className="h-[150px] w-full">
            <AreaChart data={balanceTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getThemeColors(theme).primary} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={getThemeColors(theme).primary} stopOpacity={0.05} />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} 
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} interval="preserveStartEnd" tickFormatter={(value, index) => {
                  if (index === 0 || index === balanceTrend.length - 1 || index === Math.floor(balanceTrend.length / 2)) {
                    return value
                  }
                  return ''
                }}
              />
              <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel formatter={(value) => formatBalance(value as number)} />} />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke={getThemeColors(theme).primary} 
                strokeWidth={2} 
                fill="url(#balanceGradient)" 
                filter="url(#glow)" 
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

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

      {/* Net Summary */}
      <div className="px-6">
        <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Net this month</p>
              <p className={`text-2xl font-bold ${stats.monthIncome - stats.monthExpenses >= 0 ? 'text-ok-foreground' : 'text-nok-foreground'}`}>
                {stats.monthIncome - stats.monthExpenses >= 0 ? '+' : ''}{formatBalance(stats.monthIncome - stats.monthExpenses)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stats.monthIncome - stats.monthExpenses >= 0 ? 'bg-ok/20' : 'bg-nok/20'}`}>
              {stats.monthIncome - stats.monthExpenses >= 0 ? (
                <TrendingUp size={24} className="text-ok-foreground" />
              ) : (
                <ArrowDownRight size={24} className="text-nok-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}