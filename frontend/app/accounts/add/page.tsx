'use client'

import { useState } from 'react'
import AddAccountDesktop from '@/components/desktop/accounts/add-account'
import DesktopHeader from '@/components/desktop/header/desktop_header'
import { ProtectedRoute } from '@/components/protected-route'

export default function AddAccountPage() {
  const [activeIndex, setActiveIndex] = useState(3)

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-gradient-to-br from-muted/30 to-background">
        <DesktopHeader activeIndex={activeIndex} onActiveChange={setActiveIndex} />
        <AddAccountDesktop />
      </div>
    </ProtectedRoute>
  )
}
