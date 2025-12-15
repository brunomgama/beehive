'use client'

import PlannedMovementsDesktop from '@/components/desktop/planned/planned'
import PlannedMovementsMobile from '@/components/mobile/planned/planned'
import DesktopLayout from '@/components/desktop/layout/desktop-layout'
import { useIsMobile } from '@/hooks/use-mobile'
import { ProtectedRoute } from '@/components/protected-route'

export default function PlannedPage() {
  const isMobile = useIsMobile()

  return (
    <ProtectedRoute>
      {isMobile ? (
        <PlannedMovementsMobile />
      ) : (
        <DesktopLayout>
          <PlannedMovementsDesktop />
        </DesktopLayout>
      )}
    </ProtectedRoute>
  )
}