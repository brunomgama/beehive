'use client'

import { ArrowLeft, Save, Loader2, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatBalance } from '@/lib/util/utils'
import { useTheme } from '@/contexts/theme-context'
import { getButtonStyle } from '@/lib/themes'
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/util/categories'
import { useMovementForm } from '@/hooks/use-movements-form'
import { MovementCategory, MovementStatus } from '@/lib/api/types'

interface EditMovementMobileProps {
  movementId: number | null
}

/**
 * Edit Movement Mobile Component
 * Full-page form for editing transactions
 */
export default function EditMovementMobile({ movementId }: EditMovementMobileProps) {
  const { theme } = useTheme()
  const {
    formData,
    updateField,
    accounts,
    loading,
    saving,
    error,
    handleSubmit,
    handleCancel,
  } = useMovementForm(movementId || undefined)

  // Loading state
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
            <h1 className="text-2xl font-bold text-foreground">Edit Transaction</h1>
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
            <Select
              value={formData.accountId.toString()}
              onValueChange={(value) => updateField('accountId', parseInt(value))}
            >
              <SelectTrigger className="w-full h-12 text-base rounded-xl border-2">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id!.toString()}>
                    {account.accountName} ({formatBalance(account.balance)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              placeholder="e.g., Grocery shopping"
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
            <Select
              value={formData.category}
              onValueChange={(value) => updateField('category', value as MovementCategory)}
            >
              <SelectTrigger className="w-full h-12 text-base rounded-xl border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {CATEGORY_LABELS[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-base font-semibold">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="h-12 text-base rounded-xl border-2"
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-base font-semibold">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => updateField('status', value as MovementStatus)}
            >
              <SelectTrigger className="w-full h-12 text-base rounded-xl border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
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
  )
}