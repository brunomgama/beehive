'use client'

import { useState } from 'react'
import AddMovementDesktop from '@/components/desktop/movements/add-movement'
import DesktopHeader from '@/components/desktop/header/desktop_header'
import { ProtectedRoute } from '@/components/protected-route'

export default function AddMovementPage() {
  const [activeIndex, setActiveIndex] = useState(1)

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-gradient-to-br from-muted/30 to-background">
        <DesktopHeader activeIndex={activeIndex} onActiveChange={setActiveIndex} />
        <AddMovementDesktop />
      </div>
    </ProtectedRoute>
  )
}
