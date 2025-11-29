import SettingsMobilePage from "@/components/v2/mobile/settings/settings_mobile";
import { useAuth } from "@/contexts/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SettingsPage() {
  const isMobile = useIsMobile()
  const { user } = useAuth()

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