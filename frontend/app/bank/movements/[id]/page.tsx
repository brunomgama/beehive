'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '../../../../components/ui/button'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { getMovementTypeColor, getMovementStatusColor, getMovementCategoryColor } from '@/lib/bank/movement-colors'
import { Movement, BankAccount, movementApi, bankAccountApi } from '@/lib/api/bank-api'
import { DashboardLayout } from '@/components/desktop/sidebar/dashboard-layout'
import { LoadingPage } from '@/components/mobile/loading/loading-page'

export default function MovementDetailPage() {
  const [movement, setMovement] = useState<Movement | null>(null)
  const [account, setAccount] = useState<BankAccount | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const id = parseInt(params.id as string)

  useEffect(() => {
    if (id) {
      fetchMovement()
    }
  }, [id])

  const fetchMovement = async () => {
    setLoading(true)
    const result = await movementApi.getById(id)
    
    if (result.data) {
      setMovement(result.data)
      // Fetch the account details
      const accountResult = await bankAccountApi.getById(result.data.accountId)
      if (accountResult.data) {
        setAccount(accountResult.data)
      }
      setError('')
    } else {
      setError(result.error || 'Failed to fetch movement')
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this movement?')) return
    
    const result = await movementApi.delete(id)
    if (result.status === 200) {
      router.push('/bank/movements')
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
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (<LoadingPage title="Loading Movement..." loadingText="Processing • Please wait • Processing • " />)
  }

  if (error || !movement) {
    return (
      <DashboardLayout title="Movement Details">
        <div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Movement not found'}
          </div>
          <Button onClick={() => router.push('/bank/movements')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Movements
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Movement Details">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button size="sm" onClick={() => router.push('/bank/movements')} 
                className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => router.push(`/bank/movements/${movement.id}/edit`)} >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Movement Information */}
        <div className="rounded-lg shadow-sm rounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Movement Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Movement ID</label>
                <p className="text-lg">#{movement.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <p className="text-lg">{formatDate(movement.date)}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <p className="text-lg p-3 rounded border">
                  {movement.description}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account</label>
                <p className="text-lg">
                  {account ? account.accountName : `Account ID: ${movement.accountId}`}
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
                <p className={`text-3xl font-bold ${movement.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {movement.type === 'EXPENSE' ? '-' : '+'}{formatCurrency(movement.amount)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getMovementTypeColor(movement.type)}`}>
                  {movement.type}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getMovementCategoryColor(movement.category)}`}>
                  {movement.category}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getMovementStatusColor(movement.status)}`}>
                  {movement.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}