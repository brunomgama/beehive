'use client'

import SettingsMobilePage from "@/components/mobile/settings/settings";
import SettingsDesktop from "@/components/desktop/settings/settings";
import DesktopLayout from "@/components/desktop/layout/desktop-layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProtectedRoute } from "@/components/protected-route";

export default function SettingsPage() {
  const isMobile = useIsMobile()

  return (
    <ProtectedRoute>
      {isMobile ? (
        <SettingsMobilePage />
      ) : (
        <DesktopLayout>
          <SettingsDesktop />
        </DesktopLayout>
      )}
    </ProtectedRoute>
  )
}