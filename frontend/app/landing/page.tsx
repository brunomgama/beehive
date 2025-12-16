'use client'

import { ProtectedRoute } from '@/components/protected-route'
import LandingDesktop from '@/components/desktop/landing/landing'
import LandingMobile from '@/components/mobile/landing/landing'
import { ResponsiveLayout } from '@/components/responsive-layout'

export default function Landing() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout mobile={<LandingMobile />} desktop={<LandingDesktop />} />
    </ProtectedRoute>
  )
}