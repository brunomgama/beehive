'use client'

import { useState, useEffect, useMemo } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Trash2, Edit3, ChevronDown } from "lucide-react"
import { format, parseISO, isValid } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/contexts/theme-context"
import { BankAccount } from "@/lib/api/bank/accounts-api"
import { getButtonStyle, getThemeButtonStyle } from "@/lib/themes"
import { Movement } from "@/lib/api/bank/movements-api"
import { CurrencyInput } from "@/lib/util/currency-input"
import { suggestCategories, getAllCategories, CATEGORY_LABELS } from "@/lib/util/categories"
import { MovementCategory, MovementStatus } from "@/lib/api/types"
import { useMovementForm } from "@/hooks/use-movements-form"
import { CATEGORY_ICONS } from '@/lib/util/movement-icons'

interface MovementDetailsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movement: Movement | null
  accounts: BankAccount[]
  onSuccess?: () => void
}

/**
 * Movement Details Drawer
 * View and edit transactions in a mobile drawer
 * Uses the same form hook as add/edit pages
 */
export function MovementDetailsDrawer({ open, onOpenChange, movement, accounts, onSuccess }: MovementDetailsDrawerProps) {
  const { theme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)

  // Use the form hook when editing
  const {
    formData,
    updateField,
    loading: saving,
    error,
    handleSubmit: submitForm,
  } = useMovementForm(isEditing && movement ? movement.id : undefined)

  const formatDate = (dateString: string, formatStr: string) => {
    try {
      const parsedDate = parseISO(dateString)
      if (isValid(parsedDate)) {
        return format(parsedDate, formatStr)
      }
      return 'Invalid date'
    } catch (error) {
      return 'Invalid date'
    }
  }

  // Reset editing state when drawer closes
  useEffect(() => {
    if (!open) {
      setIsEditing(false)
      setShowCategoryDrawer(false)
      setShowAllCategories(false)
    }
  }, [open])

  const suggestedCategories = useMemo(() => {
    if (!formData.description.trim()) {
      return []
    }
    return suggestCategories(formData.description)
  }, [formData.description])

  const displayCategories = useMemo(() => {
    if (showAllCategories) {
      return getAllCategories()
    }
    
    if (suggestedCategories.length > 0) {
      return suggestedCategories
    }
    
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

  const selectedCategory = categories.find(c => c.value === (isEditing ? formData.category : movement?.category))

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await submitForm(e)
    if (success) {
      onSuccess?.()
      onOpenChange(false)
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    if (!movement?.id) return
    if (!confirm('Are you sure you want to delete this transaction?')) return
    
    // We'll need to add delete to the movements list hook
    // For now, use the API directly
    const { movementApi } = await import('@/lib/api/bank/movements-api')
    await movementApi.delete(movement.id)
    onSuccess?.()
    onOpenChange(false)
  }

  if (!movement) return null

  return (
    <>
      {/* Main Drawer */}
      <Drawer open={open && !showCategoryDrawer} onOpenChange={onOpenChange}>
        <DrawerContent className="border-none" style={{ backgroundColor: 'var(--background)' }}>
          
          <div className="px-6 pb-8">
            {!isEditing ? (
              // View Mode
              <>
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-semibold text-foreground">{movement.description}</h3>
                </div>

                <div className="text-center mb-8">
                  <p className={`text-5xl font-bold ${movement.type === 'INCOME' ? 'text-ok' : 'text-foreground'}`}>
                    € {Math.abs(movement.amount).toFixed(2)}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Account</span>
                    <span className="font-medium">{accounts.find(a => a.id === movement.accountId)?.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Category</span>
                    <div className="flex items-center gap-2">
                      {selectedCategory?.icon}
                      <span className="font-medium">{selectedCategory?.label}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border">
                    <span className="text-muted-foreground">Type</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium mb-2`}
                      style={movement.type === 'EXPENSE' 
                        ? { backgroundColor: 'var(--nok)', color: 'var(--nok-foreground)' } 
                        : { backgroundColor: 'var(--ok)', color: 'var(--ok-foreground)' }}>
                      {movement.type === 'INCOME' ? 'Income' : 'Expense'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{formatDate(movement.date, 'dd MMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                      movement.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      movement.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      movement.status === 'CANCELLED' ? 'bg-gray-200 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {movement.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="h-12 rounded-full">
                    <Edit3 size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button onClick={handleDelete} variant="outline" className="h-12 text-destructive hover:text-destructive rounded-full">
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </>
            ) : (
              // Edit Mode
              <form onSubmit={handleUpdate}>
                {/* Type Selector */}
                <div className="grid grid-cols-2 gap-2 bg-muted/30 p-1 rounded-xl mb-8 mt-4">
                  <Button variant="ghost" type="button" onClick={() => updateField('type', 'EXPENSE')}
                    className={`py-3 rounded-lg text-sm font-semibold transition-all ${
                      formData.type === 'EXPENSE' ? 'shadow-md' : 'hover:text-foreground hover:bg-transparent'}`}
                    style={formData.type === 'EXPENSE' 
                      ? { backgroundColor: 'var(--nok)', color: 'var(--nok-foreground)' } 
                      : { color: 'var(--nok)' }}>
                    Expense
                  </Button>
                  <Button variant="ghost" type="button" onClick={() => updateField('type', 'INCOME')}
                    className={`py-3 rounded-lg text-sm font-semibold transition-all ${
                      formData.type === 'INCOME' ? 'shadow-md' : 'hover:text-foreground hover:bg-transparent'}`}
                    style={formData.type === 'INCOME' 
                      ? { backgroundColor: 'var(--ok)', color: 'var(--ok-foreground)' } 
                      : { color: 'var(--ok)' }}>
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
                <div className="mb-8 flex justify-center">
                  <Select value={formData.accountId.toString()} onValueChange={(value) => updateField('accountId', parseInt(value))}>
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
                <Button type="button" variant="ghost" onClick={() => setShowCategoryDrawer(true)}
                  className="w-full mb-4 h-10 justify-between text-base shadow-sm">
                  <div className="flex items-center gap-3">
                    {selectedCategory?.icon}
                    <span>{selectedCategory?.label}</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </Button>

                {/* Date & Status */}
                <div className="grid grid-cols-2 gap-3 mb-6 opacity-50">
                  <Input 
                    type="date" 
                    value={formData.date} 
                    onChange={(e) => updateField('date', e.target.value)} 
                    className="text-sm" 
                  />
                  <Select value={formData.status} onValueChange={(value) => updateField('status', value as MovementStatus)}>
                    <SelectTrigger className="text-sm w-full">
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

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className={`w-full h-12 ${getButtonStyle(theme)}`} 
                  disabled={saving || !formData.accountId || !formData.amount || !formData.description}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            )}
          </div>
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