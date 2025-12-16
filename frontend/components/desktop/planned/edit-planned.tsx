'use client'

import { ArrowLeft, Save, Loader2, ArrowUpRight, ArrowDownRight, Calendar, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getButtonStyle } from "@/lib/themes"
import { useTheme } from "@/contexts/theme-context"
import { formatBalance } from "@/lib/util/utils"
import { format } from "date-fns"
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/util/categories'
import { MovementCategory, MovementStatus, MovementRecurrence } from '@/lib/api/types'
import { usePlannedForm } from "@/hooks/planned/use-planned-form"

interface EditPlannedDesktopProps {
  plannedId: number
}

const RECURRENCE_OPTIONS: { value: MovementRecurrence; label: string }[] = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
  { value: 'CUSTOM', label: 'Custom' }
]

export default function EditPlannedDesktop({ plannedId }: EditPlannedDesktopProps) {
  const { theme } = useTheme()
  const {
    formData,
    updateField,
    handleRecurrenceChange,
    accounts,
    loading,
    saving,
    error,
    handleSubmit,
    handleCancel,
  } = usePlannedForm(plannedId)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background">
        <div className="sticky top-0 z-50 bg-gradient-to-br from-muted/30 to-background backdrop-blur-xl border-b p-8">
          <div className="flex items-center gap-4">
            <Button onClick={handleCancel} variant="ghost" className="h-12 w-12 p-0 rounded-full">
              <ArrowLeft size={24} />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Edit Planned Transaction</h1>
              <p className="text-lg text-muted-foreground">Update recurring transaction</p>
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
          <Button onClick={handleCancel} variant="ghost" className="h-12 w-12 p-0 rounded-full">
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Edit Planned Transaction</h1>
            <p className="text-lg text-muted-foreground">Update recurring transaction</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-2 gap-8 w-full">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="rounded-3xl backdrop-blur-xl border bg-white/30 p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Transaction Details</h2>
              
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Selection */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Transaction Type *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      onClick={() => updateField('type', 'EXPENSE')}
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
                      onClick={() => updateField('type', 'INCOME')}
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
                  <Label htmlFor="account" className="text-base font-semibold">Account *</Label>
                  <select
                    id="account"
                    value={formData.accountId}
                    onChange={(e) => updateField('accountId', parseInt(e.target.value))}
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
                  <Label htmlFor="description" className="text-base font-semibold">Description *</Label>
                  <Input
                    id="description"
                    type="text"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm"
                    placeholder="e.g., Monthly rent payment"
                    required
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-base font-semibold">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => updateField('amount', parseFloat(e.target.value) || 0)}
                    className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-base font-semibold">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value as MovementCategory)}
                    className="w-full h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm px-4"
                    required
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {CATEGORY_LABELS[category]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recurrence */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Recurrence *</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {RECURRENCE_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        onClick={() => handleRecurrenceChange(option.value)}
                        className={`h-12 rounded-xl font-medium transition-all ${
                          formData.recurrence === option.value
                            ? getButtonStyle(theme)
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Next Execution Date */}
                <div className="space-y-2">
                  <Label htmlFor="nextExecution" className="text-base font-semibold">Next Execution Date *</Label>
                  <Input
                    id="nextExecution"
                    type="date"
                    value={formData.nextExecution}
                    onChange={(e) => updateField('nextExecution', e.target.value)}
                    className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-base font-semibold">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateField('endDate', e.target.value)}
                    className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-base font-semibold">Status *</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => updateField('status', e.target.value as MovementStatus)}
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
                    variant="outline"
                    className="flex-1 h-14 font-bold text-base rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className={`flex-1 h-14 ${getButtonStyle(theme)} font-bold text-base rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="rounded-3xl backdrop-blur-xl border bg-white/30 p-8 shadow-xl sticky top-32">
              <h2 className="text-2xl font-bold mb-6">Preview</h2>
              
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Repeat size={16} />
                      <span className="capitalize">{formData.recurrence.toLowerCase()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>Next {format(new Date(formData.nextExecution), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={16} />
                    <span>Ends {format(new Date(formData.endDate), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap pt-2">
                    <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700">
                      {CATEGORY_LABELS[formData.category]}
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