'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AccountEditDesktop from '@/components/desktop/accounts/edit-account'
import DesktopHeader from '@/components/desktop/header/desktop_header'
import { ProtectedRoute } from '@/components/protected-route'

function EditAccountContent() {
  const searchParams = useSearchParams()
  const accountId = searchParams.get('id')
  const [activeIndex, setActiveIndex] = useState(3)

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-gradient-to-br from-muted/30 to-background">
        <DesktopHeader activeIndex={activeIndex} onActiveChange={setActiveIndex} />
        <AccountEditDesktop accountId={accountId ? parseInt(accountId) : null} />
      </div>
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
