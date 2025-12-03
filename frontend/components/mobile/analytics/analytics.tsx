'use client'

import { useState, useEffect, useMemo } from 'react'
import { TrendingUp, TrendingDown, Calendar, Wallet, BarChart3 } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { useAuth } from '@/contexts/auth-context'
import { getThemeButtonStyle, getButtonStyle } from '@/lib/themes'
import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear,
   subDays, subWeeks, subMonths, subYears, format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isWithinInterval } from 'date-fns'
import { Movement, movementApi, MovementCategory } from '@/lib/api/bank/movements-api'
import { BankAccount, bankAccountApi } from '@/lib/api/bank/accounts-api'
import { formatBalance } from '@/lib/util/converter'

type TimeFilter = 'day' | 'week' | 'month' | 'year'

interface ChartDataPoint {
  label: string
  income: number
  expense: number
}

interface CategoryData {
  name: string
  amount: number
  percentage: number
  category: MovementCategory
}

const CATEGORY_LABELS: Record<MovementCategory, string> = {
  // Transfers
  TRANSFER: 'Transfer',
  
  // Housing
  RENT: 'Rent',
  PROPERTY_TAXES: 'Property Taxes',
  HOME_MAINTENANCE_REPAIRS: 'Home Maintenance',
  HOME_INSURANCE: 'Home Insurance',
  HOUSEHOLD_SUPPLIES_FURNITURE: 'Household Items',
  
  // Transportation
  FUEL: 'Fuel',
  PUBLIC_TRANSPORT: 'Public Transport',
  UBER: 'Uber',
  CAR_MAINTENANCE: 'Car Maintenance',
  PARKING: 'Parking',
  VEHICLE_INSURANCE: 'Vehicle Insurance',
  TOLLS: 'Tolls',
  
  // Shopping
  SHOPPING: 'Shopping',
  CLOTHING: 'Clothing',
  ELECTRONICS: 'Electronics',
  GIFTS: 'Gifts',
  BEAUTY_COSMETICS: 'Beauty',
  
  // Food & Dining
  GROCERIES: 'Groceries',
  RESTAURANTS: 'Restaurants',
  FAST_FOOD: 'Fast Food',
  COFFEE_SHOPS: 'Coffee Shops',
  ALCOHOL_BARS: 'Alcohol & Bars',
  FOOD_DRINKS: 'Food & Drinks',
  
  // Entertainment
  ENTERTAINMENT: 'Entertainment',
  MOVIES: 'Movies',
  EVENTS: 'Events',
  GAMES: 'Games',
  NIGHTLIFE: 'Nightlife',
  HOBBIES: 'Hobbies',
  GYM: 'Gym',
  
  // Technology & Services
  TECH: 'Technology',
  SOFTWARE_SUBSCRIPTIONS: 'Software',
  INTERNET_SERVICES: 'Internet Services',
  MOBILE_PHONE_PLANS: 'Mobile Plans',
  NET: 'Internet',
  
  // Utilities
  UTILITIES: 'Utilities',
  WATER: 'Water',
  ELECTRICITY: 'Electricity',
  GAS: 'Gas',
  
  // Business
  OFFICE_SUPPLIES: 'Office Supplies',
  BUSINESS_TRAVEL: 'Business Travel',
  PROFESSIONAL_SERVICES: 'Professional',
  
  // Education
  EDUCATION: 'Education',
  ONLINE_COURSES: 'Online Courses',
  CLASSES: 'Classes',
  
  // Insurance
  HEALTH_INSURANCE: 'Health Insurance',
  CAR_INSURANCE: 'Car Insurance',
  LIFE_INSURANCE: 'Life Insurance',
  TRAVEL_INSURANCE: 'Travel Insurance',
  
  // Health & Medical
  HEALTH: 'Health',
  PHARMACY: 'Pharmacy',
  MEDICAL: 'Medical',
  THERAPY: 'Therapy',
  
  // Pets
  PET_FOOD: 'Pet Food',
  VET_VISITS: 'Vet Visits',
  PET_ACCESSORIES: 'Pet Accessories',
  PET_GROOMING: 'Pet Grooming',
  
  // Banking & Investments
  BANK_FEES: 'Bank Fees',
  INVESTMENTS: 'Investments',
  
  // Streaming & Subscriptions
  STREAMING_SERVICES: 'Streaming',
  VIDEO_STREAMING: 'Video Streaming',
  MUSIC_STREAMING: 'Music Streaming',
  CLOUD_STORAGE: 'Cloud Storage',
  DIGITAL_MAGAZINES: 'Digital Magazines',
  NEWS_SUBSCRIPTIONS: 'News',
  
  // Travel
  HOTELS: 'Hotels',
  FLIGHTS: 'Flights',
  CAR_RENTAL: 'Car Rental',
  TOURS: 'Tours',
  
  // Income
  SALARY: 'Salary',
  FREELANCING: 'Freelancing',
  INVESTMENT_INCOME: 'Investment Income',
  REFUNDS: 'Refunds',
  RENTAL_INCOME: 'Rental Income',
  
  // General
  OTHER: 'Other'
}

