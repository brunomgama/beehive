'use client'

import { Dashboard as MobileDashboard } from "@/components/mobile/dashboard/dashboard"
import { Dashboard as DesktopDashboard } from "@/components/desktop/dashboard/dashboard"
import { DashboardLayout } from "@/components/desktop/sidebar/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useIsMobile } from "@/hooks/use-mobile"

export default function Home() {
  const isMobile = useIsMobile()

  return (
    <ProtectedRoute>
      {isMobile ? (
        <MobileDashboard />
      ) : (
        <DashboardLayout title="Home">
          <DesktopDashboard />
        </DashboardLayout>
      )}
    </ProtectedRoute>
  )
}