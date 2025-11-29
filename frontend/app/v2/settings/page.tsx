'use client'

import SettingsMobilePage from "@/components/v2/mobile/settings/settings_mobile";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SettingsPage() {
  const isMobile = useIsMobile()

  return (
    <div>
      {isMobile ? 
        <SettingsMobilePage />
        : 
        "Desktop Settings"
      }
    </div>
  );
}