const CATEGORY_COLORS: Record<MovementCategory, string> = {
  // Transfers
  TRANSFER: 'bg-slate-500',
  
  // Housing
  RENT: 'bg-amber-600',
  PROPERTY_TAXES: 'bg-amber-700',
  HOME_MAINTENANCE_REPAIRS: 'bg-orange-600',
  HOME_INSURANCE: 'bg-orange-500',
  HOUSEHOLD_SUPPLIES_FURNITURE: 'bg-yellow-600',
  
  // Transportation
  FUEL: 'bg-green-600',
  PUBLIC_TRANSPORT: 'bg-green-500',
  UBER: 'bg-emerald-500',
  CAR_MAINTENANCE: 'bg-teal-600',
  PARKING: 'bg-teal-500',
  VEHICLE_INSURANCE: 'bg-cyan-600',
  TOLLS: 'bg-cyan-500',
  
  // Shopping
  SHOPPING: 'bg-purple-500',
  CLOTHING: 'bg-purple-600',
  ELECTRONICS: 'bg-indigo-600',
  GIFTS: 'bg-pink-400',
  BEAUTY_COSMETICS: 'bg-fuchsia-500',
  
  // Food & Dining
  GROCERIES: 'bg-orange-500',
  RESTAURANTS: 'bg-red-500',
  FAST_FOOD: 'bg-red-600',
  COFFEE_SHOPS: 'bg-amber-500',
  ALCOHOL_BARS: 'bg-rose-600',
  FOOD_DRINKS: 'bg-orange-500',
  
  // Entertainment
  ENTERTAINMENT: 'bg-pink-500',
  MOVIES: 'bg-violet-500',
  EVENTS: 'bg-fuchsia-600',
  GAMES: 'bg-indigo-500',
  NIGHTLIFE: 'bg-purple-700',
  HOBBIES: 'bg-pink-600',
  GYM: 'bg-red-500',
  
  // Technology & Services
  TECH: 'bg-cyan-500',
  SOFTWARE_SUBSCRIPTIONS: 'bg-sky-500',
  INTERNET_SERVICES: 'bg-blue-600',
  MOBILE_PHONE_PLANS: 'bg-blue-500',
  NET: 'bg-blue-500',
  
  // Utilities
  UTILITIES: 'bg-yellow-500',
  WATER: 'bg-blue-400',
  ELECTRICITY: 'bg-yellow-400',
  GAS: 'bg-orange-400',
  
  // Business
  OFFICE_SUPPLIES: 'bg-slate-600',
  BUSINESS_TRAVEL: 'bg-slate-500',
  PROFESSIONAL_SERVICES: 'bg-gray-600',
  
  // Education
  EDUCATION: 'bg-indigo-500',
  ONLINE_COURSES: 'bg-indigo-600',
  CLASSES: 'bg-violet-600',
  
  // Insurance
  HEALTH_INSURANCE: 'bg-emerald-600',
  CAR_INSURANCE: 'bg-teal-700',
  LIFE_INSURANCE: 'bg-cyan-700',
  TRAVEL_INSURANCE: 'bg-sky-600',
  
  // Health & Medical
  HEALTH: 'bg-red-500',
  PHARMACY: 'bg-red-600',
  MEDICAL: 'bg-rose-600',
  THERAPY: 'bg-pink-600',
  
  // Pets
  PET_FOOD: 'bg-amber-500',
  VET_VISITS: 'bg-orange-600',
  PET_ACCESSORIES: 'bg-yellow-500',
  PET_GROOMING: 'bg-amber-400',
  
  // Banking & Investments
  BANK_FEES: 'bg-slate-700',
  INVESTMENTS: 'bg-green-600',
  
  // Streaming & Subscriptions
  STREAMING_SERVICES: 'bg-rose-500',
  VIDEO_STREAMING: 'bg-red-500',
  MUSIC_STREAMING: 'bg-purple-500',
  CLOUD_STORAGE: 'bg-sky-500',
  DIGITAL_MAGAZINES: 'bg-blue-600',
  NEWS_SUBSCRIPTIONS: 'bg-indigo-600',
  
  // Travel
  HOTELS: 'bg-teal-500',
  FLIGHTS: 'bg-sky-600',
  CAR_RENTAL: 'bg-cyan-600',
  TOURS: 'bg-emerald-500',
  
  // Income
  SALARY: 'bg-green-600',
  FREELANCING: 'bg-emerald-600',
  INVESTMENT_INCOME: 'bg-teal-600',
  REFUNDS: 'bg-lime-500',
  RENTAL_INCOME: 'bg-green-500',
  
  // General
  OTHER: 'bg-gray-500'
}

