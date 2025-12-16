'use client'

import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table'
import { formatBalance } from '@/lib/util/utils'
import { useTheme } from '@/contexts/theme-context'
import { getButtonStyle } from '@/lib/themes'
import { useMovements } from '@/hooks/use-movements'

/**
 * Movements Desktop Component
 * Displays list of all transactions with filters and actions
 */
export default function MovementsDesktop() {
  const router = useRouter()
  const { theme } = useTheme()
  const {
    movements,
    accounts,
    loading,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterAccount,
    setFilterAccount,
    stats,
    handleDelete,
  } = useMovements()

  /**
   * Delete movement with confirmation
   */
  const onDelete = async (movementId: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return
    
    const success = await handleDelete(movementId)
    if (!success) {
      alert('Failed to delete transaction')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <div className="h-10 bg-muted rounded w-1/4 animate-pulse" />
          <div className="bg-card rounded-3xl p-6 h-96 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Transactions</h1>
            <p className="text-lg text-muted-foreground">
              {stats.total} transaction{stats.total !== 1 ? 's' : ''} • 
              <span className="text-ok ml-2">+{formatBalance(stats.income)}</span> • 
              <span className="text-nok ml-2">-{formatBalance(stats.expenses)}</span>
            </p>
          </div>
          
          <Button 
            onClick={() => router.push('/movements/add')} 
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl ${getButtonStyle(theme)} font-semibold shadow-lg hover:shadow-xl transition-all`}
          >
            <Plus size={20} />
            New Transaction
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Total Transactions */}
          <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <p className="text-sm text-muted-foreground font-medium">Total Transactions</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </div>

          {/* Total Income */}
          <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-sm text-muted-foreground font-medium">Total Income</p>
            </div>
            <p className="text-3xl font-bold text-green-600">+{formatBalance(stats.income)}</p>
          </div>

          {/* Total Expenses */}
          <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-sm text-muted-foreground font-medium">Total Expenses</p>
            </div>
            <p className="text-3xl font-bold text-red-600">-{formatBalance(stats.expenses)}</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="rounded-full border bg-background p-2 shadow-sm flex items-center gap-2">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="pl-11 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full px-4 hover:bg-muted">
                <Filter size={16} className="mr-2" />
                {filterType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType('ALL')}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('INCOME')}>Income Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('EXPENSE')}>Expenses Only</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Account Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full px-4 hover:bg-muted">
                <Filter size={16} className="mr-2" />
                {filterAccount ? accounts.find(a => a.id === filterAccount)?.accountName : 'All Accounts'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterAccount(null)}>All Accounts</DropdownMenuItem>
              {accounts.map(account => (
                <DropdownMenuItem key={account.id} onClick={() => setFilterAccount(account.id!)}>
                  {account.accountName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Button */}
          <Button size="icon" className={`rounded-full ${getButtonStyle(theme)}`}>
            <Search size={20} />
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">All Transactions</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => {
                const account = accounts.find(a => a.id === movement.accountId)
                
                return (
                  <TableRow key={movement.id}>
                    <TableCell className="font-medium">
                      {format(new Date(movement.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          movement.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {movement.type === 'INCOME' ? (
                            <ArrowUpRight size={16} className="text-green-700" />
                          ) : (
                            <ArrowDownRight size={16} className="text-red-700" />
                          )}
                        </div>
                        <span className="font-medium">{movement.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-block rounded-full px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700">
                        {movement.category}
                      </span>
                    </TableCell>
                    <TableCell>{account?.accountName}</TableCell>
                    <TableCell>
                      <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                        movement.type === 'INCOME' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {movement.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-bold ${
                        movement.type === 'INCOME' ? 'text-green-700' : 'text-foreground'
                      }`}>
                        {movement.type === 'INCOME' ? '+' : '-'}{formatBalance(Math.abs(movement.amount))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                        movement.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        movement.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {movement.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/movements/${movement.id}`)}>
                            <Eye size={16} className="mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/movements/${movement.id}/edit`)}>
                            <Edit2 size={16} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDelete(movement.id!)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 size={16} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="text-right font-semibold">
                  Net Balance
                </TableCell>
                <TableCell className="text-right font-bold text-foreground">
                  {formatBalance(stats.income - stats.expenses)}
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableFooter>
          </Table>
          
          {/* Empty State */}
          {movements.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No transactions found</p>
            </div>
          )}
          
          {movements.length > 0 && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Showing {movements.length} transaction{movements.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}