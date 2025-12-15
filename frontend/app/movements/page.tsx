'use client'

import MovementsDesktop from '@/components/desktop/movements/movements'
import MovementsMobile from '@/components/mobile/movements/movements'
import DesktopLayout from '@/components/desktop/layout/desktop-layout'
import { useIsMobile } from '@/hooks/use-mobile'
import { ProtectedRoute } from '@/components/protected-route'

export default function MovementsPage() {
  const isMobile = useIsMobile()

  return (
    <ProtectedRoute>
      {isMobile ? (
        <MovementsMobile />
      ) : (
        <DesktopLayout>
          <MovementsDesktop />
        </DesktopLayout>
      )}
    </ProtectedRoute>
  )
}