'use client'

import { useParams } from 'next/navigation'
import { ProtectedRoute } from '@/components/protected-route'
import { ResponsiveLayout } from '@/components/responsive-layout'
import EditMovementMobile from '@/components/mobile/movements/edit-movement'
import EditMovementDesktop from '@/components/desktop/movements/edit-movement'

/**
 * Edit Movement Page
 * Edit existing transaction
 * Uses ResponsiveLayout for mobile/desktop views
 */
export default function EditMovementPage() {
  const params = useParams()
  const movementId = params.id ? parseInt(params.id as string) : null

  return (
    <ProtectedRoute>
      <ResponsiveLayout
        mobile={<EditMovementMobile movementId={movementId} />}
        desktop={<EditMovementDesktop movementId={movementId} />}
      />
    </ProtectedRoute>
  )
}