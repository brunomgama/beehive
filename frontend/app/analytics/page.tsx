'use client'

import AnalyticsDesktop from '@/components/desktop/analytics/analytics'
import { AnalyticsMobile } from '@/components/mobile/analytics/analytics'
import { ProtectedRoute } from '@/components/protected-route'
import { ResponsiveLayout } from '@/components/responsive-layout'

export default function Analytics() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout mobile={<AnalyticsMobile />} desktop={<AnalyticsDesktop/>} />
    </ProtectedRoute>
  )
}