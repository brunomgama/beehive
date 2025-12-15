'use client'

import { useState, useEffect, useMemo } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Wifi, Laptop, Coffee, Car, Music, Heart, Zap, GraduationCap, Tv, MoreHorizontal, 
  ChevronDown, Home, Wrench, Shield, Sofa, Fuel, Bus, CarFront, ParkingCircle, Receipt, Shirt, Smartphone, 
  Gift, Sparkles, ShoppingBasket, UtensilsCrossed, Pizza, Wine, Film, Calendar, Gamepad2, Moon, Dumbbell, 
  Code, Globe, Phone, Droplet, Lightbulb, Flame, Briefcase, Plane, FileText, GraduationCap as Book, 
  Building2, CreditCard, Play, HeadphonesIcon, Cloud, Newspaper, Hotel, 
  Map, Wallet, TrendingUp, RotateCcw, HomeIcon, PawPrint, Syringe, Stethoscope, Users, PillBottle, Trash2, Edit3 } from "lucide-react"
import { format, parseISO, isValid } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/contexts/theme-context"
import { BankAccount } from "@/lib/api/bank/accounts-api"
import { getButtonStyle, getThemeButtonStyle } from "@/lib/themes"
import { Movement, movementApi, MovementCategory, MovementStatus, MovementType } from "@/lib/api/bank/movements-api"
import { CurrencyInput } from "@/lib/util/currency-input"
import { suggestCategories, getAllCategories } from "@/lib/util/category-suggestions"

interface MovementDetailsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movement: Movement | null
  accounts: BankAccount[]
  onSuccess?: () => void
}

