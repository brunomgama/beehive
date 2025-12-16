'use client'

import { useParams } from 'next/navigation'
import { ProtectedRoute } from '@/components/protected-route'
import { ResponsiveLayout } from '@/components/responsive-layout'
import EditPlannedDesktop from '@/components/desktop/planned/edit-planned'
import EditPlannedMobile from '@/components/mobile/planned/edit-planned'

/**
 * Edit Planned Movements Page
 * Edit existing transaction
 * Uses ResponsiveLayout for mobile/desktop views
 */
export default function EditPlannedPage() {
  const params = useParams()
  const plannedId = params.id ? parseInt(params.id as string) : 0

  return (
    <ProtectedRoute>
      <ResponsiveLayout
        mobile={<EditPlannedMobile plannedId={plannedId} />}
        desktop={<EditPlannedDesktop plannedId={plannedId} />}
      />
    </ProtectedRoute>
  )
}