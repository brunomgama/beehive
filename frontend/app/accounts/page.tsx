'use client'

import { useState } from 'react'
import AccountsDesktop from '@/components/desktop/accounts/accounts'
import AccountsMobile from '@/components/mobile/accounts/accounts'
import DesktopHeader from '@/components/desktop/header/desktop_header'
import { useIsMobile } from '@/hooks/use-mobile'
import { ProtectedRoute } from '@/components/protected-route'

export default function AccountsPage() {
  const isMobile = useIsMobile()
  const [activeIndex, setActiveIndex] = useState(3)

  return (
    <ProtectedRoute>
      {isMobile ? (
        <AccountsMobile />
      ) : (
        <div className="min-h-screen w-full bg-gradient-to-br from-muted/30 to-background">
          <DesktopHeader activeIndex={activeIndex} onActiveChange={setActiveIndex} />
          <AccountsDesktop />
        </div>
      )}
    </ProtectedRoute>
  )
}