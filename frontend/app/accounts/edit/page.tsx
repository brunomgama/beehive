'use client'

import { useSearchParams } from 'next/navigation'
import AccountEditDesktop from '@/components/desktop/accounts/edit-account'
import { ProtectedRoute } from '@/components/protected-route'
import { ResponsiveLayout } from '@/components/responsive-layout'

export default function EditAccountContent() {
  const accountId = useSearchParams().get('id')
  return (
    <ProtectedRoute>
      <ResponsiveLayout mobile={<></>} desktop={<AccountEditDesktop accountId={accountId ? parseInt(accountId) : null}/>} />
    </ProtectedRoute>
  )
}