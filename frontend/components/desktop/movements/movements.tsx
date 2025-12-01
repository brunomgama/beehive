'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter} from "@/components/ui/table"
import { Movement, movementApi } from "@/lib/api/bank/movements-api"
import { BankAccount, bankAccountApi } from "@/lib/api/bank/accounts-api"
import { formatBalance } from "@/lib/util/converter"

export default function MovementsDesktop() {
  const { user } = useAuth()
  const router = useRouter()
  const [movements, setMovements] = useState<Movement[]>([])
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL')
  const [filterAccount, setFilterAccount] = useState<number | null>(null)

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

  const handleDelete = async (movementId: number) => {
    if (!confirm('Are you sure you want to delete this movement?')) return
    
    try {
      await movementApi.delete(movementId)
      await fetchData()
    } catch (error) {
      console.error('Error deleting movement:', error)
      alert('Failed to delete movement')
    }
  }

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'ALL' || movement.type === filterType
    const matchesAccount = !filterAccount || movement.accountId === filterAccount
    return matchesSearch && matchesType && matchesAccount
  })

  const stats = {
    total: filteredMovements.length,
    income: filteredMovements.filter(m => m.type === 'INCOME').reduce((sum, m) => sum + m.amount, 0),
    expenses: filteredMovements.filter(m => m.type === 'EXPENSE').reduce((sum, m) => sum + Math.abs(m.amount), 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <div className="h-10 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="bg-card rounded-3xl p-6 h-96 animate-pulse"></div>
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
            onClick={() => router.push('/bank/movements/new')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus size={20} />
            New Transaction
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Total Transactions */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <p className="text-sm text-muted-foreground font-medium">Total Transactions</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </div>

          {/* Total Income */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-sm text-muted-foreground font-medium">Total Income</p>
            </div>
            <p className="text-3xl font-bold text-green-600">+{formatBalance(stats.income)}</p>
          </div>

          {/* Total Expenses */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <p className="text-sm text-muted-foreground font-medium">Total Expenses</p>
            </div>
            <p className="text-3xl font-bold text-red-600">-{formatBalance(stats.expenses)}</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="rounded-full border border-border bg-background p-2 shadow-sm flex items-center gap-2">
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
          <Button size="icon" className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white">
            <Search size={20} />
          </Button>
        </div>

        {/* Table - Following OriginUI Principles */}
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
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
              {filteredMovements.map((movement) => {
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
                          <DropdownMenuItem onClick={() => router.push(`/bank/movements/${movement.id}`)}>
                            <Eye size={16} className="mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/bank/movements/${movement.id}/edit`)}>
                            <Edit2 size={16} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(movement.id!)}
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
                  Total Balance
                </TableCell>
                <TableCell className="text-right font-bold text-foreground">
                  {formatBalance(stats.income - stats.expenses)}
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableFooter>
          </Table>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Showing {filteredMovements.length} of {movements.length} transactions
          </p>
        </div>

        {/* Empty State */}
        {filteredMovements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  )
}