export function MovementDetailsDrawer({ open, onOpenChange, movement, accounts, onSuccess }: MovementDetailsDrawerProps) {
  const { theme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [accountId, setAccountId] = useState<number>(0)
  const [category, setCategory] = useState<MovementCategory>('OTHER')
  const [type, setType] = useState<MovementType>('EXPENSE')
  const [amount, setAmount] = useState<string>('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState<MovementStatus>('CONFIRMED')
  const [loading, setLoading] = useState(false)
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)

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

  const toInputDateFormat = (dateString: string) => {
    try {
      const parsedDate = parseISO(dateString)
      if (isValid(parsedDate)) {
        return format(parsedDate, 'yyyy-MM-dd')
      }
      return format(new Date(), 'yyyy-MM-dd')
    } catch (error) {
      return format(new Date(), 'yyyy-MM-dd')
    }
  }

  useEffect(() => {
    if (movement && open) {
      setAccountId(movement.accountId)
      setCategory(movement.category)
      setType(movement.type)
      setAmount(Math.abs(movement.amount).toString())
      setDescription(movement.description)
      setDate(toInputDateFormat(movement.date))
      setStatus(movement.status)
      setIsEditing(false)
    }
  }, [movement, open])

  const suggestedCategories = useMemo(() => {
    if (!description.trim()) {
      return []
    }
    return suggestCategories(description)
  }, [description])

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

  const categories: { value: MovementCategory; label: string; icon: React.ReactNode }[] = [
    { value: 'RENT', label: 'Rent', icon: <Home className="w-5 h-5" /> },
    { value: 'PROPERTY_TAXES', label: 'Property Taxes', icon: <Building2 className="w-5 h-5" /> },
    { value: 'HOME_MAINTENANCE_REPAIRS', label: 'Home Maintenance', icon: <Wrench className="w-5 h-5" /> },
    { value: 'HOME_INSURANCE', label: 'Home Insurance', icon: <Shield className="w-5 h-5" /> },
    { value: 'HOUSEHOLD_SUPPLIES_FURNITURE', label: 'Household Items', icon: <Sofa className="w-5 h-5" /> },
    { value: 'FUEL', label: 'Fuel', icon: <Fuel className="w-5 h-5" /> },
    { value: 'PUBLIC_TRANSPORT', label: 'Public Transport', icon: <Bus className="w-5 h-5" /> },
    { value: 'UBER', label: 'Uber', icon: <Car className="w-5 h-5" /> },
    { value: 'CAR_MAINTENANCE', label: 'Car Maintenance', icon: <CarFront className="w-5 h-5" /> },
    { value: 'PARKING', label: 'Parking', icon: <ParkingCircle className="w-5 h-5" /> },
    { value: 'VEHICLE_INSURANCE', label: 'Vehicle Insurance', icon: <Shield className="w-5 h-5" /> },
    { value: 'TOLLS', label: 'Tolls', icon: <Receipt className="w-5 h-5" /> },
    { value: 'SHOPPING', label: 'Shopping', icon: <ShoppingCart className="w-5 h-5" /> },
    { value: 'CLOTHING', label: 'Clothing', icon: <Shirt className="w-5 h-5" /> },
    { value: 'ELECTRONICS', label: 'Electronics', icon: <Smartphone className="w-5 h-5" /> },
    { value: 'GIFTS', label: 'Gifts', icon: <Gift className="w-5 h-5" /> },
    { value: 'BEAUTY_COSMETICS', label: 'Beauty', icon: <Sparkles className="w-5 h-5" /> },
    { value: 'GROCERIES', label: 'Groceries', icon: <ShoppingBasket className="w-5 h-5" /> },
    { value: 'RESTAURANTS', label: 'Restaurants', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { value: 'FAST_FOOD', label: 'Fast Food', icon: <Pizza className="w-5 h-5" /> },
    { value: 'COFFEE_SHOPS', label: 'Coffee Shops', icon: <Coffee className="w-5 h-5" /> },
    { value: 'ALCOHOL_BARS', label: 'Alcohol & Bars', icon: <Wine className="w-5 h-5" /> },
    { value: 'FOOD_DRINKS', label: 'Food & Drinks', icon: <Coffee className="w-5 h-5" /> },
    { value: 'ENTERTAINMENT', label: 'Entertainment', icon: <Music className="w-5 h-5" /> },
    { value: 'MOVIES', label: 'Movies', icon: <Film className="w-5 h-5" /> },
    { value: 'EVENTS', label: 'Events', icon: <Calendar className="w-5 h-5" /> },
    { value: 'GAMES', label: 'Games', icon: <Gamepad2 className="w-5 h-5" /> },
    { value: 'NIGHTLIFE', label: 'Nightlife', icon: <Moon className="w-5 h-5" /> },
    { value: 'HOBBIES', label: 'Hobbies', icon: <Music className="w-5 h-5" /> },
    { value: 'GYM', label: 'Gym', icon: <Dumbbell className="w-5 h-5" /> },
    { value: 'TECH', label: 'Technology', icon: <Laptop className="w-5 h-5" /> },
    { value: 'SOFTWARE_SUBSCRIPTIONS', label: 'Software', icon: <Code className="w-5 h-5" /> },
    { value: 'INTERNET_SERVICES', label: 'Internet Services', icon: <Globe className="w-5 h-5" /> },
    { value: 'MOBILE_PHONE_PLANS', label: 'Mobile Plans', icon: <Phone className="w-5 h-5" /> },
    { value: 'NET', label: 'Internet', icon: <Wifi className="w-5 h-5" /> },
    { value: 'UTILITIES', label: 'Utilities', icon: <Zap className="w-5 h-5" /> },
    { value: 'WATER', label: 'Water', icon: <Droplet className="w-5 h-5" /> },
    { value: 'ELECTRICITY', label: 'Electricity', icon: <Lightbulb className="w-5 h-5" /> },
    { value: 'GAS', label: 'Gas', icon: <Flame className="w-5 h-5" /> },
    { value: 'OFFICE_SUPPLIES', label: 'Office Supplies', icon: <Briefcase className="w-5 h-5" /> },
    { value: 'BUSINESS_TRAVEL', label: 'Business Travel', icon: <Plane className="w-5 h-5" /> },
    { value: 'PROFESSIONAL_SERVICES', label: 'Professional', icon: <FileText className="w-5 h-5" /> },
    { value: 'EDUCATION', label: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
    { value: 'ONLINE_COURSES', label: 'Online Courses', icon: <Book className="w-5 h-5" /> },
    { value: 'CLASSES', label: 'Classes', icon: <Users className="w-5 h-5" /> },
    { value: 'HEALTH_INSURANCE', label: 'Health Insurance', icon: <Shield className="w-5 h-5" /> },
    { value: 'CAR_INSURANCE', label: 'Car Insurance', icon: <Shield className="w-5 h-5" /> },
    { value: 'LIFE_INSURANCE', label: 'Life Insurance', icon: <Shield className="w-5 h-5" /> },
    { value: 'TRAVEL_INSURANCE', label: 'Travel Insurance', icon: <Shield className="w-5 h-5" /> },
    { value: 'HEALTH', label: 'Health', icon: <Heart className="w-5 h-5" /> },
    { value: 'PHARMACY', label: 'Pharmacy', icon: <PillBottle className="w-5 h-5" /> },
    { value: 'MEDICAL', label: 'Medical', icon: <Stethoscope className="w-5 h-5" /> },
    { value: 'THERAPY', label: 'Therapy', icon: <Users className="w-5 h-5" /> },
    { value: 'PET_FOOD', label: 'Pet Food', icon: <PawPrint className="w-5 h-5" /> },
    { value: 'VET_VISITS', label: 'Vet Visits', icon: <Syringe className="w-5 h-5" /> },
    { value: 'PET_ACCESSORIES', label: 'Pet Accessories', icon: <PawPrint className="w-5 h-5" /> },
    { value: 'PET_GROOMING', label: 'Pet Grooming', icon: <Sparkles className="w-5 h-5" /> },
    { value: 'BANK_FEES', label: 'Bank Fees', icon: <CreditCard className="w-5 h-5" /> },
    { value: 'INVESTMENTS', label: 'Investments', icon: <TrendingUp className="w-5 h-5" /> },
    { value: 'STREAMING_SERVICES', label: 'Streaming', icon: <Tv className="w-5 h-5" /> },
    { value: 'VIDEO_STREAMING', label: 'Video Streaming', icon: <Play className="w-5 h-5" /> },
    { value: 'MUSIC_STREAMING', label: 'Music Streaming', icon: <HeadphonesIcon className="w-5 h-5" /> },
    { value: 'CLOUD_STORAGE', label: 'Cloud Storage', icon: <Cloud className="w-5 h-5" /> },
    { value: 'DIGITAL_MAGAZINES', label: 'Digital Magazines', icon: <Newspaper className="w-5 h-5" /> },
    { value: 'NEWS_SUBSCRIPTIONS', label: 'News', icon: <Newspaper className="w-5 h-5" /> },
    { value: 'HOTELS', label: 'Hotels', icon: <Hotel className="w-5 h-5" /> },
    { value: 'FLIGHTS', label: 'Flights', icon: <Plane className="w-5 h-5" /> },
    { value: 'CAR_RENTAL', label: 'Car Rental', icon: <Car className="w-5 h-5" /> },
    { value: 'TOURS', label: 'Tours', icon: <Map className="w-5 h-5" /> },
    { value: 'SALARY', label: 'Salary', icon: <Wallet className="w-5 h-5" /> },
    { value: 'FREELANCING', label: 'Freelancing', icon: <Briefcase className="w-5 h-5" /> },
    { value: 'INVESTMENT_INCOME', label: 'Investment Income', icon: <TrendingUp className="w-5 h-5" /> },
    { value: 'REFUNDS', label: 'Refunds', icon: <RotateCcw className="w-5 h-5" /> },
    { value: 'RENTAL_INCOME', label: 'Rental Income', icon: <HomeIcon className="w-5 h-5" /> },
    { value: 'OTHER', label: 'Other', icon: <MoreHorizontal className="w-5 h-5" /> },
  ]

  const selectedCategory = categories.find(c => c.value === category)

  const handleUpdate = async () => {
    if (!movement?.id) return
    
    const numAmount = parseFloat(amount) || 0
    
    if (!accountId || !numAmount || !description) {
      return
    }

    setLoading(true)
    
    try {
      const movementData = {
        accountId,
        category,
        type,
        amount: numAmount,
        description,
        date,
        status
      }

      const result = await movementApi.update(movement.id, movementData)
      
      if (result.data) {
        onSuccess?.()
        onOpenChange(false)
        setIsEditing(false)
      } else {
        alert('Failed to update movement: ' + result.error)
      }
    } catch (error) {
      alert('An error occurred while updating the movement')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!movement?.id) return
    
    if (!confirm('Are you sure you want to delete this transaction?')) return
    
    setLoading(true)
    
    try {
      await movementApi.delete(movement.id)
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      alert('An error occurred while deleting the movement')
    } finally {
      setLoading(false)
    }
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
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
                {/* Description */}
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-semibold text-foreground">{description}</h3>
                </div>

                {/* Amount */}
                <div className="text-center mb-8">
                  <p className={`text-5xl font-bold ${type === 'INCOME' ? 'text-ok' : 'text-foreground'}`}>
                    € {Math.abs(movement.amount).toFixed(2)}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Account</span>
                    <span className="font-medium">{accounts.find(a => a.id === accountId)?.accountName}</span>
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
                      style={type === 'EXPENSE' 
                        ? { backgroundColor: 'var(--nok)', color: 'var(--nok-foreground)' } 
                        : { backgroundColor: 'var(--ok)', color: 'var(--ok-foreground)' }}>
                      {type === 'INCOME' ? 'Income' : 'Expense'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{formatDate(movement.date, 'dd MMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                      status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      status === 'CANCELLED' ? 'bg-gray-200 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="h-12 rounded-full">
                    <Edit3 size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button onClick={handleDelete} variant="outline" className="h-12 text-destructive hover:text-destructive rounded-full" disabled={loading}>
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </>
            ) : (
              // Edit Mode - Exactly matching Add Movement
              <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                {/* Type Selector */}
                <div className="grid grid-cols-2 gap-2 bg-muted/30 p-1 rounded-xl mb-8 mt-4">
                  <Button variant="ghost" type="button" onClick={() => setType('EXPENSE')}
                    className={`py-3 rounded-lg text-sm font-semibold transition-all ${
                      type === 'EXPENSE' ? 'shadow-md' : 'hover:text-foreground hover:bg-transparent'}`}
                    style={type === 'EXPENSE' 
                      ? { backgroundColor: 'var(--nok)', color: 'var(--nok-foreground)' } 
                      : { color: 'var(--nok)' }}>
                    Expense
                  </Button>
                  <Button variant="ghost" type="button" onClick={() => setType('INCOME')}
                    className={`py-3 rounded-lg text-sm font-semibold transition-all ${
                      type === 'INCOME' ? 'shadow-md' : 'hover:text-foreground hover:bg-transparent'}`}
                    style={type === 'INCOME' 
                      ? { backgroundColor: 'var(--ok)', color: 'var(--ok-foreground)' } 
                      : { color: 'var(--ok)' }}>
                    Income
                  </Button>
                </div>

                {/* Description */}
                <div className="text-center mb-4">
                  <Input value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description" className="text-center text-lg border-0 shadow-none focus-visible:ring-0 px-0"/>
                </div>

                {/* Amount */}
                <div className="mb-6">
                  <CurrencyInput value={amount} onChange={handleAmountChange} placeholder="0.00" className="text-5xl font-bold"/>
                </div>

                {/* Account Selector */}
                <div className="mb-8 flex justify-center">
                  <Select value={accountId.toString()} onValueChange={(value) => setAccountId(parseInt(value))}>
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
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="text-sm" />
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

                {/* Submit Button */}
                <Button type="submit" className={`w-full h-12 ${getButtonStyle(theme)}`} disabled={loading || !accountId || !parseFloat(amount) || !description}>
                  {loading ? 'Saving...' : 'Save Changes'}
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
                  <Button key={cat} type="button" onClick={() => { 
                    setCategory(cat) 
                    setShowCategoryDrawer(false)
                    setShowAllCategories(false)
                  }} className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all h-20 ${
                    category === cat ? getThemeButtonStyle(theme, 'primary') + ' text-white'
                      : 'bg-card text-foreground hover:bg-muted'}`}>
                    <div className={category === cat ? 'text-white' : 'text-muted-foreground'}>
                      {categoryInfo.icon}
                    </div>
                    <span className="text-sm text-center">
                      {categoryInfo.label}
                    </span>
                  </Button>
                )
              })}
              
              {!showAllCategories && (
                <Button type="button" onClick={() => setShowAllCategories(true)}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl transition-all h-20 bg-muted/50 text-foreground hover:bg-muted border-2 border-dashed border-muted-foreground/30">
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