'use client'

import { User } from "@/lib/api/auth/auth-api"
import { useEffect, useState } from "react"
import { Plus, Repeat, TrendingUp, Wallet } from "lucide-react"
import { useAccount } from "./account_context"
import { AddMovementDrawer } from "./add_movement"
import { AddTransferDrawer } from "./add_transfer"
import { useTheme } from "@/contexts/theme-context"
import { BankAccount, bankAccountApi } from "@/lib/api/bank/accounts-api"
import { getCardGradient } from "@/lib/util/credit_card"
import { formatBalance } from "@/lib/util/converter"
import { Button } from "@/components/ui/button"
import { getThemeButtonStyle, getButtonStyle } from "@/lib/themes"

export function CardsCarousel({user}: {user: User}) {
    const { theme } = useTheme()
    const [accounts, setAccounts] = useState<BankAccount[]>([])
    const [loading, setLoading] = useState(true)
    const [activeIndex, setActiveIndex] = useState(0)
    const [touchStart, setTouchStart] = useState<number>(0)
    const [drawerMovementOpen, setMovementDrawerOpen] = useState(false)
    const [drawerTransferOpen, setTransferDrawerOpen] = useState(false)
    const { setActiveAccountId } = useAccount()

    useEffect(() => {
        fetchUserAccounts()
    }, [user.id])

    const fetchUserAccounts = async () => {
        try {
            const result = await bankAccountApi.getByUserId(user.id)
            
            if(result.data && Array.isArray(result.data)) {
                const userAccounts = result.data.filter((account: BankAccount) => 
                    account.userId === user.id
                )
                const sortedAccounts = userAccounts.sort((a, b) => a.priority - b.priority)
                
                setAccounts(sortedAccounts)
                if(sortedAccounts.length > 0 && sortedAccounts[0].id) {
                    setActiveAccountId(sortedAccounts[0].id)
                }
            }
        } catch (error) {
            console.error('Error fetching accounts:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(accounts.length > 0 && accounts[activeIndex]?.id) {
            setActiveAccountId(accounts[activeIndex].id)
        }
    }, [activeIndex, accounts, setActiveAccountId])

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX)
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEnd = e.changedTouches[0].clientX
        const diff = touchStart - touchEnd
        
        if (Math.abs(diff) > 50) {
            if (diff > 0 && activeIndex < accounts.length - 1) {
                setActiveIndex(activeIndex + 1)
            } else if (diff < 0 && activeIndex > 0) {
                setActiveIndex(activeIndex - 1)
            }
        }
    }

    const handleMovementSuccess = () => {
        fetchUserAccounts()
        
        if (typeof (window as any).refreshRecentMovements === 'function') {
            (window as any).refreshRecentMovements()
        }
    }

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (accounts.length === 0) {
        return (
            <div className="px-6 pt-16 pb-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                    <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Accounts Yet</h2>
                    <p className="text-sm text-gray-500">Add your first bank account to get started</p>
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
                <div className="relative h-52 overflow-hidden rounded-3xl" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    {accounts.map((account, index) => {
                        const isActive = index === activeIndex
                        const isPrev = index < activeIndex
                        const isNext = index > activeIndex

                        return (
                            <div key={account.id} className="absolute inset-0 transition-all duration-300 ease-out"
                                style={{transform: isPrev ? 'translateX(-100%)' : isNext ? 'translateX(100%)' : 'translateX(0)', 
                                    opacity: isActive ? 1 : 0, zIndex: isActive ? 10 : 1, pointerEvents: isActive ? 'auto' : 'none'}}>
                                
                                {/* Card Container with solid gradient background */}
                                <div className={`w-full h-full rounded-3xl shadow-2xl p-6 flex flex-col justify-between text-white relative overflow-hidden
                                    bg-gradient-to-br ${getCardGradient(account.type)} opacity-75 mix-blend-overlay`}>
                                    
                                    {/* Decorative circles */}
                                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/20 rounded-full"></div>
                                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/20 rounded-full"></div>

                                    {/* Card Header */}
                                    <div className="relative z-10">
                                        <p className="text-sm text-white/80 mb-1 font-medium">Current Balance</p>
                                        <h2 className="text-lg font-semibold drop-shadow-lg">{account.accountName}</h2>
                                    </div>

                                    {/* Card Balance */}
                                    <div className="relative z-10">
                                        <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">{formatBalance(account.balance)}</h1>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-mono tracking-wider opacity-80 drop-shadow-md">
                                                {account.iban.slice(0, 4)} •••• {account.iban.slice(-4)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Inner glow effect */}
                                    <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_rgba(255,255,255,0.1)] pointer-events-none"></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mb-6">
                {accounts.map((_, index) => (
                    <button key={index} onClick={() => setActiveIndex(index)} className={`h-2 rounded-full transition-all duration-300 ${
                            index === activeIndex ? `w-8 ${getButtonStyle(theme)}` : `w-2 ${getButtonStyle(theme)}`}`} />
                ))}
            </div>

            {/* Quick Actions */}
            <div className="px-6">
                <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => setMovementDrawerOpen(true)} 
                        className={`rounded-2xl p-7 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300 ${getButtonStyle(theme)}`}>
                        <Plus size={24} className={`${getButtonStyle(theme)}`} />
                        <div className="text-left">
                            <p className={`text-sm font-semibold ${getButtonStyle(theme)}`}>Add</p>
                            <p className={`text-xs opacity-70 ${getButtonStyle(theme)}`}>Transaction</p>
                        </div>
                    </Button>

                    <Button onClick={() => setTransferDrawerOpen(true)} 
                        className={`rounded-2xl p-7 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300 ${getButtonStyle(theme)}`}>
                        <Repeat size={24} className={`${getButtonStyle(theme)}`} />
                        <div className="text-left">
                            <p className={`text-sm font-semibold ${getButtonStyle(theme)}`}>Transfer</p>
                            <p className={`text-xs opacity-70 ${getButtonStyle(theme)}`}>Between Accounts</p>
                        </div>
                    </Button>
                </div>
            </div>

            <AddMovementDrawer open={drawerMovementOpen} onOpenChange={setMovementDrawerOpen} 
            accounts={accounts} defaultAccountId={accounts[activeIndex]?.id} onSuccess={handleMovementSuccess}/>

            <AddTransferDrawer open={drawerTransferOpen} onOpenChange={setTransferDrawerOpen} 
            accounts={accounts} defaultAccountId={accounts[activeIndex]?.id} onSuccess={handleMovementSuccess}/>
        </div>
    )
}