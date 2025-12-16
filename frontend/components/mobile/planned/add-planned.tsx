'use client'

import { ArrowLeft, Save, Loader2, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatBalance } from '@/lib/util/utils'
import { useTheme } from '@/contexts/theme-context'
import { getButtonStyle } from '@/lib/themes'
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/util/categories'
import { MovementCategory, MovementStatus, MovementRecurrence } from '@/lib/api/types'
import { usePlannedForm } from '@/hooks/planned/use-planned-form'

const RECURRENCE_OPTIONS: { value: MovementRecurrence; label: string }[] = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
]

export default function AddPlannedMobile() {
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
  } = usePlannedForm()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleCancel} 
            variant="ghost" 
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add Planned</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
              <AlertCircle className="text-destructive flex-shrink-0" size={20} />
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          {/* Type Selection */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Transaction Type *</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => updateField('type', 'EXPENSE')}
                className={`h-14 rounded-xl font-semibold transition-all ${
                  formData.type === 'EXPENSE'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
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
                    : 'bg-muted hover:bg-muted/80 text-foreground'
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
              className="w-full h-12 text-base rounded-xl border-2 px-4 bg-background"
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
              className="h-12 text-base rounded-xl border-2"
              placeholder="e.g., Monthly rent payment"
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-semibold">Amount *</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                €
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount || ''}
                onChange={(e) => updateField('amount', parseFloat(e.target.value) || 0)}
                className="h-12 text-base rounded-xl border-2 pl-8"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base font-semibold">Category *</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => updateField('category', e.target.value as MovementCategory)}
              className="w-full h-12 text-base rounded-xl border-2 px-4 bg-background"
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
            <div className="grid grid-cols-2 gap-2">
              {RECURRENCE_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  onClick={() => handleRecurrenceChange(option.value)}
                  className={`h-12 rounded-xl font-medium transition-all ${
                    formData.recurrence === option.value
                      ? getButtonStyle(theme)
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* First Execution Date */}
          <div className="space-y-2">
            <Label htmlFor="nextExecution" className="text-base font-semibold">First Execution *</Label>
            <Input
              id="nextExecution"
              type="date"
              value={formData.nextExecution}
              onChange={(e) => updateField('nextExecution', e.target.value)}
              className="h-12 text-base rounded-xl border-2"
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
              className="h-12 text-base rounded-xl border-2"
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
              className="w-full h-12 text-base rounded-xl border-2 px-4 bg-background"
              required
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="flex-1 h-14 font-semibold text-base rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className={`flex-1 h-14 ${getButtonStyle(theme)} font-semibold text-base rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300`}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Create Planned
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}