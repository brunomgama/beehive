'use client'

import { useState, useEffect, useMemo } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/contexts/theme-context"
import { BankAccount } from "@/lib/api/bank/accounts-api"
import { getButtonStyle, getThemeButtonStyle } from "@/lib/themes"
import { CurrencyInput } from "@/lib/util/currency-input"
import { suggestCategories, getAllCategories, CATEGORY_LABELS } from "@/lib/util/categories"
import { MovementCategory, MovementRecurrence } from "@/lib/api/types"
import { CATEGORY_ICONS } from '@/lib/util/movement-icons'
import { usePlannedForm } from "@/hooks/planned/use-planned-form"

interface AddPlannedDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: BankAccount[]
  defaultAccountId?: number
  onSuccess?: () => void
}

export function AddPlannedDrawer({ open, onOpenChange, accounts, defaultAccountId, onSuccess }: AddPlannedDrawerProps) {
  const { theme } = useTheme()
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)

  const {
    formData,
    updateField,
    loading: saving,
    handleSubmit: submitForm,
  } = usePlannedForm()

  // Set default account when provided
  useEffect(() => {
    if (defaultAccountId && formData.accountId === 0) {
      updateField('accountId', defaultAccountId)
    }
  }, [defaultAccountId, formData.accountId, updateField])

  const suggestedCategories = useMemo(() => {
    if (!formData.description.trim()) return []
    return suggestCategories(formData.description)
  }, [formData.description])

  const displayCategories = useMemo(() => {
    if (showAllCategories) return getAllCategories()
    if (suggestedCategories.length > 0) return suggestedCategories
    return [
      'GROCERIES', 'RESTAURANTS', 'FUEL', 'SHOPPING', 'RENT',
      'ELECTRICITY', 'WATER', 'GYM', 'ENTERTAINMENT', 'HEALTH', 'OTHER'
    ] as MovementCategory[]
  }, [suggestedCategories, showAllCategories])

  const categories = Object.entries(CATEGORY_ICONS).map(([value, IconComponent]) => ({
    value: value as MovementCategory,
    label: CATEGORY_LABELS[value as MovementCategory],
    icon: <IconComponent className="w-5 h-5" />
  }))

  const selectedCategory = categories.find(c => c.value === formData.category)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await submitForm(e)
    if (success) {
      onSuccess?.()
      onOpenChange(false)
    }
  }

  return (
    <>
      {/* Main Drawer */}
      <Drawer open={open && !showCategoryDrawer} onOpenChange={onOpenChange}>
        <DrawerContent className="border-none" style={{ backgroundColor: 'var(--background)' }}>
          <DrawerHeader>
            <DrawerTitle>Recurring Payments</DrawerTitle>
            <DrawerDescription>Create a recurring transaction</DrawerDescription>
          </DrawerHeader>
          
          <form onSubmit={handleSubmit} className="px-6 pb-8">
            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-2 bg-muted/30 p-1 rounded-xl mb-8">
              <Button 
                variant="ghost" 
                type="button" 
                onClick={() => updateField('type', 'EXPENSE')}
                className={`py-3 rounded-lg text-sm font-semibold transition-all ${
                  formData.type === 'EXPENSE' ? 'shadow-md' : 'hover:text-foreground hover:bg-transparent'
                }`}
                style={formData.type === 'EXPENSE' 
                  ? { backgroundColor: 'var(--nok)', color: 'var(--nok-foreground)' } 
                  : { color: 'var(--nok)' }
                }
              >
                Expense
              </Button>
              <Button 
                variant="ghost" 
                type="button" 
                onClick={() => updateField('type', 'INCOME')}
                className={`py-3 rounded-lg text-sm font-semibold transition-all ${
                  formData.type === 'INCOME' ? 'shadow-md' : 'hover:text-foreground hover:bg-transparent'
                }`}
                style={formData.type === 'INCOME' 
                  ? { backgroundColor: 'var(--ok)', color: 'var(--ok-foreground)' } 
                  : { color: 'var(--ok)' }
                }
              >
                Income
              </Button>
            </div>

            {/* Description */}
            <div className="text-center mb-4">
              <Input 
                value={formData.description} 
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Description" 
                className="text-center text-lg border-0 shadow-none focus-visible:ring-0 px-0"
              />
            </div>

            {/* Amount */}
            <div className="mb-6">
              <CurrencyInput 
                value={formData.amount.toString()} 
                onChange={(value) => updateField('amount', parseFloat(value) || 0)} 
                placeholder="0.00" 
                className="text-5xl font-bold"
              />
            </div>

            {/* Account Selector */}
            <div className="mb-6 flex justify-center">
              <Select 
                value={formData.accountId.toString()} 
                onValueChange={(value) => updateField('accountId', parseInt(value))}
              >
                <SelectTrigger className="border-0 shadow-none focus:ring-0 text-center justify-center text-base w-auto">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id!.toString()}>
                      {account.accountName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Button */}
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setShowCategoryDrawer(true)}
              className="w-full mb-4 h-10 justify-between text-base shadow-sm"
            >
              <div className="flex items-center gap-3">
                {selectedCategory?.icon}
                <span>{selectedCategory?.label}</span>
              </div>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </Button>

            {/* Recurrence Selector */}
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">Recurrence</label>
              <Select 
                value={formData.recurrence} 
                onValueChange={(value) => updateField('recurrence', value as MovementRecurrence)}
              >
                <SelectTrigger className="text-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Next Execution & End Date */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Start Date</label>
                <Input 
                  type="date" 
                  value={formData.nextExecution} 
                  onChange={(e) => updateField('nextExecution', e.target.value)} 
                  className="text-sm" 
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">End Date</label>
                <Input 
                  type="date" 
                  value={formData.endDate} 
                  onChange={(e) => updateField('endDate', e.target.value)} 
                  className="text-sm" 
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className={`w-full h-12 ${getButtonStyle(theme)}`} 
              disabled={saving || !formData.accountId || !formData.amount || !formData.description}
            >
              {saving ? 'Creating...' : 'Schedule Payment'}
            </Button>
          </form>
        </DrawerContent>
      </Drawer>

      {/* Category Selection Drawer */}
      <Drawer open={showCategoryDrawer} onOpenChange={(open) => {
        setShowCategoryDrawer(open)
        if (!open) setShowAllCategories(false)
      }}>
        <DrawerContent className="border-none max-h-[85vh]" style={{ backgroundColor: 'var(--background)' }}>
          <DrawerHeader className="sticky top-0 z-10" style={{ backgroundColor: 'var(--background)' }}>
            <DrawerTitle>Select Category</DrawerTitle>
            <DrawerDescription>
              {suggestedCategories.length > 0 && !showAllCategories 
                ? 'Smart suggestions based on your description' 
                : 'Choose a category for this transaction'}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-8 overflow-y-auto max-h-[calc(85vh-80px)]">
            <div className="grid grid-cols-2 gap-3">
              {displayCategories.map((cat) => {
                const categoryInfo = categories.find(c => c.value === cat)
                if (!categoryInfo) return null
                
                return (
                  <Button 
                    key={cat} 
                    type="button" 
                    onClick={() => { 
                      updateField('category', cat)
                      setShowCategoryDrawer(false)
                      setShowAllCategories(false)
                    }} 
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all h-20 ${
                      formData.category === cat 
                        ? getThemeButtonStyle(theme, 'primary') + ' text-white'
                        : 'bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className={formData.category === cat ? 'text-white' : 'text-muted-foreground'}>
                      {categoryInfo.icon}
                    </div>
                    <span className="text-sm text-center">
                      {categoryInfo.label}
                    </span>
                  </Button>
                )
              })}
              
              {!showAllCategories && (
                <Button 
                  type="button" 
                  onClick={() => setShowAllCategories(true)}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl transition-all h-20 bg-muted/50 text-foreground hover:bg-muted border-2 border-dashed border-muted-foreground/30"
                >
                  <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-center font-semibold">More</span>
                </Button>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}