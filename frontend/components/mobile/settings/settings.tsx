'use client'

import { LogOut, ChevronRight } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'
import ClippedMediaGallery from '@/components/ui/clip_path_image'
import { TypingAnimation } from '@/components/ui/typing-animation'
import { getButtonStyle, AVAILABLE_THEMES } from '@/lib/themes'
import { useSettings } from '@/hooks/settings/use-settings'

/**
 * Settings Mobile Component
 * User profile, theme selection, and account actions
 */
export default function SettingsMobile() {
  const { theme, setTheme } = useTheme()
  const { user, fullName, mediaContent, logout } = useSettings()

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-auto px-6 pb-6 space-y-6 mb-24 mt-4">
        
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border">
          <div className="flex items-center gap-4">
            {/* Profile Video */}
            <div className="w-1/3">
              <ClippedMediaGallery mediaItems={mediaContent} className="!p-0 !border-0 !rounded-none !gap-0"/>
            </div>
            
            {/* Greeting */}
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-foreground">Hello</h1>
              {user && (
                <TypingAnimation text={fullName} duration={150}
                  className="text-3xl font-bold text-foreground !leading-normal !tracking-normal !text-left"/>
              )}
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border">
          <h3 className="text-base font-semibold text-foreground mb-4">Choose Theme</h3>
          <div className="grid grid-cols-3 gap-3">
            {AVAILABLE_THEMES.map((themeOption) => (
              <Button key={themeOption.value} onClick={() => setTheme(themeOption.value)}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  theme === themeOption.value
                    ? `${getButtonStyle(theme)}/10 backdrop-blur-xl scale-105`
                    : 'border-border bg-muted/30 hover:border-muted-foreground/30'
                }`}>
                <div className={`w-10 h-10 rounded-full ${themeOption.color} shadow-md`} />
                <span className="text-xs font-medium text-foreground">
                  {themeOption.label}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border space-y-2">
          <h3 className="text-base font-semibold text-foreground mb-3">Quick Actions</h3>
          
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
            <span className="text-sm font-medium text-foreground">Notifications</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
            <span className="text-sm font-medium text-foreground">Privacy & Security</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
            <span className="text-sm font-medium text-foreground">Help & Support</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Logout Button */}
        <Button onClick={logout}
          className={`w-full h-14 ${getButtonStyle(theme)} text-white font-bold text-base rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300`} >
          <LogOut className="h-4 w-4 mr-2 text-white" />
          Logout
        </Button>
      </div>
    </div>
  )
}