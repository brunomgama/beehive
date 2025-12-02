'use client'

import { useState, useEffect } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Wifi, Laptop, Coffee, Car, Music, Heart, Zap, GraduationCap, Tv, MoreHorizontal, 
  ChevronDown, Home, Wrench, Shield, Sofa, Fuel, Bus, CarFront, ParkingCircle, Receipt, Shirt, Smartphone, 
  Gift, Sparkles, ShoppingBasket, UtensilsCrossed, Pizza, Wine, Film, Calendar, Gamepad2, Moon, Dumbbell, 
  Code, Globe, Phone, Droplet, Lightbulb, Flame, Briefcase, Plane, FileText, GraduationCap as Book, 
  Building2, CreditCard, Play, HeadphonesIcon, Cloud, Newspaper, Hotel, 
  Map, Wallet, TrendingUp, RotateCcw, HomeIcon, PawPrint, Syringe, Stethoscope, Users, PillBottle } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/contexts/theme-context"
import { BankAccount } from "@/lib/api/bank/accounts-api"
import { getButtonStyle, getThemeButtonStyle } from "@/lib/themes"
import { movementApi, MovementCategory, MovementStatus, MovementType } from "@/lib/api/bank/movements-api"
import { CurrencyInput } from "@/lib/util/currency-input"

interface AddMovementDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: BankAccount[]
  defaultAccountId?: number
  onSuccess?: () => void
}

