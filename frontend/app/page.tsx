'use client'

import FloatingNav from "@/components/ui/floating_navbar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import SettingsMobilePage from "@/components/mobile/settings/settings"
import LandingMobile from "@/components/mobile/landing/landing"
import AccountsMobile from "@/components/mobile/accounts/accounts"
import { AnalyticsMobile } from "@/components/mobile/analytics/analytics"
import { NotesMobile } from "@/components/mobile/notes/notes"
import MovementsMobile from "@/components/mobile/movements/movements"
import PlannedMovementsMobile from "@/components/mobile/planned/planned"
import DesktopLayout from "@/components/desktop/layout/desktop-layout"
import LandingDesktop from "@/components/desktop/landing/landing"

export default function Home() {
  const isMobile = useIsMobile()
  const [activeIndex, setActiveIndex] = useState(2)

  const mobileScctions = [
    { id: 0, component: <SettingsMobilePage />, title: "Settings" },
    { id: 1, component: <NotesMobile />, title: "Notes" },
    { id: 2, component: <LandingMobile />, title: "Home" },
    { id: 3, component: <AccountsMobile />, title: "Accounts" },
    { id: 4, component: <AnalyticsMobile />, title: "Analytics" },
    { id: 5, component: <MovementsMobile />, title: "Movements" },
    { id: 6, component: <PlannedMovementsMobile />, title: "Planned" }
  ]

  return (
    <ProtectedRoute>
      {isMobile ? (
        <div className="min-h-screen w-full bg-background">
          <div className="w-full overflow-y-auto">
            {mobileScctions[activeIndex].component}
          </div>
          <FloatingNav active={activeIndex} onActiveChange={setActiveIndex} />
        </div>
      ) : (
        <DesktopLayout>
          <LandingDesktop />
        </DesktopLayout>
      )}
    </ProtectedRoute>
  )
}