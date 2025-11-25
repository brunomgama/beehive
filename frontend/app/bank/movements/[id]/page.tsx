'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '../../../../components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Movement, BankAccount, movementApi, bankAccountApi } from '@/lib/api/bank-api'
import { DashboardLayout } from '@/components/desktop/sidebar/dashboard-layout'
import { LoadingPage } from '@/components/mobile/loading/loading-page'
import { useIsMobile } from '@/hooks/use-mobile'
import { ViewMovement as ViewMovementMobile } from '@/components/mobile/movements/view_single_movement'
import { ViewMovement as ViewMovementDesktop } from '@/components/desktop/movements/view_single_movement'

export default function MovementDetailPage() {
  const isMobile = useIsMobile()

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
    (isMobile ? (
        <ViewMovementMobile movements={movement ? [movement] : []} accounts={account ? [account] : []} />
      ) : (
        <DashboardLayout title="Movement Details">
          <ViewMovementDesktop movement={movement}
            onBack={() => router.push('/bank/movements')}
            onEdit={() => router.push(`/bank/movements/${id}/edit`)}
            onDelete={handleDelete}/>
        </DashboardLayout>
      ))
  )
}