'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { ResponsiveLayout } from '@/components/responsive-layout'
import AddPlannedDesktop from '@/components/desktop/planned/add-planned'
import AddPlannedMobile from '@/components/mobile/planned/add-planned'

export default function AddPlannedPage() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout mobile={<AddPlannedMobile />} desktop={<AddPlannedDesktop />}/>
    </ProtectedRoute>
  )
}