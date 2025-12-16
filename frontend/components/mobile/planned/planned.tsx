'use client'

import { useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Search, Filter, ArrowLeft, Repeat, Calendar } from "lucide-react"
import { format } from "date-fns"
import { useTheme } from "@/contexts/theme-context"
import { getMovementIcon } from "@/lib/util/movement-icons"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { getThemeButtonStyle } from "@/lib/themes"
import { formatBalance } from "@/lib/util/utils"
import { CATEGORY_LABELS } from '@/lib/util/categories'
import { usePlannedList } from '@/hooks/planned/use-planned-list'

export default function PlannedMovementsMobile() {
    const { theme } = useTheme()
    const router = useRouter()
    const {
        plannedMovements,
        accounts,
        loading,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        filterRecurrence,
        setFilterRecurrence,
        filterAccount,
        setFilterAccount,
        stats,
    } = usePlannedList()

    const [showFilters, setShowFilters] = useState(false)

    if (loading) {
        return (
            <div className="min-h-screen bg-background pb-32">
                <div className="bg-muted/30 px-6 pt-8 pb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <button className="p-2 rounded-full hover:bg-muted transition-colors">
                            <ArrowLeft className="w-6 h-6 text-foreground" />
                        </button>
                        <h1 className="text-2xl font-bold text-foreground">Planned Transactions</h1>
                    </div>
                
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-9 w-24 bg-muted rounded-full animate-pulse"></div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
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
            {/* Header Section */}
            <div className="bg-muted/30 px-6 pt-8 pb-6">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => router.push('/')}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                        aria-label="Back to home"
                    >
                        <ArrowLeft className="w-6 h-6 text-foreground" />
                    </button>
                    <h1 className="text-2xl font-bold text-foreground">Planned Transactions</h1>
                </div>
                
                {/* Tab Pills - Filter Type */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    <Button 
                        variant={filterType === 'ALL' ? 'default' : 'secondary'} 
                        size="sm"
                        onClick={() => setFilterType('ALL')} 
                        className={`rounded-full whitespace-nowrap h-9 px-4 flex-shrink-0 ${
                            filterType === 'ALL' ? `${getThemeButtonStyle(theme, 'navIndicator')} text-white` : ''
                        }`}
                    >
                        All planned
                    </Button>
                    <Button 
                        variant={filterType === 'INCOME' ? 'default' : 'secondary'}
                        size="sm" 
                        onClick={() => setFilterType('INCOME')} 
                        className="rounded-full whitespace-nowrap h-9 px-4 flex-shrink-0"
                        style={filterType === 'INCOME' ? { backgroundColor: 'var(--ok)', color: 'var(--ok-foreground)' } : {}}
                    >
                        Income
                    </Button>
                    <Button 
                        variant={filterType === 'EXPENSE' ? 'default' : 'secondary'}
                        size="sm" 
                        onClick={() => setFilterType('EXPENSE')} 
                        className="rounded-full whitespace-nowrap h-9 px-4 flex-shrink-0"
                        style={filterType === 'EXPENSE' ? { backgroundColor: 'var(--nok)', color: 'var(--nok-foreground)' } : {}}
                    >
                        Expenses
                    </Button>
                </div>

                {/* Filters Row */}
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

                {/* Filters Dropdown */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-border space-y-4">
                        {/* Account Filter */}
                        <div>
                            <p className="text-xs text-muted-foreground mb-2 font-medium">Account</p>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                <Button 
                                    variant={filterAccount === null ? 'default' : 'secondary'} 
                                    size="sm" 
                                    onClick={() => setFilterAccount(null)} 
                                    className="rounded-full whitespace-nowrap text-xs h-8"
                                >
                                    All Accounts
                                </Button>
                                {accounts.map(account => (
                                    <Button 
                                        key={account.id} 
                                        variant={filterAccount === account.id ? 'default' : 'secondary'} 
                                        size="sm" 
                                        onClick={() => setFilterAccount(account.id!)} 
                                        className="rounded-full whitespace-nowrap text-xs h-8"
                                    >
                                        {account.accountName}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Recurrence Filter */}
                        <div>
                            <p className="text-xs text-muted-foreground mb-2 font-medium">Frequency</p>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                <Button 
                                    variant={filterRecurrence === 'ALL' ? 'default' : 'secondary'} 
                                    size="sm" 
                                    onClick={() => setFilterRecurrence('ALL')} 
                                    className="rounded-full whitespace-nowrap text-xs h-8"
                                >
                                    All
                                </Button>
                                <Button 
                                    variant={filterRecurrence === 'DAILY' ? 'default' : 'secondary'} 
                                    size="sm" 
                                    onClick={() => setFilterRecurrence('DAILY')} 
                                    className="rounded-full whitespace-nowrap text-xs h-8"
                                >
                                    Daily
                                </Button>
                                <Button 
                                    variant={filterRecurrence === 'WEEKLY' ? 'default' : 'secondary'} 
                                    size="sm" 
                                    onClick={() => setFilterRecurrence('WEEKLY')} 
                                    className="rounded-full whitespace-nowrap text-xs h-8"
                                >
                                    Weekly
                                </Button>
                                <Button 
                                    variant={filterRecurrence === 'MONTHLY' ? 'default' : 'secondary'} 
                                    size="sm" 
                                    onClick={() => setFilterRecurrence('MONTHLY')} 
                                    className="rounded-full whitespace-nowrap text-xs h-8"
                                >
                                    Monthly
                                </Button>
                                <Button 
                                    variant={filterRecurrence === 'YEARLY' ? 'default' : 'secondary'} 
                                    size="sm" 
                                    onClick={() => setFilterRecurrence('YEARLY')} 
                                    className="rounded-full whitespace-nowrap text-xs h-8"
                                >
                                    Yearly
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="px-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card rounded-3xl p-4 shadow-sm border border-border">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-nok"></div>
                            <p className="text-xs text-muted-foreground font-medium">Monthly Expenses</p>
                        </div>
                        <p className="text-2xl font-bold text-nok">-{formatBalance(stats.monthlyExpenses)}</p>
                    </div>

                    <div className="bg-card rounded-3xl p-4 shadow-sm border border-border">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-ok"></div>
                            <p className="text-xs text-muted-foreground font-medium">Monthly Income</p>
                        </div>
                        <p className="text-2xl font-bold text-ok">+{formatBalance(stats.monthlyIncome)}</p>
                    </div>

                    <div className="bg-card rounded-3xl p-4 shadow-sm border border-border">
                        <div className="flex items-center gap-2 mb-1">
                            <Repeat size={12} className="text-blue-500" />
                            <p className="text-xs text-muted-foreground font-medium">Total Planned</p>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    </div>

                    <div className="bg-card rounded-3xl p-4 shadow-sm border border-border">
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar size={12} className="text-green-500" />
                            <p className="text-xs text-muted-foreground font-medium">Active</p>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{stats.active}</p>
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
                        placeholder="Search planned transactions..." 
                        className="pl-12 h-12 bg-card border-border rounded-2xl"
                    />
                </div>
            </div>

            {/* Planned Movements List */}
            <div className="px-6 space-y-3">
                {plannedMovements.length === 0 ? (
                    <div className="bg-card rounded-3xl p-12 shadow-sm border border-border text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Repeat className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">No planned transactions found</p>
                    </div>
                ) : (
                    plannedMovements.map((movement) => {
                        const icon = getMovementIcon(movement.description, movement.category)
                        const account = accounts.find(a => a.id === movement.accountId)
                        
                        return (
                            <div 
                                key={movement.id} 
                                className="bg-card rounded-3xl p-4 shadow-sm border border-border hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    {icon.type === 'image' ? (
                                        <div 
                                            className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0" 
                                            style={{ backgroundColor: icon.bgColor }}
                                        >
                                            <Image 
                                                src={icon.content} 
                                                alt={movement.description} 
                                                width={32} 
                                                height={32} 
                                                className="object-contain" 
                                            />
                                        </div>
                                    ) : icon.type === 'emoji' ? (
                                        <div 
                                            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" 
                                            style={{ backgroundColor: icon.bgColor }}
                                        >
                                            <span className="text-2xl">{icon.content}</span>
                                        </div>
                                    ) : (
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            movement.type === 'INCOME' ? 'bg-ok/10' : 'bg-nok/10'
                                        }`}>
                                            {movement.type === 'INCOME' ? (
                                                <ArrowUpRight size={20} className="text-ok" />
                                            ) : (
                                                <ArrowDownRight size={20} className="text-nok" />
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate">
                                            {movement.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                            <Calendar size={12} />
                                            <span>{format(new Date(movement.nextExecution), 'MMM dd, yyyy')}</span>
                                            {movement.recurrence !== 'CUSTOM' && (
                                                <>
                                                    <span>•</span>
                                                    <Repeat size={12} />
                                                    <span className="capitalize">{movement.recurrence.toLowerCase()}</span>
                                                </>
                                            )}
                                        </div>
                                        {account && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {account.accountName} • {CATEGORY_LABELS[movement.category]}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="text-right flex-shrink-0">
                                        <p className={`text-base font-bold ${
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
            {plannedMovements.length > 0 && (
                <div className="px-6 mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Showing {plannedMovements.length} planned transaction{plannedMovements.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}
        </div>
    )
}