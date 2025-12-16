'use client'

import { User } from "@/lib/api/auth/auth-api"
import { useEffect, useState } from "react"
import { ClockFading, Plus, Repeat, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAccount } from "./account_context"
import { AddMovementDrawer } from "./add_movement"
import { AddTransferDrawer } from "./add_transfer"
import { AddPlannedDrawer } from "./add_planned"
import { useTheme } from "@/contexts/theme-context"
import { BankAccount, bankAccountApi } from "@/lib/api/bank/accounts-api"
import { formatBalance, getCardGradient } from "@/lib/util/utils"
import { Button } from "@/components/ui/button"
import { getButtonStyle } from "@/lib/themes"

interface CardsCarouselProps {
  user: User
}

/**
 * Cards Carousel Component
 * Displays user's bank accounts in a swipeable carousel
 * Manages active account state and quick action drawers
 */
export function CardsCarousel({ user }: CardsCarouselProps) {
  const router = useRouter()
  const { theme } = useTheme()
  const { setActiveAccountId } = useAccount()
  
  // Account state
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Touch gesture state
  const [touchStart, setTouchStart] = useState<number>(0)
  
  // Drawer state
  const [drawerMovementOpen, setMovementDrawerOpen] = useState(false)
  const [drawerTransferOpen, setTransferDrawerOpen] = useState(false)
  const [drawerPlannedOpen, setPlannedDrawerOpen] = useState(false)

  /**
   * Fetch user's accounts on mount
   */
  useEffect(() => {
    fetchUserAccounts()
  }, [user.id])

  /**
   * Fetch and sort user's bank accounts
   */
  const fetchUserAccounts = async () => {
    try {
      const result = await bankAccountApi.getByUserId(user.id)
      
      if (result.data && Array.isArray(result.data)) {
        const userAccounts = result.data.filter((account: BankAccount) => 
          account.userId === user.id
        )
        const sortedAccounts = userAccounts.sort((a, b) => a.priority - b.priority)
        
        setAccounts(sortedAccounts)
        
        // Set first account as active
        if (sortedAccounts.length > 0 && sortedAccounts[0].id) {
          setActiveAccountId(sortedAccounts[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update active account when carousel index changes
   */
  useEffect(() => {
    if (accounts.length > 0 && accounts[activeIndex]?.id) {
      setActiveAccountId(accounts[activeIndex].id)
    }
  }, [activeIndex, accounts, setActiveAccountId])

  /**
   * Handle touch start for swipe gesture
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  /**
   * Handle touch end for swipe gesture
   * Swipe left/right to navigate between cards
   */
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd
    
    // Minimum swipe distance: 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < accounts.length - 1) {
        // Swipe left - next card
        setActiveIndex(activeIndex + 1)
      } else if (diff < 0 && activeIndex > 0) {
        // Swipe right - previous card
        setActiveIndex(activeIndex - 1)
      }
    }
  }

  /**
   * Handle successful movement/transfer/planned creation
   * Refreshes accounts and recent movements
   */
  const handleSuccess = () => {
    fetchUserAccounts()
    
    // Trigger refresh of recent movements if function exists
    if (typeof (window as any).refreshRecentMovements === 'function') {
      (window as any).refreshRecentMovements()
    }
  }

  /**
   * Navigate to add account page
   */
  const handleAddAccount = () => {
    router.push('/accounts/add')
  }

  // Loading state
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  // Empty state - no accounts
  if (accounts.length === 0) {
    return (
      <div className="px-6 pt-16 pb-6">
        <div className="bg-card rounded-3xl p-8 shadow-sm border text-center">
          <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">No Accounts Yet</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Add your first bank account to get started
          </p>
          <Button 
            onClick={handleAddAccount}
            className={`${getButtonStyle(theme)}`}
          >
            <Plus className="mr-2" size={20} />
            Add Account
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-8 pb-6">
      {/* Header */}
      <div className="px-6 mb-6">
        <h1 className="text-4xl font-bold text-foreground">Finance</h1>
      </div>

      {/* Cards Carousel */}
      <div className="px-6 mb-6">
        <div 
          className="relative h-52 overflow-hidden rounded-3xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {accounts.map((account, index) => {
            const isActive = index === activeIndex
            const isPrev = index < activeIndex
            const isNext = index > activeIndex

            return (
              <div
                key={account.id}
                className="absolute inset-0 transition-all duration-300 ease-out"
                style={{
                  transform: isPrev ? 'translateX(-100%)' : isNext ? 'translateX(100%)' : 'translateX(0)',
                  opacity: isActive ? 1 : 0,
                  zIndex: isActive ? 10 : 1,
                  pointerEvents: isActive ? 'auto' : 'none'
                }}
              >
                {/* Card Container */}
                <div className={`w-full h-full rounded-3xl shadow-2xl p-6 flex flex-col justify-between text-white relative overflow-hidden
                  bg-gradient-to-br ${getCardGradient(account.type)}`}>
                  
                  {/* Decorative circles */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/20 rounded-full" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/20 rounded-full" />

                  {/* Card Header */}
                  <div className="relative z-10">
                    <p className="text-sm text-white/80 mb-1 font-medium">Current Balance</p>
                    <h2 className="text-lg font-semibold drop-shadow-lg">{account.accountName}</h2>
                  </div>

                  {/* Card Balance */}
                  <div className="relative z-10">
                    <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
                      {formatBalance(account.balance)}
                    </h1>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-mono tracking-wider opacity-80 drop-shadow-md">
                        {account.iban.slice(0, 4)} •••• {account.iban.slice(-4)}
                      </p>
                    </div>
                  </div>

                  {/* Inner glow effect */}
                  <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_rgba(255,255,255,0.1)] pointer-events-none" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mb-6">
        {accounts.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? `w-8 ${getButtonStyle(theme)}` : `w-2 bg-muted`
            }`}
            aria-label={`Go to account ${index + 1}`}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-6">
        <div className="flex gap-4">
          
          {/* Add Movement Button */}
          <Button
            onClick={() => setMovementDrawerOpen(true)}
            className={`flex-1 rounded-2xl py-5 px-4 shadow-sm flex items-center gap-3 
              hover:shadow-md transition-all duration-300 ${getButtonStyle(theme)}`}
          >
            <Plus size={24} />
            <div className="text-left">
              <p className="text-sm font-semibold">Movement</p>
            </div>
          </Button>

          {/* Transfer Button */}
          <Button
            onClick={() => setTransferDrawerOpen(true)}
            className={`flex-1 rounded-2xl py-5 px-4 shadow-sm flex items-center gap-3 
              hover:shadow-md transition-all duration-300 ${getButtonStyle(theme)}`}
          >
            <Repeat size={24} />
            <div className="text-left">
              <p className="text-sm font-semibold">Transfer</p>
            </div>
          </Button>

          {/* Planned Button */}
          <Button
            onClick={() => setPlannedDrawerOpen(true)}
            className={`w-16 rounded-2xl py-5 shadow-sm flex items-center justify-center 
              hover:shadow-md transition-all duration-300 ${getButtonStyle(theme)}`}
            aria-label="Add planned movement"
          >
            <ClockFading size={24} />
          </Button>
        </div>
      </div>

      {/* Drawers */}
      <AddMovementDrawer
        open={drawerMovementOpen}
        onOpenChange={setMovementDrawerOpen}
        accounts={accounts}
        defaultAccountId={accounts[activeIndex]?.id}
        onSuccess={handleSuccess}
      />

      <AddTransferDrawer
        open={drawerTransferOpen}
        onOpenChange={setTransferDrawerOpen}
        accounts={accounts}
        defaultAccountId={accounts[activeIndex]?.id}
        onSuccess={handleSuccess}
      />

      <AddPlannedDrawer
        open={drawerPlannedOpen}
        onOpenChange={setPlannedDrawerOpen}
        accounts={accounts}
        defaultAccountId={accounts[activeIndex]?.id}
        onSuccess={handleSuccess}
      />
    </div>
  )
}