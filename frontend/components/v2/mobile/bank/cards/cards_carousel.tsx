'use client'

import { BankAccount } from "@/lib/api/bank-api";
import { User } from "@/lib/v2/api/auth/auth-api";
import { bankAccountApi } from "@/lib/v2/api/banks/accounts-api";
import { useEffect, useState } from "react";
import { TrendingDown, Wallet, Ellipsis, ChartNoAxesCombined, Plus } from "lucide-react";
import { formatBalance } from "@/lib/v2/util/converter";
import { getCardGradient } from "@/lib/v2/util/credit_card";
import { useAccount } from "../context/account_context";
import { Button } from "@/components/v2/ui/button";
import { AddMovementDrawer } from "../movements/add_movement";

export function CardsCarousel({user}: {user: User}) {
    const [accounts, setAccounts] = useState<BankAccount[]>([])
    const [loading, setLoading] = useState(true)
    const [activeIndex, setActiveIndex] = useState(0)
    const [touchStart, setTouchStart] = useState<number>(0)
    const [drawerOpen, setDrawerOpen] = useState(false)
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
            console.error('❌ Error fetching accounts:', error);
        } finally {
            setLoading(false);
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

    const handleOpenDrawer = () => {
        const currentAccount = accounts[activeIndex]
        setDrawerOpen(true)
    }

    if (loading) {
        return (
            <div className="h-48 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange"></div>
            </div>
        )
    }

    if (accounts.length === 0) {
        return (
            <div className="h-48 flex flex-col items-center justify-center px-6">
                <Wallet className="w-12 h-12 text-muted-foreground mb-3" />
                <h2 className="text-xl font-bold text-foreground mb-1">No Accounts Yet</h2>
                <p className="text-sm text-muted-foreground text-center">
                    Add your first bank account
                </p>
            </div>
        )
    }

    return (
        <div className="bg-background">
            <div className="px-6 mt-6">
                <div className="relative h-44 overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    {accounts.map((account, index) => {
                        const isActive = index === activeIndex
                        const isPrev = index < activeIndex
                        const isNext = index > activeIndex

                        return (
                            <div 
                                key={account.id} 
                                className="absolute inset-0 transition-all duration-300 ease-out"
                                style={{transform: isPrev ? 'translateX(-100%)' : isNext ? 'translateX(100%)' : 'translateX(0)', opacity: isActive ? 1 : 0, 
                                    zIndex: isActive ? 10 : 1, pointerEvents: isActive ? 'auto' : 'none'
                                }}>
                                <div className={`w-full h-full bg-gradient-to-br ${getCardGradient(account.type)} 
                                    rounded-2xl shadow-xl p-5 flex flex-col justify-between text-white relative overflow-hidden`}>
                                    
                                    {/* Background Pattern */}
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -translate-y-24 translate-x-24"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full translate-y-16 -translate-x-16"></div>

                                    {/* Card Header */}
                                    <div className="relative z-10">
                                        <h2 className="text-base font-bold">{account.accountName}</h2>
                                    </div>

                                    {/* Card Balance */}
                                    <div className="relative z-10">
                                        <h1 className="text-3xl font-bold mb-3">{formatBalance(account.balance)}</h1>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-mono tracking-wider">
                                                {account.iban.slice(0, 4)} •••• {account.iban.slice(-4)}
                                            </p>
                                            <div className="flex gap-0.5">
                                                <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm"></div>
                                                <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm -ml-2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="flex justify-center gap-1.5 mt-4">
                {accounts.map((_, index) => (
                    <button key={index} onClick={() => setActiveIndex(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === activeIndex ? 'w-6 bg-orange' : 'w-1.5 bg-gray-400'
                        }`}
                    />
                ))}
            </div>

            <div className="px-6 mt-5">
                <div className="grid grid-cols-4 gap-3">
                    <Button onClick={handleOpenDrawer}
                        className="flex flex-col items-center justify-center bg-orange rounded-xl h-10 shadow-xl">
                        <Plus className="w-5 h-5 text-white" />
                    </Button>
                    
                    <Button className="flex flex-col items-center justify-center bg-orange rounded-xl h-10 shadow-xl">
                        <TrendingDown className="w-5 h-5 text-white" />
                    </Button>
                    
                    <Button className="flex flex-col items-center justify-center bg-orange rounded-xl h-10 shadow-xl">
                        <ChartNoAxesCombined className="w-5 h-5 text-white" />
                    </Button>
                    
                    <Button className="flex flex-col items-center justify-center bg-orange rounded-xl h-10 shadow-xl">
                        <Ellipsis className="w-5 h-5 text-white" />
                    </Button>
                </div>
            </div>

            <AddMovementDrawer open={drawerOpen} onOpenChange={setDrawerOpen} accounts={accounts} 
                defaultAccountId={accounts[activeIndex]?.id} onSuccess={handleMovementSuccess}/>
        </div>
    );
}