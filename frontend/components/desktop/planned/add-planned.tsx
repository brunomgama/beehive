'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, ArrowUpRight, ArrowDownRight, Calendar, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { plannedMovementApi, MovementType, MovementStatus, MovementCategory, MovementRecurrence } from "@/lib/api/bank/planned-api"
import { BankAccount, bankAccountApi } from "@/lib/api/bank/accounts-api"
import { getButtonStyle } from "@/lib/themes"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { formatBalance } from "@/lib/util/converter"
import { format, addMonths, addWeeks, addDays, addYears } from "date-fns"

const CATEGORIES: MovementCategory[] = [
  'SALARY', 'FREELANCING', 'INVESTMENT_INCOME', 'REFUNDS', 'RENTAL_INCOME',
  'RENT', 'GROCERIES', 'RESTAURANTS', 'FAST_FOOD', 'COFFEE_SHOPS',
  'FUEL', 'PUBLIC_TRANSPORT', 'UBER', 'CAR_MAINTENANCE',
  'SHOPPING', 'CLOTHING', 'ELECTRONICS', 'GIFTS',
  'ENTERTAINMENT', 'MOVIES', 'EVENTS', 'GYM', 'HOBBIES',
  'UTILITIES', 'WATER', 'ELECTRICITY', 'GAS',
  'HEALTH', 'PHARMACY', 'MEDICAL',
  'STREAMING_SERVICES', 'SOFTWARE_SUBSCRIPTIONS',
  'TRANSFER', 'BANK_FEES', 'INVESTMENTS', 'OTHER'
]

const RECURRENCE_OPTIONS: { value: MovementRecurrence; label: string }[] = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
  { value: 'CUSTOM', label: 'Custom' }
]

const getCronExpression = (recurrence: MovementRecurrence, date: Date): string => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const dayOfWeek = date.getDay()
  
  switch (recurrence) {
    case 'DAILY':
      return '0 0 * * *'
    case 'WEEKLY':
      return `0 0 * * ${dayOfWeek}`
    case 'MONTHLY':
      return `0 0 ${day} * *`
    case 'YEARLY':
      return `0 0 ${day} ${month} *`
    case 'CUSTOM':
      return '0 0 * * *'
    default:
      return '0 0 * * *'
  }
}

const getDefaultEndDate = (recurrence: MovementRecurrence, startDate: Date): Date => {
  switch (recurrence) {
    case 'DAILY':
      return addMonths(startDate, 1)
    case 'WEEKLY':
      return addMonths(startDate, 3)
    case 'MONTHLY':
      return addYears(startDate, 1)
    case 'YEARLY':
      return addYears(startDate, 5)
    case 'CUSTOM':
      return addMonths(startDate, 1)
    default:
      return addMonths(startDate, 1)
  }
}

