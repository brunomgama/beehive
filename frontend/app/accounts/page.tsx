'use client'

import AccountsDesktop from '@/components/desktop/accounts/accounts'
import AccountsMobile from '@/components/mobile/accounts/accounts'
import DesktopLayout from '@/components/desktop/layout/desktop-layout'
import { useIsMobile } from '@/hooks/use-mobile'
import { ProtectedRoute } from '@/components/protected-route'

export default function AccountsPage() {
  const isMobile = useIsMobile()

  return (
    <ProtectedRoute>
      {isMobile ? (
        <AccountsMobile />
      ) : (
        <DesktopLayout>
          <AccountsDesktop />
        </DesktopLayout>
      )}
    </ProtectedRoute>
  )
}