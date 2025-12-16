'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { ResponsiveLayout } from '@/components/responsive-layout'
import MovementsDesktop from '@/components/desktop/movements/movements'
import MovementsMobile from '@/components/mobile/movements/movements'

export default function MovementsPage() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout mobile={<MovementsMobile />} desktop={<MovementsDesktop />} />
    </ProtectedRoute>
  )
}