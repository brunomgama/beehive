'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { ResponsiveLayout } from '@/components/responsive-layout'
import PlannedMovementsDesktop from '@/components/desktop/planned/planned'
import PlannedMovementsMobile from '@/components/mobile/planned/planned'

/**
 * Planned Movements Page
 * Shows scheduled/recurring transactions
 */
export default function PlannedPage() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout mobile={<PlannedMovementsMobile />} desktop={<PlannedMovementsDesktop />}/>
    </ProtectedRoute>
  )
}