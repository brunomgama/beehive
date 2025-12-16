'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { ResponsiveLayout } from '@/components/responsive-layout'
import AddMovementDesktop from '@/components/desktop/movements/add-movement'
import AddMovementMobile from '@/components/mobile/movements/add-movement'

/**
 * Add Movement Page
 * Create new transaction
 * Uses ResponsiveLayout for mobile/desktop views
 */
export default function AddMovementPage() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout mobile={<AddMovementMobile />} desktop={<AddMovementDesktop />} />
    </ProtectedRoute>
  )
}