'use client'

import { useState } from 'react'
import PlannedMovementsDesktop from '@/components/desktop/planned/planned'
import PlannedMovementsMobile from '@/components/mobile/planned/planned'
import DesktopHeader from '@/components/desktop/header/desktop_header'
import { useIsMobile } from '@/hooks/use-mobile'
import { ProtectedRoute } from '@/components/protected-route'

export default function PlannedPage() {
  const isMobile = useIsMobile()
  const [activeIndex, setActiveIndex] = useState(6)

  return (
    <ProtectedRoute>
      {isMobile ? (
        <PlannedMovementsMobile />
      ) : (
        <div className="min-h-screen w-full bg-gradient-to-br from-muted/30 to-background">
          <DesktopHeader activeIndex={activeIndex} onActiveChange={setActiveIndex} />
          <PlannedMovementsDesktop />
        </div>
      )}
    </ProtectedRoute>
  )
}