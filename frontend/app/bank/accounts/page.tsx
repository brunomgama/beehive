'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { bankAccountApi, BankAccount } from '@/lib/api/bank-api'
import { getAccountTypeColor } from '@/lib/bank/account-colors'
import { UserProfile, userProfileApi } from '@/lib/api/user-api'
import { LoadingPage } from '@/components/mobile/loading/loading-page'
import { DashboardLayout } from '@/components/desktop/sidebar/dashboard-layout'
import { formatCurrency } from '@/lib/utils'

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [filteredAccounts, setFilteredAccounts] = useState<BankAccount[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchAccounts()
  }, [])

  useEffect(() => {
    const filtered = accounts.filter(account =>
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.iban.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredAccounts(filtered)
  }, [accounts, searchTerm])

  const fetchAccounts = async () => {
    setLoading(true)
    
    const [accountsResult, usersResult] = await Promise.all([
      bankAccountApi.getAll(),
      userProfileApi.getAll()
    ])
    
    if (accountsResult.data) {
      setAccounts(accountsResult.data)
    } else {
      setError(accountsResult.error || 'Failed to fetch accounts')
    }

    if (usersResult.data) {
      setUsers(usersResult.data)
    }
    
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this account?')) return
    
    const result = await bankAccountApi.delete(id)
    if (result.status === 200) {
      setAccounts(accounts.filter(account => account.id !== id))
    } else {
      setError('Failed to delete account')
    }
  }

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : `User ${userId}`
  }

  if (loading) {
    return (<LoadingPage title="Accounts listing..." loadingText="Processing • Please wait • Processing • " />)
  }

  return (
    <DashboardLayout title="Bank Accounts">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-8" />
              <Input placeholder="Search accounts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
            </div>
            <div className="text-sm text-gray-600">
              {filteredAccounts.length} of {accounts.length} accounts
            </div>
          </div>
          <Button onClick={() => router.push('/bank/accounts/new')} className="bg-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            Add Account
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
                <TableHead>Account Name</TableHead>
                <TableHead>IBAN</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Account Owner</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {searchTerm ? 'No accounts match your search.' : 'No accounts found.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.accountName}</TableCell>
                    <TableCell className="font-mono text-sm">{account.iban}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAccountTypeColor(account.type)}`}>
                        {account.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(account.balance)}
                    </TableCell>
                    <TableCell>{getUserName(account.userId)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" onClick={() => router.push(`/bank/accounts/${account.id}`)} >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={() => router.push(`/bank/accounts/${account.id}/edit`)} >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => account.id && handleDelete(account.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(account.priority)}
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