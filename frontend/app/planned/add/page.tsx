'use client'

import { useState } from 'react'
import AddPlannedDesktop from '@/components/desktop/planned/add-planned'
import DesktopHeader from '@/components/desktop/header/desktop_header'
import { ProtectedRoute } from '@/components/protected-route'

export default function AddPlannedPage() {
  const [activeIndex, setActiveIndex] = useState(2)

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-gradient-to-br from-muted/30 to-background">
        <DesktopHeader activeIndex={activeIndex} onActiveChange={setActiveIndex} />
        <AddPlannedDesktop />
      </div>
    </ProtectedRoute>
  )
}
