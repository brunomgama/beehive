import SettingsMobilePage from "@/components/v2/mobile/settings/settings_mobile";

export function SettingsPage({ mobileView }: { mobileView: boolean }) {
  return (
    <div>
      {mobileView ? 
        <SettingsMobilePage />
        : 
        "Desktop Settings"
      }
    </div>
  );
}