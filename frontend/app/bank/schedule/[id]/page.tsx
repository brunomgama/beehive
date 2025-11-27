'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '../../../../components/ui/button'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { getMovementTypeColor, getMovementStatusColor, getMovementCategoryColor } from '@/lib/bank/movement-colors'
import { BankAccount, bankAccountApi, PlannedMovement, plannedMovementApi } from '@/lib/api/bank-api'
import { LoadingPage } from '@/components/mobile/loading/loading-page'
import { DashboardLayout } from '@/components/desktop/sidebar/dashboard-layout'
import { formatCurrency, formatDayLabel } from '@/lib/utils'

export default function PlannedMovementDetailPage() {
  const [plannedMovement, setPlannedMovement] = useState<PlannedMovement | null>(null)
  const [account, setAccount] = useState<BankAccount | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const id = parseInt(params.id as string)

  useEffect(() => {
    if (id) {
      fetchPlannedMovement()
    }
  }, [id])

  const fetchPlannedMovement = async () => {
    setLoading(true)
    const result = await plannedMovementApi.getById(id)
    
    if (result.data) {
      setPlannedMovement(result.data)
      // Fetch the account details
      const accountResult = await bankAccountApi.getById(result.data.accountId)
      if (accountResult.data) {
        setAccount(accountResult.data)
      }
      setError('')
    } else {
      setError(result.error || 'Failed to fetch plannedMovement')
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this plannedMovement?')) return
    
    const result = await plannedMovementApi.delete(id)
    if (result.status === 200) {
      router.push('/bank/schedule')
    } else {
      setError('Failed to delete plannedMovement')
    }
  }

  if (loading) {
    return (<LoadingPage title="Loading Planned Movement..." loadingText="Processing • Please wait • Processing • " />)
  }

  if (error || !plannedMovement) {
    return (
      <DashboardLayout title="Planned Movement Details">
        <div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Planned Movement not found'}
          </div>
          <Button onClick={() => router.push('/bank/schedule')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Planned Movements
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Planned Movement Details">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button size="sm" onClick={() => router.push('/bank/schedule')} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => router.push(`/bank/schedule/${plannedMovement.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Planned Movement Information */}
        <div className="rounded-lg shadow-sm rounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Planned Movement Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Planned Movement ID</label>
                <p className="text-lg">#{plannedMovement.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Recurrence</label>
                <p className="text-lg">{plannedMovement.recurrence}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <p className="text-lg p-3 rounded border">
                  {plannedMovement.description}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account</label>
                <p className="text-lg">
                  {account ? account.accountName : `Account ID: ${plannedMovement.accountId}`}
                  {account && (
                    <>
                      <br />
                      <span className="text-sm font-mono">{account.iban}</span>
                    </>
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <p className={`text-3xl font-bold ${plannedMovement.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {plannedMovement.type === 'EXPENSE' ? '-' : '+'}{formatCurrency(plannedMovement.amount)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getMovementTypeColor(plannedMovement.type)}`}>
                  {plannedMovement.type}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getMovementCategoryColor(plannedMovement.category)}`}>
                  {plannedMovement.category}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getMovementStatusColor(plannedMovement.status)}`}>
                  {plannedMovement.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Next Execution</label>
                <p className="text-lg">{formatDayLabel(plannedMovement.nextExecution)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}