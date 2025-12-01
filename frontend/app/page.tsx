'use client'

import FloatingNav from "@/components/ui/floating_navbar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import SettingsPage from "./settings/page"
import Landing from "./landing/page"
import AccountsPage from "./accounts/page"
import Analytics from "./analytics/page"
import Notes from "./notes/page"
import DesktopHeader from "@/components/desktop/header/desktop_header"

export default function Home() {
  const isMobile = useIsMobile()
  const [activeIndex, setActiveIndex] = useState(2)

  const sections = [
    { id: 0, component: <SettingsPage />, title: "Settings" },
    { id: 1, component: <Notes />, title: "Notes" },
    { id: 2, component: <Landing />, title: "Home" },
    { id: 3, component: <AccountsPage />, title: "Accounts" },
    { id: 4, component: <Analytics />, title: "Analytics" }
  ]

  return (
    <ProtectedRoute>
      {isMobile ? (
        <div className="min-h-screen w-full bg-background">
          <div className="w-full overflow-y-auto">
            {sections[activeIndex].component}
          </div>
          <FloatingNav active={activeIndex} onActiveChange={setActiveIndex} />
        </div>
      ) : (
        <div className="min-h-screen w-full bg-gradient-to-br from-muted/30 to-background">
          <DesktopHeader activeIndex={activeIndex} onActiveChange={setActiveIndex} />
          <div className="w-full">
            {sections[activeIndex].component}
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}