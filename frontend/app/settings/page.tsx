'use client'

import SettingsMobilePage from "@/components/mobile/settings/settings";
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