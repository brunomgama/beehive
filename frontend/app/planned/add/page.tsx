'use client'

import AddPlannedDesktop from '@/components/desktop/planned/add-planned'
import DesktopLayout from '@/components/desktop/layout/desktop-layout'
import { ProtectedRoute } from '@/components/protected-route'

export default function AddPlannedPage() {
  return (
    <ProtectedRoute>
      <DesktopLayout>
        <AddPlannedDesktop />
      </DesktopLayout>
    </ProtectedRoute>
  )
}
