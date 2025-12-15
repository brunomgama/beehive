'use client'

import { useState } from 'react'
import MovementsDesktop from '@/components/desktop/movements/movements'
import MovementsMobile from '@/components/mobile/movements/movements'
import DesktopHeader from '@/components/desktop/header/desktop_header'
import { useIsMobile } from '@/hooks/use-mobile'
import { ProtectedRoute } from '@/components/protected-route'

export default function MovementsPage() {
  const isMobile = useIsMobile()
  const [activeIndex, setActiveIndex] = useState(5)

  return (
    <ProtectedRoute>
      {isMobile ? (
        <MovementsMobile />
      ) : (
        <div className="min-h-screen w-full bg-gradient-to-br from-muted/30 to-background">
          <DesktopHeader activeIndex={activeIndex} onActiveChange={setActiveIndex} />
          <MovementsDesktop />
        </div>
      )}
    </ProtectedRoute>
  )
}