export function AddMovementDrawer({ open, onOpenChange, accounts, defaultAccountId, onSuccess }: AddMovementDrawerProps) {
  const { theme } = useTheme()
  const [accountId, setAccountId] = useState<number>(defaultAccountId || 0)
  const [category, setCategory] = useState<MovementCategory>('OTHER')
  const [type, setType] = useState<MovementType>('EXPENSE')
  const [amount, setAmount] = useState<string>('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [status, setStatus] = useState<MovementStatus>('CONFIRMED')
  const [loading, setLoading] = useState(false)
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false)

  useEffect(() => {
    if (defaultAccountId) {
      console.log('Setting accountId to:', defaultAccountId)
      setAccountId(defaultAccountId)
    }
  }, [defaultAccountId])

  const categories: { value: MovementCategory; label: string; icon: React.ReactNode }[] = [
    // Housing
    { value: 'RENT', label: 'Rent', icon: <Home className="w-5 h-5" /> },
    { value: 'PROPERTY_TAXES', label: 'Property Taxes', icon: <Building2 className="w-5 h-5" /> },
    { value: 'HOME_MAINTENANCE_REPAIRS', label: 'Home Maintenance', icon: <Wrench className="w-5 h-5" /> },
    { value: 'HOME_INSURANCE', label: 'Home Insurance', icon: <Shield className="w-5 h-5" /> },
    { value: 'HOUSEHOLD_SUPPLIES_FURNITURE', label: 'Household Items', icon: <Sofa className="w-5 h-5" /> },
    
    // Transportation
    { value: 'FUEL', label: 'Fuel', icon: <Fuel className="w-5 h-5" /> },
    { value: 'PUBLIC_TRANSPORT', label: 'Public Transport', icon: <Bus className="w-5 h-5" /> },
    { value: 'UBER', label: 'Uber', icon: <Car className="w-5 h-5" /> },
    { value: 'CAR_MAINTENANCE', label: 'Car Maintenance', icon: <CarFront className="w-5 h-5" /> },
    { value: 'PARKING', label: 'Parking', icon: <ParkingCircle className="w-5 h-5" /> },
    { value: 'VEHICLE_INSURANCE', label: 'Vehicle Insurance', icon: <Shield className="w-5 h-5" /> },
    { value: 'TOLLS', label: 'Tolls', icon: <Receipt className="w-5 h-5" /> },
    
    // Shopping
    { value: 'SHOPPING', label: 'Shopping', icon: <ShoppingCart className="w-5 h-5" /> },
    { value: 'CLOTHING', label: 'Clothing', icon: <Shirt className="w-5 h-5" /> },
    { value: 'ELECTRONICS', label: 'Electronics', icon: <Smartphone className="w-5 h-5" /> },
    { value: 'GIFTS', label: 'Gifts', icon: <Gift className="w-5 h-5" /> },
    { value: 'BEAUTY_COSMETICS', label: 'Beauty', icon: <Sparkles className="w-5 h-5" /> },
    
    // Food & Dining
    { value: 'GROCERIES', label: 'Groceries', icon: <ShoppingBasket className="w-5 h-5" /> },
    { value: 'RESTAURANTS', label: 'Restaurants', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { value: 'FAST_FOOD', label: 'Fast Food', icon: <Pizza className="w-5 h-5" /> },
    { value: 'COFFEE_SHOPS', label: 'Coffee Shops', icon: <Coffee className="w-5 h-5" /> },
    { value: 'ALCOHOL_BARS', label: 'Alcohol & Bars', icon: <Wine className="w-5 h-5" /> },
    { value: 'FOOD_DRINKS', label: 'Food & Drinks', icon: <Coffee className="w-5 h-5" /> },
    
    // Entertainment
    { value: 'ENTERTAINMENT', label: 'Entertainment', icon: <Music className="w-5 h-5" /> },
    { value: 'MOVIES', label: 'Movies', icon: <Film className="w-5 h-5" /> },
    { value: 'EVENTS', label: 'Events', icon: <Calendar className="w-5 h-5" /> },
    { value: 'GAMES', label: 'Games', icon: <Gamepad2 className="w-5 h-5" /> },
    { value: 'NIGHTLIFE', label: 'Nightlife', icon: <Moon className="w-5 h-5" /> },
    { value: 'HOBBIES', label: 'Hobbies', icon: <Music className="w-5 h-5" /> },
    { value: 'GYM', label: 'Gym', icon: <Dumbbell className="w-5 h-5" /> },
    
    // Technology & Services
    { value: 'TECH', label: 'Technology', icon: <Laptop className="w-5 h-5" /> },
    { value: 'SOFTWARE_SUBSCRIPTIONS', label: 'Software', icon: <Code className="w-5 h-5" /> },
    { value: 'INTERNET_SERVICES', label: 'Internet Services', icon: <Globe className="w-5 h-5" /> },
    { value: 'MOBILE_PHONE_PLANS', label: 'Mobile Plans', icon: <Phone className="w-5 h-5" /> },
    { value: 'NET', label: 'Internet', icon: <Wifi className="w-5 h-5" /> },
    
    // Utilities
    { value: 'UTILITIES', label: 'Utilities', icon: <Zap className="w-5 h-5" /> },
    { value: 'WATER', label: 'Water', icon: <Droplet className="w-5 h-5" /> },
    { value: 'ELECTRICITY', label: 'Electricity', icon: <Lightbulb className="w-5 h-5" /> },
    { value: 'GAS', label: 'Gas', icon: <Flame className="w-5 h-5" /> },
    
    // Business
    { value: 'OFFICE_SUPPLIES', label: 'Office Supplies', icon: <Briefcase className="w-5 h-5" /> },
    { value: 'BUSINESS_TRAVEL', label: 'Business Travel', icon: <Plane className="w-5 h-5" /> },
    { value: 'PROFESSIONAL_SERVICES', label: 'Professional', icon: <FileText className="w-5 h-5" /> },
    
    // Education
    { value: 'EDUCATION', label: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
    { value: 'ONLINE_COURSES', label: 'Online Courses', icon: <Book className="w-5 h-5" /> },
    { value: 'CLASSES', label: 'Classes', icon: <Users className="w-5 h-5" /> },
    
    // Insurance
    { value: 'HEALTH_INSURANCE', label: 'Health Insurance', icon: <Shield className="w-5 h-5" /> },
    { value: 'CAR_INSURANCE', label: 'Car Insurance', icon: <Shield className="w-5 h-5" /> },
    { value: 'LIFE_INSURANCE', label: 'Life Insurance', icon: <Shield className="w-5 h-5" /> },
    { value: 'TRAVEL_INSURANCE', label: 'Travel Insurance', icon: <Shield className="w-5 h-5" /> },
    
    // Health & Medical
    { value: 'HEALTH', label: 'Health', icon: <Heart className="w-5 h-5" /> },
    { value: 'PHARMACY', label: 'Pharmacy', icon: <PillBottle className="w-5 h-5" /> },
    { value: 'MEDICAL', label: 'Medical', icon: <Stethoscope className="w-5 h-5" /> },
    { value: 'THERAPY', label: 'Therapy', icon: <Users className="w-5 h-5" /> },
    
    // Pets
    { value: 'PET_FOOD', label: 'Pet Food', icon: <PawPrint className="w-5 h-5" /> },
    { value: 'VET_VISITS', label: 'Vet Visits', icon: <Syringe className="w-5 h-5" /> },
    { value: 'PET_ACCESSORIES', label: 'Pet Accessories', icon: <PawPrint className="w-5 h-5" /> },
    { value: 'PET_GROOMING', label: 'Pet Grooming', icon: <Sparkles className="w-5 h-5" /> },
    
    // Banking & Investments
    { value: 'BANK_FEES', label: 'Bank Fees', icon: <CreditCard className="w-5 h-5" /> },
    { value: 'INVESTMENTS', label: 'Investments', icon: <TrendingUp className="w-5 h-5" /> },
    
    // Streaming & Subscriptions
    { value: 'STREAMING_SERVICES', label: 'Streaming', icon: <Tv className="w-5 h-5" /> },
    { value: 'VIDEO_STREAMING', label: 'Video Streaming', icon: <Play className="w-5 h-5" /> },
    { value: 'MUSIC_STREAMING', label: 'Music Streaming', icon: <HeadphonesIcon className="w-5 h-5" /> },
    { value: 'CLOUD_STORAGE', label: 'Cloud Storage', icon: <Cloud className="w-5 h-5" /> },
    { value: 'DIGITAL_MAGAZINES', label: 'Digital Magazines', icon: <Newspaper className="w-5 h-5" /> },
    { value: 'NEWS_SUBSCRIPTIONS', label: 'News', icon: <Newspaper className="w-5 h-5" /> },
    
    // Travel
    { value: 'HOTELS', label: 'Hotels', icon: <Hotel className="w-5 h-5" /> },
    { value: 'FLIGHTS', label: 'Flights', icon: <Plane className="w-5 h-5" /> },
    { value: 'CAR_RENTAL', label: 'Car Rental', icon: <Car className="w-5 h-5" /> },
    { value: 'TOURS', label: 'Tours', icon: <Map className="w-5 h-5" /> },
    
    // Income
    { value: 'SALARY', label: 'Salary', icon: <Wallet className="w-5 h-5" /> },
    { value: 'FREELANCING', label: 'Freelancing', icon: <Briefcase className="w-5 h-5" /> },
    { value: 'INVESTMENT_INCOME', label: 'Investment Income', icon: <TrendingUp className="w-5 h-5" /> },
    { value: 'REFUNDS', label: 'Refunds', icon: <RotateCcw className="w-5 h-5" /> },
    { value: 'RENTAL_INCOME', label: 'Rental Income', icon: <HomeIcon className="w-5 h-5" /> },
    
    // General
    { value: 'OTHER', label: 'Other', icon: <MoreHorizontal className="w-5 h-5" /> },
  ]

  const selectedCategory = categories.find(c => c.value === category)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const numAmount = parseFloat(amount) || 0
    
    console.log('=== SUBMIT ATTEMPT ===')
    console.log('accountId:', accountId)
    console.log('amount:', numAmount)
    console.log('description:', description)
    console.log('type:', type)
    console.log('category:', category)
    
    if (!accountId || accountId === 0 || !numAmount || !description) {
      return
    }

    setLoading(true)
    
    try {
      const movementData = {
        accountId: accountId,
        category: category,
        type: type,
        amount: numAmount,
        description: description,
        date: date,
        status: status
      }

      const result = await movementApi.create(movementData)
      
      if (result.data) {
        setAmount('')
        setDescription('')
        setDate(format(new Date(), 'yyyy-MM-dd'))
        setCategory('OTHER')
        setStatus('CONFIRMED')
        
        onSuccess?.()
        onOpenChange(false)
      } else {
        alert('Failed to create movement: ' + result.error)
      }
    } catch (error) {
      alert('An error occurred while creating the movement')
    } finally {
      setLoading(false)
    }
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
  }

  return (
    <>
      {/* Main Drawer */}
      <Drawer open={open && !showCategoryDrawer} onOpenChange={onOpenChange}>
        <DrawerContent className="border-none" style={{ backgroundColor: 'var(--background)' }}>
          <form onSubmit={handleSubmit} className="px-6 pb-8">
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
              <CurrencyInput value={amount} 
                onChange={handleAmountChange} placeholder="0.00" className="text-5xl font-bold"/>
            </div>

            {/* Account Selector */}
            <div className="mb-8 flex justify-center">
              <Select value={accountId.toString()} onValueChange={(value) => {
                  const id = parseInt(value)
                  console.log('Account selected:', id)
                  setAccountId(id)
                }}>
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
            <Button type="submit" className={`w-full h-12 ${getButtonStyle(theme)}`} disabled={loading || !accountId || !parseFloat(amount) || !description}>
              {loading ? 'Creating...' : 'Create Movement'}
            </Button>
          </form>
        </DrawerContent>
      </Drawer>

      {/* Category Selection Drawer */}
      <Drawer open={showCategoryDrawer} onOpenChange={setShowCategoryDrawer}>
        <DrawerContent className="border-none max-h-[85vh]" style={{ backgroundColor: 'var(--background)' }}>
          <DrawerHeader className="sticky top-0 z-10" style={{ backgroundColor: 'var(--background)' }}>
            <DrawerTitle>Select Category</DrawerTitle>
            <DrawerDescription>Choose a category for this transaction</DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-8 overflow-y-auto max-h-[calc(85vh-80px)]">
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <Button key={cat.value} type="button" onClick={() => { setCategory(cat.value) 
                    setShowCategoryDrawer(false) 
                  }} className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all h-20 ${
                    category === cat.value ? getThemeButtonStyle(theme, 'primary') + ' text-white'
                      : 'bg-card text-foreground hover:bg-muted'}`}>
                  <div className={category === cat.value ? 'text-white' : 'text-muted-foreground'}>
                    {cat.icon}
                  </div>
                  <span className="text-sm text-center">
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