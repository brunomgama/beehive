'use client'

import AddAccountDesktop from '@/components/desktop/accounts/add-account'
import DesktopLayout from '@/components/desktop/layout/desktop-layout'
import { ProtectedRoute } from '@/components/protected-route'

export default function AddAccountPage() {
  return (
    <ProtectedRoute>
      <DesktopLayout>
        <AddAccountDesktop />
      </DesktopLayout>
    </ProtectedRoute>
  )
}
