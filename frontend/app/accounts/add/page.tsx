'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { ResponsiveLayout } from '@/components/responsive-layout'
import AddAccountDesktop from '@/components/desktop/accounts/add-account'

export default function AddAccountPage() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout mobile={<></>} desktop={<AddAccountDesktop />} />
    </ProtectedRoute>
  )
}