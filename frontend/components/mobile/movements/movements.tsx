'use client'

import { useState, useEffect } from "react"
import { ArrowUpRight, ArrowDownRight, Search, Filter, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { getMovementIcon } from "@/lib/util/movement-icons"
import Image from "next/image"
import { Movement, movementApi } from "@/lib/api/bank/movements-api"
import { BankAccount, bankAccountApi } from "@/lib/api/bank/accounts-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { getThemeButtonStyle } from "@/lib/themes"
import { MovementDetailsDrawer } from "./movement-details-drawer"
import { MovementType } from "@/lib/api/types"
import { formatBalance } from "@/lib/util/utils"

const formatCategoryLabel = (category: string): string => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export default function MovementsMobile() {
    const { theme } = useTheme()
    const { user } = useAuth()
    const router = useRouter()
    const [movements, setMovements] = useState<Movement[]>([])
    const [accounts, setAccounts] = useState<BankAccount[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<'ALL' | MovementType>('ALL')
    const [showFilters, setShowFilters] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<number | null>(null)
    const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null)
    const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false)

    useEffect(() => {
        fetchData()
    }, [user?.id])

    const fetchData = async () => {
        if (!user?.id) return
        
        try {
            setLoading(true)
            const accountsResult = await bankAccountApi.getByUserId(user.id)
            if (accountsResult.data) {
                setAccounts(accountsResult.data)
                
                const allMovements: Movement[] = []
                for (const account of accountsResult.data) {
                    if (account.id) {
                        const movementsResult = await movementApi.getByAccountId(account.id)
                        if (movementsResult.data) {
                            allMovements.push(...movementsResult.data)
                        }
                    }
                }
                setMovements(allMovements.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                ))
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleMovementClick = (movement: Movement) => {
        setSelectedMovement(movement)
        setDetailsDrawerOpen(true)
    }

    const handleMovementSuccess = () => {
        fetchData()
    }

    const filteredMovements = movements.filter(movement => {
        const matchesSearch = movement.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = filterType === 'ALL' || movement.type === filterType
        const matchesAccount = !selectedAccount || movement.accountId === selectedAccount
        return matchesSearch && matchesType && matchesAccount
    })

    const stats = {
        total: filteredMovements.length,
        income: filteredMovements.filter(m => m.type === 'INCOME').reduce((sum, m) => sum + m.amount, 0),
        expenses: filteredMovements.filter(m => m.type === 'EXPENSE').reduce((sum, m) => sum + Math.abs(m.amount), 0),
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background pb-32">
                <div className="bg-muted/30 px-6 pt-8 pb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>
                    </div>
                
                    {/* Tab Pills Skeleton */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-9 w-24 bg-muted rounded-full animate-pulse"></div>
                        ))}
                    </div>

                    {/* Filter Row Skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
                        <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
                    </div>
                </div>

                <div className="px-6 space-y-4 mt-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-card rounded-3xl p-4 shadow-sm border border-border animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-muted rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-muted rounded w-2/3"></div>
                                    <div className="h-3 bg-muted rounded w-1/3"></div>
                                </div>
                                <div className="h-5 bg-muted rounded w-16"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header Section with new design */}
            <div className="bg-muted/30 px-6 pt-8 pb-6">
                {/* Back Arrow and Title */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => router.push('/')}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                        aria-label="Back to home"
                    >
                        <ArrowLeft className="w-6 h-6 text-foreground" />
                    </button>
                    <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>
                </div>
                
                {/* Tab Pills - Filter Type */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    <Button 
                        variant={filterType === 'ALL' ? 'default' : 'secondary'} 
                        size="sm"
                        onClick={() => setFilterType('ALL')} 
                        className={`rounded-full whitespace-nowrap h-9 px-4 ${
                            filterType === 'ALL' 
                                ? `${getThemeButtonStyle(theme, 'navIndicator')} text-white`
                                : ''
                        }`}
                    >
                        All transactions
                    </Button>
                    <Button 
                        variant={filterType === 'INCOME' ? 'default' : 'secondary'}
                        size="sm" 
                        onClick={() => setFilterType('INCOME')} 
                        className="rounded-full whitespace-nowrap h-9 px-4"
                        style={filterType === 'INCOME' ? { backgroundColor: 'var(--ok)', color: 'var(--ok-foreground)' } : {}}
                    >
                        Income
                    </Button>
                    <Button 
                        variant={filterType === 'EXPENSE' ? 'default' : 'secondary'}
                        size="sm" 
                        onClick={() => setFilterType('EXPENSE')} 
                        className="rounded-full whitespace-nowrap h-9 px-4"
                        style={filterType === 'EXPENSE' ? { backgroundColor: 'var(--nok)', color: 'var(--nok-foreground)' } : {}}
                    >
                        Expenses
                    </Button>
                </div>

                {/* Filters and Sort Row */}
                <div className="flex items-center justify-between">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowFilters(!showFilters)}
                        className="h-auto p-0 hover:bg-transparent text-foreground"
                    >
                        <Filter size={16} className="mr-2" />
                        <span className="text-sm font-medium">Filters</span>
                    </Button>
                </div>

                {/* Account Filter Dropdown */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            <Button 
                                variant={selectedAccount === null ? 'default' : 'secondary'} 
                                size="sm" 
                                onClick={() => setSelectedAccount(null)} 
                                className="rounded-full whitespace-nowrap text-xs h-8"
                            >
                                All Accounts
                            </Button>
                            {accounts.map(account => (
                                <Button 
                                    key={account.id} 
                                    variant={selectedAccount === account.id ? 'default' : 'secondary'} 
                                    size="sm"
                                    onClick={() => setSelectedAccount(account.id!)} 
                                    className="rounded-full whitespace-nowrap text-xs h-8"
                                >
                                    {account.accountName}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="px-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                    {/* Income */}
                    <div className="bg-card rounded-3xl p-4 shadow-sm border border-border">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-ok"></div>
                            <p className="text-xs text-muted-foreground font-medium">Income</p>
                        </div>
                        <p className="text-2xl font-semibold text-ok">+{formatBalance(stats.income)}</p>
                    </div>

                    {/* Expenses */}
                    <div className="bg-card rounded-3xl p-4 shadow-sm border border-border">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-nok"></div>
                            <p className="text-xs text-muted-foreground font-medium">Expenses</p>
                        </div>
                        <p className="text-2xl font-semibold text-nok">-{formatBalance(stats.expenses)}</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 mb-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder="Search transactions..." 
                        className="pl-12 h-12 bg-card border-border rounded-2xl"
                    />
                </div>
            </div>

            {/* Movements List */}
            <div className="px-6 space-y-3">
                {filteredMovements.length === 0 ? (
                    <div className="bg-card rounded-3xl p-12 shadow-sm border border-border text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">No transactions found</p>
                    </div>
                ) : (
                    filteredMovements.map((movement) => {
                        const icon = getMovementIcon(movement.description, movement.category)
                        const account = accounts.find(a => a.id === movement.accountId)
                        
                        return (
                            <div 
                                key={movement.id} 
                                onClick={() => handleMovementClick(movement)}
                                className="bg-card rounded-3xl p-4 shadow-sm border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    {icon.type === 'image' ? (
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: icon.bgColor }}>
                                            <Image src={icon.content} alt={movement.description} width={32} height={32} className="object-contain" />
                                        </div>
                                    ) : icon.type === 'emoji' ? (
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: icon.bgColor }}>
                                            <span className="text-2xl">{icon.content}</span>
                                        </div>
                                    ) : (
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${movement.type === 'INCOME' ? 'bg-ok/10' : 'bg-nok/10'}`}>
                                            {movement.type === 'INCOME' ? (
                                                <ArrowUpRight size={20} className="text-ok" />
                                            ) : (
                                                <ArrowDownRight size={20} className="text-nok" />
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {movement.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                            <span>{format(new Date(movement.date), 'MMM dd, yyyy')}</span>
                                            {account && (
                                                <>
                                                    <span>•</span>
                                                    <span className="truncate">{account.accountName}</span>
                                                </>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{formatCategoryLabel(movement.category)}</p>
                                    </div>
                                    
                                    <div className="text-right flex-shrink-0">
                                        <p className={`text-base font-semibold ${
                                            movement.type === 'INCOME' ? 'text-ok' : 'text-foreground'
                                        }`}>
                                            {movement.type === 'INCOME' ? '+' : '-'}{formatBalance(Math.abs(movement.amount))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Results Count */}
            {filteredMovements.length > 0 && (
                <div className="px-6 mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Showing {filteredMovements.length} of {movements.length} transaction{movements.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}

            {/* Movement Details Drawer */}
            <MovementDetailsDrawer open={detailsDrawerOpen} onOpenChange={setDetailsDrawerOpen} 
            movement={selectedMovement} accounts={accounts} onSuccess={handleMovementSuccess}/>
        </div>
    )
}