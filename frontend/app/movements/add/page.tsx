'use client'

import AddMovementDesktop from '@/components/desktop/movements/add-movement'
import DesktopLayout from '@/components/desktop/layout/desktop-layout'
import { ProtectedRoute } from '@/components/protected-route'

export default function AddMovementPage() {
  return (
    <ProtectedRoute>
      <DesktopLayout>
        <AddMovementDesktop />
      </DesktopLayout>
    </ProtectedRoute>
  )
}
