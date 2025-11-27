'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '../../../../components/ui/button'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { getAccountTypeColor } from '@/lib/bank/account-colors'
import { BankAccount, bankAccountApi } from '@/lib/api/bank-api'
import { UserProfile, userProfileApi } from '@/lib/api/user-api'
import { LoadingPage } from '@/components/mobile/loading/loading-page'
import { DashboardLayout } from '@/components/desktop/sidebar/dashboard-layout'
import { formatCurrency } from '@/lib/utils'

export default function AccountDetailPage() {
  const [account, setAccount] = useState<BankAccount | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const id = parseInt(params.id as string)

  useEffect(() => {
    if (id) {
      fetchAccount()
    }
  }, [id])

  const fetchAccount = async () => {
    setLoading(true)
    const result = await bankAccountApi.getById(id)
    
    if (result.data) {
      setAccount(result.data)
      
      const userResult = await userProfileApi.getById(result.data.userId)
      if (userResult.data) {
        setUser(userResult.data)
      }
      
      setError('')
    } else {
      setError(result.error || 'Failed to fetch account')
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this account?')) return
    
    const result = await bankAccountApi.delete(id)
    if (result.status === 200) {
      router.push('/bank/accounts')
    } else {
      setError('Failed to delete account')
    }
  }

  if (loading) {
    return (<LoadingPage title="Laoding Account..." loadingText="Processing • Please wait • Processing • " />)
  }

  if (error || !account) {
    return (
      <DashboardLayout title="Account Details">
        <div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Account not found'}
          </div>
          <Button onClick={() => router.push('/bank/accounts')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Accounts
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={account.accountName}>
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button size="sm" onClick={() => router.push('/bank/accounts')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => router.push(`/bank/accounts/${account.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Account Information */}
        <div className="rounded-lg shadow-smrounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Account ID</label>
                <p className="text-lg">#{account.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Owner</label>
                <p className="text-lg">
                  {user ? `${user.firstName} ${user.lastName}` : `User ${account.userId}`}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Name</label>
                <p className="text-lg">{account.accountName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Type</label>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getAccountTypeColor(account.type)}`}>
                  {account.type}
                </span>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">IBAN</label>
                <p className="text-lg font-mono p-3 rounded border">
                  {account.iban}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Current Balance</label>
                <p className="text-3xl font-bold">
                  {formatCurrency(account.balance)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Priority</label>
                <p className="text-lg">{account.priority}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}