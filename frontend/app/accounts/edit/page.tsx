'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AccountEditDesktop from '@/components/desktop/accounts/edit-account'
import { ProtectedRoute } from '@/components/protected-route'
import { ResponsiveLayout } from '@/components/responsive-layout'

function EditAccountContent() {
  const accountId = useSearchParams().get('id')
  return (
    <ResponsiveLayout 
      mobile={<></>} 
      desktop={<AccountEditDesktop accountId={accountId ? parseInt(accountId) : null} />} 
    />
  )
}

export default function EditAccountPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <EditAccountContent />
      </Suspense>
    </ProtectedRoute>
  )
}