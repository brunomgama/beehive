'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { movementApi, bankAccountApi, Movement, BankAccount } from '@/lib/api/bank-api'
import { getMovementTypeColor, getMovementStatusColor, getMovementCategoryColor } from '@/lib/bank/movement-colors'
import { LoadingPage } from '@/components/mobile/loading/loading-page'
import { DashboardLayout } from '@/components/desktop/sidebar/dashboard-layout'

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([])
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [filteredMovements, setFilteredMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = movements.filter(movement => {
      const account = accounts.find(acc => acc.id === movement.accountId)
      const accountName = account?.accountName || ''
      
      return movement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accountName.toLowerCase().includes(searchTerm.toLowerCase())
    })
    setFilteredMovements(filtered)
  }, [movements, accounts, searchTerm])

  const fetchData = async () => {
    setLoading(true)
    const [movementsResult, accountsResult] = await Promise.all([
      movementApi.getAll(),
      bankAccountApi.getAll()
    ])
    
    if (movementsResult.data) {
      setMovements(movementsResult.data)
    } else {
      setError(movementsResult.error || 'Failed to fetch movements')
    }

    if (accountsResult.data) {
      setAccounts(accountsResult.data)
    }
    
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this movement?')) return
    
    const result = await movementApi.delete(id)
    if (result.status === 200) {
      setMovements(movements.filter(movement => movement.id !== id))
    } else {
      setError('Failed to delete movement')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getAccountName = (accountId: number) => {
    const account = accounts.find(acc => acc.id === accountId)
    return account?.accountName || 'Unknown Account'
  }

  if (loading) {
    return (<LoadingPage title="Movements listing..." loadingText="Processing • Please wait • Processing • " />)
  }

  return (
    <DashboardLayout title="Bank Movements">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-8" />
              <Input placeholder="Search movements..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
            </div>
            <div className="text-sm text-gray-600">
              {filteredMovements.length} of {movements.length} movements
            </div>
          </div>
          <Button onClick={() => router.push('/bank/movements/new')} className="bg-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            Add Movement
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No movements match your search.' : 'No movements found.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="font-medium">{movement.description}</TableCell>
                    <TableCell>{getAccountName(movement.accountId)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMovementTypeColor(movement.type)}`}>
                        {movement.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMovementCategoryColor(movement.category)}`}>
                        {movement.category}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${movement.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {movement.type === 'EXPENSE' ? '-' : '+'}{formatCurrency(movement.amount)}
                    </TableCell>
                    <TableCell>{formatDate(movement.date)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMovementStatusColor(movement.status)}`}>
                        {movement.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" onClick={() => router.push(`/bank/movements/${movement.id}`)} >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={() => router.push(`/bank/movements/${movement.id}/edit`)} >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => movement.id && handleDelete(movement.id)} >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}