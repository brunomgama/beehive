'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AccountEditDesktop from '@/components/desktop/accounts/edit-account'
import DesktopLayout from '@/components/desktop/layout/desktop-layout'
import { ProtectedRoute } from '@/components/protected-route'

function EditAccountContent() {
  const searchParams = useSearchParams()
  const accountId = searchParams.get('id')

  return (
    <ProtectedRoute>
      <DesktopLayout>
        <AccountEditDesktop accountId={accountId ? parseInt(accountId) : null} />
      </DesktopLayout>
    </ProtectedRoute>
  )
}

export default function EditAccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <EditAccountContent />
    </Suspense>
  )
}
