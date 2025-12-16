'use client'

import { useRouter } from "next/navigation"
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, ArrowUpRight, ArrowDownRight, Calendar, Clock, Repeat } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter} from "@/components/ui/table"
import { formatBalance } from "@/lib/util/utils"
import { useTheme } from "@/contexts/theme-context"
import { getButtonStyle } from "@/lib/themes"
import { usePlannedList } from "@/hooks/planned/use-planned-list"

export default function PlannedMovementsDesktop() {
  const router = useRouter()
  const { theme } = useTheme()
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
    handleDelete,
  } = usePlannedList()

  const onDelete = async (plannedId: number) => {
    if (!confirm('Are you sure you want to delete this planned transaction?')) return
    const success = await handleDelete(plannedId)
    if (!success) alert('Failed to delete planned transaction')
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Planned Transactions</h1>
            <p className="text-lg text-muted-foreground">
              {stats.total} scheduled transaction{stats.total !== 1 ? 's' : ''} • {stats.active} active
            </p>
          </div>
          
          <Button onClick={() => router.push('/planned/add')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl ${getButtonStyle(theme)} font-semibold shadow-lg hover:shadow-xl transition-all`}>
            <Plus size={20} />
            Add Planned Transaction
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <p className="text-sm text-muted-foreground font-medium">Total Planned</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </div>

          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <p className="text-sm text-muted-foreground font-medium">Active</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.active}</p>
          </div>

          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-sm text-muted-foreground font-medium">Monthly Income</p>
            </div>
            <p className="text-3xl font-bold text-green-600">+{formatBalance(stats.monthlyIncome)}</p>
          </div>

          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <p className="text-sm text-muted-foreground font-medium">Monthly Expenses</p>
            </div>
            <p className="text-3xl font-bold text-red-600">-{formatBalance(stats.monthlyExpenses)}</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="rounded-full border border-border bg-background p-2 shadow-sm flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search planned transactions..."
              className="pl-11 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full px-4 hover:bg-muted">
                <Filter size={16} className="mr-2" />
                {filterRecurrence}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterRecurrence('ALL')}>All Frequencies</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRecurrence('DAILY')}>Daily</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRecurrence('WEEKLY')}>Weekly</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRecurrence('MONTHLY')}>Monthly</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRecurrence('YEARLY')}>Yearly</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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

          <Button size="icon" className={`rounded-full ${getButtonStyle(theme)}`}>
            <Search size={20} />
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">All Planned Transactions</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Recurrence</TableHead>
                <TableHead>Next Execution</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plannedMovements.map((movement) => {
                const account = accounts.find(a => a.id === movement.accountId)
                
                return (
                  <TableRow key={movement.id}>
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium capitalize">{movement.recurrence.toLowerCase()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-muted-foreground" />
                        <span className="text-sm">{format(new Date(movement.nextExecution), 'MMM dd, yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span className="text-sm">{format(new Date(movement.endDate), 'MMM dd, yyyy')}</span>
                      </div>
                    </TableCell>
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
                        movement.status === 'CONFIRMED' || movement.status === 'PENDING' ? 'bg-green-100 text-green-700' :
                        movement.status === 'CANCELLED' ? 'bg-gray-200 text-gray-700' :
                        'bg-red-100 text-red-700'
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
                          <DropdownMenuItem onClick={() => router.push(`/planned/${movement.id}/edit`)}>
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
                <TableCell colSpan={7} className="text-right font-semibold">
                  Estimated Monthly Net
                </TableCell>
                <TableCell className="text-right font-bold text-foreground">
                  {formatBalance(stats.monthlyIncome - stats.monthlyExpenses)}
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableFooter>
          </Table>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Showing {plannedMovements.length} planned transaction{plannedMovements.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Empty State */}
        {plannedMovements.length === 0 && (
          <div className="text-center py-12">
            <Repeat size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No planned transactions found</p>
            <p className="text-sm text-muted-foreground mb-4">
              Create recurring transactions to automate your finances
            </p>
            <Button onClick={() => router.push('/planned/add')}
              className={getButtonStyle(theme)}>
              <Plus size={16} className="mr-2" />
              Create Your First Planned Transaction
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}