export function AnalyticsMobile() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month')
  const [movements, setMovements] = useState<Movement[]>([])
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch all accounts and movements for the user
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        
        // Fetch user accounts
        const accountsResult = await bankAccountApi.getByUserId(user.id)
        if (accountsResult.data) {
          setAccounts(accountsResult.data)
          
          // Fetch movements for all accounts
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
        return {
          current: { start: startOfDay(now), end: endOfDay(now) },
          previous: { start: startOfDay(subDays(now, 1)), end: endOfDay(subDays(now, 1)) }
        }
      case 'week':
        return {
          current: { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) },
          previous: { start: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }), end: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }) }
        }
      case 'month':
        return {
          current: { start: startOfMonth(now), end: endOfMonth(now) },
          previous: { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) }
        }
      case 'year':
        return {
          current: { start: startOfYear(now), end: endOfYear(now) },
          previous: { start: startOfYear(subYears(now, 1)), end: endOfYear(subYears(now, 1)) }
        }
    }
  }, [timeFilter])

  // Filter movements by date range
  const filterMovementsByRange = (movs: Movement[], range: { start: Date, end: Date }) => {
    return movs.filter(m => {
      const date = new Date(m.date)
      return isWithinInterval(date, { start: range.start, end: range.end })
    })
  }

  // Calculate stats
  const stats = useMemo(() => {
    const currentMovements = filterMovementsByRange(movements, dateRanges.current)
    const previousMovements = filterMovementsByRange(movements, dateRanges.previous)
    
    // Exclude TRANSFER category from analytics
    const currentIncome = currentMovements
      .filter(m => m.type === 'INCOME' && m.status === 'CONFIRMED' && m.category !== 'TRANSFER')
      .reduce((sum, m) => sum + m.amount, 0)
    
    const currentExpenses = currentMovements
      .filter(m => m.type === 'EXPENSE' && m.status === 'CONFIRMED' && m.category !== 'TRANSFER')
      .reduce((sum, m) => sum + Math.abs(m.amount), 0)
    
    const previousIncome = previousMovements
      .filter(m => m.type === 'INCOME' && m.status === 'CONFIRMED' && m.category !== 'TRANSFER')
      .reduce((sum, m) => sum + m.amount, 0)
    
    const previousExpenses = previousMovements
      .filter(m => m.type === 'EXPENSE' && m.status === 'CONFIRMED' && m.category !== 'TRANSFER')
      .reduce((sum, m) => sum + Math.abs(m.amount), 0)
    
    const incomeChange = previousIncome > 0 
      ? ((currentIncome - previousIncome) / previousIncome) * 100 
      : currentIncome > 0 ? 100 : 0
    
    const expenseChange = previousExpenses > 0 
      ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 
      : currentExpenses > 0 ? 100 : 0
    
    return {
      totalIncome: currentIncome,
      totalExpenses: currentExpenses,
      netBalance: currentIncome - currentExpenses,
      incomeChange: Number(incomeChange.toFixed(1)),
      expenseChange: Number(expenseChange.toFixed(1))
    }
  }, [movements, dateRanges])

  // Generate chart data
  const chartData = useMemo((): ChartDataPoint[] => {
    const currentMovements = filterMovementsByRange(movements, dateRanges.current)
    
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
        const days = eachDayOfInterval({ start: dateRanges.current.start, end: dateRanges.current.end })
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
        const weeks = eachWeekOfInterval({ start: dateRanges.current.start, end: dateRanges.current.end }, { weekStartsOn: 1 })
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
        const months = eachMonthOfInterval({ start: dateRanges.current.start, end: dateRanges.current.end })
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

  // Calculate category breakdown
  const categoryData = useMemo((): CategoryData[] => {
    const currentMovements = filterMovementsByRange(movements, dateRanges.current)
    const expenses = currentMovements.filter(m => m.type === 'EXPENSE' && m.status === 'CONFIRMED')
    
    const categoryTotals = expenses.reduce((acc, m) => {
      acc[m.category] = (acc[m.category] || 0) + Math.abs(m.amount)
      return acc
    }, {} as Record<MovementCategory, number>)
    
    const totalExpenses = Object.values(categoryTotals).reduce((s, v) => s + v, 0)
    
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: CATEGORY_LABELS[category as MovementCategory],
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
        category: category as MovementCategory
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6)
  }, [movements, dateRanges])

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
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`py-2 rounded-xl text-sm font-semibold transition-all ${
                timeFilter === filter
                  ? `${getButtonStyle(theme)} shadow-md`
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
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