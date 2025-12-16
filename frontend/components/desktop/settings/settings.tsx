'use client'

import { LogOut, ChevronRight, User, Palette, Bell, Shield, HelpCircle } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'
import ClippedMediaGallery from '@/components/ui/clip_path_image'
import { TypingAnimation } from '@/components/ui/typing-animation'
import { getButtonStyle, AVAILABLE_THEMES } from '@/lib/themes'
import { useSettings } from '@/hooks/settings/use-settings'

/**
 * Settings Desktop Component
 * Enhanced desktop layout with better spacing
 */
export default function SettingsDesktop() {
  const { theme, setTheme } = useTheme()
  const { user, fullName, mediaContent, logout } = useSettings()

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-lg text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-card rounded-3xl p-8 shadow-sm border">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <User size={24} />
            Profile
          </h2>
          
          <div className="flex items-center gap-6">
            {/* Profile Video */}
            <div className="w-32 h-32">
              <ClippedMediaGallery mediaItems={mediaContent} className="!p-0 !border-0 !rounded-none !gap-0"/>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-foreground mb-2">Hello</h3>
              {user && (
                <TypingAnimation text={fullName} duration={150} 
                className="text-3xl font-bold text-foreground !leading-normal !tracking-normal !text-left"/>
              )}
              <p className="text-muted-foreground mt-2">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="bg-card rounded-3xl p-8 shadow-sm border">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Palette size={24} />
            Theme
          </h2>
          
          <div className="grid grid-cols-4 gap-4">
            {AVAILABLE_THEMES.map((themeOption) => (
              <Button key={themeOption.value} onClick={() => setTheme(themeOption.value)}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                  theme === themeOption.value
                    ? `${getButtonStyle(theme)}/10 backdrop-blur-xl scale-105 border-primary`
                    : 'border-border bg-muted/30 hover:border-muted-foreground/30'
                }`}>
                <div className={`w-16 h-16 rounded-full ${themeOption.color} shadow-lg`} />
                <span className="text-sm font-semibold text-foreground">
                  {themeOption.label}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-2 gap-6">
          
          {/* Notifications */}
          <button className="bg-card rounded-2xl p-6 shadow-sm border hover:border-primary/50 transition-all text-left group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Bell size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage alerts</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Privacy & Security */}
          <button className="bg-card rounded-2xl p-6 shadow-sm border hover:border-primary/50 transition-all text-left group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Shield size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Privacy & Security</h3>
                  <p className="text-sm text-muted-foreground">Control your data</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Help & Support */}
          <button className="bg-card rounded-2xl p-6 shadow-sm border hover:border-primary/50 transition-all text-left group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <HelpCircle size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Help & Support</h3>
                  <p className="text-sm text-muted-foreground">Get assistance</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Logout */}
          <Button onClick={logout} variant="destructive" className="h-auto p-6 rounded-2xl flex items-center justify-between text-left group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <LogOut size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Logout</h3>
                <p className="text-sm opacity-90">Sign out of your account</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  )
}