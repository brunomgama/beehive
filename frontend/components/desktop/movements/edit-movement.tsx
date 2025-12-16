'use client'

import { ArrowLeft, Save, Loader2, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatBalance, capitalizeFirstLetter } from '@/lib/util/utils'
import { useTheme } from '@/contexts/theme-context'
import { getButtonStyle } from '@/lib/themes'
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/util/categories'
import { useMovementForm } from '@/hooks/use-movements-form'
import { MovementCategory, MovementStatus } from '@/lib/api/types'

interface EditMovementDesktopProps {
  movementId: number | null
}

/**
 * Edit Movement Desktop Component
 * Full-featured form with live preview for editing
 */
export default function EditMovementDesktop({ movementId }: EditMovementDesktopProps) {
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
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background">
        <div className="sticky top-0 z-50 bg-gradient-to-br from-muted/30 to-background backdrop-blur-xl border-b p-8">
          <div className="flex items-center gap-4">
            <Button onClick={handleCancel} variant="ghost" className="h-12 w-12 p-0 rounded-full">
              <ArrowLeft size={24} />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Edit Transaction</h1>
              <p className="text-lg text-muted-foreground">Update transaction details</p>
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
            <h1 className="text-4xl font-bold text-foreground">Edit Transaction</h1>
            <p className="text-lg text-muted-foreground">Update transaction details</p>
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
              
              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
                  <AlertCircle className="text-destructive" size={20} />
                  <p className="text-sm text-destructive font-medium">{error}</p>
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
                  <Select
                    value={formData.accountId.toString()}
                    onValueChange={(value) => updateField('accountId', parseInt(value))}
                  >
                    <SelectTrigger className="w-full min-h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm">
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
                    className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm"
                    placeholder="e.g., Grocery shopping"
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
                  <Select
                    value={formData.category}
                    onValueChange={(value) => updateField('category', value as MovementCategory)}
                  >
                    <SelectTrigger className="w-full min-h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {CATEGORY_LABELS[category] || capitalizeFirstLetter(category)}
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
                    className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm"
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
                    <SelectTrigger className="w-full min-h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm">
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
                    {CATEGORY_LABELS[formData.category] || capitalizeFirstLetter(formData.category)}
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
              <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm text-foreground">
                  <strong>Tip:</strong> The preview shows how your updated transaction will appear in the transactions list.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}