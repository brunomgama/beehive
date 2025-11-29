'use client'

import { useState, useEffect } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { movementApi, MovementCategory, MovementType, MovementStatus, CreateMovementData } from "@/lib/v2/api/banks/movements-api"
import { BankAccount } from "@/lib/api/bank-api"
import { ShoppingCart, Wifi, Laptop, Coffee, Car, Music, Heart, Zap, GraduationCap, Tv, MoreHorizontal, ChevronRight, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { CurrencyInput } from "@/lib/v2/util/currency-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/v2/ui/select"

interface AddMovementDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: BankAccount[]
  defaultAccountId?: number
  onSuccess?: () => void
}

export function AddMovementDrawer({ open, onOpenChange, accounts, defaultAccountId, onSuccess }: AddMovementDrawerProps) {
  const [accountId, setAccountId] = useState<number | null>(defaultAccountId || null)
  const [category, setCategory] = useState<MovementCategory>('OTHER')
  const [type, setType] = useState<MovementType>('EXPENSE')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [status, setStatus] = useState<MovementStatus>('CONFIRMED')
  const [loading, setLoading] = useState(false)
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false)

  useEffect(() => {
    if (defaultAccountId) {
      setAccountId(defaultAccountId)
    }
  }, [defaultAccountId])

  const categories: { value: MovementCategory; label: string; icon: React.ReactNode }[] = [
    { value: 'SHOPPING', label: 'Shopping', icon: <ShoppingCart className="w-5 h-5" /> },
    { value: 'NET', label: 'Internet', icon: <Wifi className="w-5 h-5" /> },
    { value: 'TECH', label: 'Technology', icon: <Laptop className="w-5 h-5" /> },
    { value: 'FOOD_DRINKS', label: 'Food & Drinks', icon: <Coffee className="w-5 h-5" /> },
    { value: 'TRANSPORT', label: 'Transport', icon: <Car className="w-5 h-5" /> },
    { value: 'ENTERTAINMENT', label: 'Entertainment', icon: <Music className="w-5 h-5" /> },
    { value: 'HEALTH', label: 'Health', icon: <Heart className="w-5 h-5" /> },
    { value: 'UTILITIES', label: 'Utilities', icon: <Zap className="w-5 h-5" /> },
    { value: 'EDUCATION', label: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
    { value: 'STREAMING_SERVICES', label: 'Streaming', icon: <Tv className="w-5 h-5" /> },
    { value: 'OTHER', label: 'Other', icon: <MoreHorizontal className="w-5 h-5" /> },
  ]

  const selectedCategory = categories.find(c => c.value === category)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!accountId || !amount || !description) {
      return
    }

    setLoading(true)
    try {
      const movementData: CreateMovementData = {
        accountId, category, type,
        amount: type === 'EXPENSE' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount)),
        description, date, status
      }

      await movementApi.create(movementData)
      
      setAmount('')
      setDescription('')
      setDate(format(new Date(), 'yyyy-MM-dd'))
      setCategory('OTHER')
      setStatus('CONFIRMED')
      
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating movement:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Main Drawer */}
      <Drawer open={open && !showCategoryDrawer} onOpenChange={onOpenChange}>
        <DrawerContent className="border-none">
          <form onSubmit={handleSubmit} className="px-6 pb-8">
            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-2 bg-muted/30 p-1 rounded-xl mb-8 mt-4">
              <Button variant="ghost" type="button" onClick={() => setType('EXPENSE')}
                className={`py-3 rounded-lg text-sm font-semibold transition-all ${
                  type === 'EXPENSE' ? 'bg-nok text-white shadow-md hover:bg-nok'
                    : 'text-nok hover:text-foreground hover:bg-transparent'
                }`}>
                Expense
              </Button>
              <Button variant="ghost" type="button" onClick={() => setType('INCOME')}
                className={`py-3 rounded-lg text-sm font-semibold transition-all ${
                  type === 'INCOME' ? 'bg-ok text-white shadow-md hover:bg-ok'
                    : 'text-ok hover:text-foreground hover:bg-transparent'
                }`}>
                Income
              </Button>
            </div>

            {/* Description - Borderless */}
            <div className="text-center mb-4">
              <Input value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Description" className="text-center text-lg border-0 shadow-none focus-visible:ring-0 px-0" />
            </div>

            {/* Amount - Large Centered with € prefix */}
            <div className="mb-6">
              <CurrencyInput value={amount} onChange={setAmount} placeholder="0.00" className="text-5xl font-bold"/>
            </div>

            {/* Account Selector - Centered */}
            <div className="mb-8 flex justify-center">
              <Select value={accountId?.toString()} onValueChange={(value) => setAccountId(parseInt(value))}>
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
              className="w-full mb-4 h-10 justify-between text-base shadow-sm" >
              <div className="flex items-center gap-3">
                {selectedCategory?.icon}
                <span>{selectedCategory?.label}</span>
              </div>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </Button>

            {/* Date & Status - Inline, half width each */}
            <div className="grid grid-cols-2 gap-3 mb-6 opacity-50">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="text-sm" />
              <div>
                <Select value={status} onValueChange={(value) => setStatus(value as MovementStatus)}>
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
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full h-12 bg-orange text-white text-base font-semibold rounded-xl"
              disabled={loading || !accountId || !amount || !description}>
              {loading ? 'Creating...' : 'Create Movement'}
            </Button>
          </form>
        </DrawerContent>
      </Drawer>

      {/* Category Selection Drawer */}
      <Drawer open={showCategoryDrawer} onOpenChange={setShowCategoryDrawer}>
        <DrawerContent className="border-none">
          <DrawerHeader>
            <DrawerTitle>Select Category</DrawerTitle>
            <DrawerDescription>Choose a category for this transaction</DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-8">
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <Button key={cat.value} type="button"
                    onClick={() => { 
                        setCategory(cat.value) 
                        setShowCategoryDrawer(false) 
                    }}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all h-20 ${
                        category === cat.value ? 'bg-orange' : 'bg-card'
                    }`} >
                    <div className={`${category === cat.value ? 'text-white' : 'text-muted-foreground'}`}>
                        {cat.icon}
                    </div>
                    <span className={`${category === cat.value ? 'text-sm text-white text-center' : 'text-sm text-black text-center'}`}>
                        {cat.label}
                    </span>
                </Button>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}