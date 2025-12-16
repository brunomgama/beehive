'use client'

import AccountsDesktop from '@/components/desktop/accounts/accounts'
import AccountsMobile from '@/components/mobile/accounts/accounts'
import { ProtectedRoute } from '@/components/protected-route'
import { ResponsiveLayout } from '@/components/responsive-layout'

export default function AccountsPage() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout mobile={<AccountsMobile />} desktop={<AccountsDesktop />} />
    </ProtectedRoute>
  )
}