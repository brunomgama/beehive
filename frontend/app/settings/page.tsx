'use client'

import SettingsMobile from "@/components/mobile/settings/settings";
import SettingsDesktop from "@/components/desktop/settings/settings";
import { ProtectedRoute } from "@/components/protected-route";
import { ResponsiveLayout } from "@/components/responsive-layout";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout mobile={<SettingsMobile />} desktop={<SettingsDesktop/>} />
    </ProtectedRoute>
  )
}