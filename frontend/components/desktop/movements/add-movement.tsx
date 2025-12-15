'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { movementApi, MovementType, MovementStatus, MovementCategory } from "@/lib/api/bank/movements-api"
import { BankAccount, bankAccountApi } from "@/lib/api/bank/accounts-api"
import { getButtonStyle } from "@/lib/themes"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { formatBalance } from "@/lib/util/converter"
import { format } from "date-fns"

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

export default function AddMovementDesktop() {
  const router = useRouter()
  const { theme } = useTheme()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    accountId: 0,
    description: '',
    amount: 0,
    type: 'EXPENSE' as MovementType,
    category: 'OTHER' as MovementCategory,
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'CONFIRMED' as MovementStatus
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.accountId) {
      alert('Please select an account')
      return
    }

    try {
      setSaving(true)
      
      await movementApi.create({
        ...formData,
        amount: formData.type === 'EXPENSE' ? -Math.abs(formData.amount) : Math.abs(formData.amount)
      })
      router.push('/movements')
    } catch (error) {
      console.error('Error creating movement:', error)
      alert('Failed to create transaction')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/movements')
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
              <h1 className="text-4xl font-bold text-foreground mb-2">Add Transaction</h1>
              <p className="text-lg text-muted-foreground">Create a new transaction</p>
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Add Transaction</h1>
            <p className="text-lg text-muted-foreground">Create a new transaction</p>
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
                    placeholder="e.g., Grocery shopping"
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

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base font-semibold">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PENDING">Pending</option>
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
                        Create Transaction
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
              
              {/* Transaction Preview Card */}
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
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(formData.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex gap-2 flex-wrap">
                  <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700">
                    {formData.category.replace(/_/g, ' ')}
                  </span>
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    formData.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {formData.type}
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

              {/* Info Box */}
              <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Tip:</strong> The preview shows how your transaction will appear in the transactions list.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