export default function AddPlannedDesktop() {
  const router = useRouter()
  const { theme } = useTheme()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  
  const today = new Date()
  const [formData, setFormData] = useState({
    accountId: 0,
    description: '',
    amount: 0,
    type: 'EXPENSE' as MovementType,
    category: 'OTHER' as MovementCategory,
    recurrence: 'MONTHLY' as MovementRecurrence,
    nextExecution: format(today, 'yyyy-MM-dd'),
    endDate: format(addYears(today, 1), 'yyyy-MM-dd'),
    status: 'PENDING' as MovementStatus
  })

  useEffect(() => {
    fetchAccounts()
  }, [user?.id])

  const fetchAccounts = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const result = await bankAccountApi.getByUserId(user.id)
      if (result.data && result.data.length > 0) {
        setAccounts(result.data)
        setFormData(prev => ({ ...prev, accountId: result.data![0].id! }))
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRecurrenceChange = (recurrence: MovementRecurrence) => {
    const startDate = new Date(formData.nextExecution)
    const endDate = getDefaultEndDate(recurrence, startDate)
    setFormData({
      ...formData,
      recurrence,
      endDate: format(endDate, 'yyyy-MM-dd')
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.accountId) {
      alert('Please select an account')
      return
    }

    try {
      setSaving(true)
      
      const cron = getCronExpression(formData.recurrence, new Date(formData.nextExecution))
      
      await plannedMovementApi.create({
        ...formData,
        cron,
        amount: formData.type === 'EXPENSE' ? -Math.abs(formData.amount) : Math.abs(formData.amount)
      })
      router.push('/planned')
    } catch (error) {
      console.error('Error creating planned movement:', error)
      alert('Failed to create planned transaction')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/planned')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background">
        <div className="sticky top-0 z-50 bg-gradient-to-br from-muted/30 to-background backdrop-blur-xl border-b p-8">
          <div className="flex items-center gap-4">
            <Button onClick={handleCancel} variant="ghost" className="h-12 w-12 p-0 rounded-full hover:bg-white/20">
              <ArrowLeft size={24} />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Add Planned Transaction</h1>
              <p className="text-lg text-muted-foreground">Create a recurring transaction</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-muted/30 to-background backdrop-blur-xl border-b p-8">
        <div className="flex items-center gap-4">
          <Button onClick={handleCancel} variant="ghost" className="h-12 w-12 p-0 rounded-full hover:bg-white/20">
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Add Planned Transaction</h1>
            <p className="text-lg text-muted-foreground">Create a recurring transaction</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-8">
        <div className="grid grid-cols-2 gap-8 w-full">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="rounded-3xl backdrop-blur-xl border bg-white/30 p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Transaction Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Selection */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Transaction Type</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                      className={`h-14 rounded-xl font-semibold transition-all ${
                        formData.type === 'EXPENSE'
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <ArrowDownRight size={20} className="mr-2" />
                      Expense
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                      className={`h-14 rounded-xl font-semibold transition-all ${
                        formData.type === 'INCOME'
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <ArrowUpRight size={20} className="mr-2" />
                      Income
                    </Button>
                  </div>
                </div>

                {/* Account */}
                <div className="space-y-2">
                  <Label htmlFor="account" className="text-base font-semibold">Account</Label>
                  <select
                    id="account"
                    value={formData.accountId}
                    onChange={(e) => setFormData({ ...formData, accountId: parseInt(e.target.value) })}
                    className="w-full h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm px-4"
                    required
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.accountName} ({formatBalance(account.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                  <Input
                    id="description"
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm"
                    placeholder="e.g., Netflix Subscription"
                    required
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-base font-semibold">Amount</Label>
                  <Input
                    id="amount"
                    type="text"
                    inputMode="decimal"
                    value={formData.amount.toFixed(2)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.-]/g, '');
                      const parsed = parseFloat(value);
                      if (!isNaN(parsed)) {
                        setFormData({ ...formData, amount: Math.round(parsed * 100) / 100 });
                      } else if (value === '' || value === '-') {
                        setFormData({ ...formData, amount: 0 });
                      }
                    }}
                    className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-base font-semibold">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as MovementCategory })}
                    className="w-full h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm px-4"
                    required
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recurrence */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Recurrence</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {RECURRENCE_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        onClick={() => handleRecurrenceChange(option.value)}
                        className={`h-12 rounded-xl font-medium transition-all ${
                          formData.recurrence === option.value
                            ? getButtonStyle(theme)
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full'
                        }`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Next Execution Date */}
                <div className="space-y-2">
                  <Label htmlFor="nextExecution" className="text-base font-semibold">First Execution Date</Label>
                  <Input
                    id="nextExecution"
                    type="date"
                    value={formData.nextExecution}
                    onChange={(e) => setFormData({ ...formData, nextExecution: e.target.value })}
                    className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-base font-semibold">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-base font-semibold">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as MovementStatus })}
                    className="w-full h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm px-4"
                    required
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 h-14 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-base rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className={`flex-1 h-14 ${getButtonStyle(theme)} font-bold text-base rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-5 w-5" />
                        Create Planned Transaction
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="rounded-3xl backdrop-blur-xl border bg-white/30 p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Preview</h2>
              
              {/* Planned Transaction Preview Card */}
              <div className="rounded-2xl border bg-background p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    formData.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {formData.type === 'INCOME' ? (
                      <ArrowUpRight size={24} className="text-green-700" />
                    ) : (
                      <ArrowDownRight size={24} className="text-red-700" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">
                      {formData.description || 'Transaction Description'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {accounts.find(a => a.id === formData.accountId)?.accountName || 'Select Account'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      formData.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formData.type === 'INCOME' ? '+' : '-'}{formatBalance(Math.abs(formData.amount))}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {formData.recurrence.toLowerCase()}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t space-y-3">
                  {/* Schedule Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Repeat size={16} />
                      <span className="capitalize">{formData.recurrence.toLowerCase()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>Starts {format(new Date(formData.nextExecution), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={16} />
                    <span>Ends {format(new Date(formData.endDate), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap pt-2">
                    <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700">
                      {formData.category.replace(/_/g, ' ')}
                    </span>
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      formData.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {formData.type}
                    </span>
                    <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-700">
                      {formData.recurrence}
                    </span>
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      formData.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      formData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {formData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
