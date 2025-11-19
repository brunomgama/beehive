'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { bankAccountApi, BankAccount, PlannedMovement, plannedMovementApi } from '@/lib/api/bank-api'
import { getMovementTypeColor, getMovementStatusColor, getMovementCategoryColor, getMovementRecurrenceColor } from '@/lib/bank/movement-colors'
import { LoadingPage } from '@/components/mobile/loading/loading-page'
import { DashboardLayout } from '@/components/desktop/sidebar/dashboard-layout'

export default function PlannedMovementsPage() {
  const [plannedMovements, setPlannedMovements] = useState<PlannedMovement[]>([])
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [filteredPlannedMovement, setFilteredPlannedMovement] = useState<PlannedMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = plannedMovements.filter(plannedMovements => {
      const account = accounts.find(acc => acc.id === plannedMovements.accountId)
      const accountName = account?.accountName || ''
      
      return plannedMovements.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plannedMovements.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plannedMovements.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plannedMovements.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accountName.toLowerCase().includes(searchTerm.toLowerCase())
    })
    setFilteredPlannedMovement(filtered)
  }, [plannedMovements, accounts, searchTerm])

  const fetchData = async () => {
    setLoading(true)
    const [plannedMovementsResult, accountsResult] = await Promise.all([
      plannedMovementApi.getAll(),
      bankAccountApi.getAll()
    ])
    
    if (plannedMovementsResult.data) {
      setPlannedMovements(plannedMovementsResult.data)
    } else {
      setError(plannedMovementsResult.error || 'Failed to fetch planned movements')
    }

    if (accountsResult.data) {
      setAccounts(accountsResult.data)
    }
    
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this planned movement?')) return
    
    const result = await plannedMovementApi.delete(id)
    if (result.status === 200) {
      setPlannedMovements(plannedMovements.filter(plannedMovement => plannedMovement.id !== id))
    } else {
      setError('Failed to delete planned movement')
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
    return (<LoadingPage title="Planned Movements listing..." loadingText="Processing • Please wait • Processing • " />)
  }

  return (
    <DashboardLayout title="Bank Planned Movements">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search planned movements..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
            </div>
            <div className="text-sm text-gray-600">
              {filteredPlannedMovement.length} of {plannedMovements.length} planned movements
            </div>
          </div>
          <Button onClick={() => router.push('/bank/schedule/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Planned Movement
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
                
                <TableHead>Recurrence</TableHead>
                <TableHead>Next Execution</TableHead>

                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlannedMovement.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No movements match your search.' : 'No movements found.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlannedMovement.map((plannedMovement) => (
                  <TableRow key={plannedMovement.id}>
                    <TableCell className="font-medium">{plannedMovement.description}</TableCell>
                    <TableCell>{getAccountName(plannedMovement.accountId)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMovementTypeColor(plannedMovement.type)}`}>
                        {plannedMovement.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMovementCategoryColor(plannedMovement.category)}`}>
                        {plannedMovement.category}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${plannedMovement.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {plannedMovement.type === 'EXPENSE' ? '-' : '+'}{formatCurrency(plannedMovement.amount)}
                    </TableCell>

                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMovementRecurrenceColor(plannedMovement.recurrence)}`}>
                        {plannedMovement.recurrence}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(plannedMovement.nextExecution)}</TableCell>
                    
                    
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMovementStatusColor(plannedMovement.status)}`}>
                        {plannedMovement.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" onClick={() => router.push(`/bank/schedule/${plannedMovement.id}`)} >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={() => router.push(`/bank/schedule/${plannedMovement.id}/edit`)} >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => plannedMovement.id && handleDelete(plannedMovement.id)} >
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