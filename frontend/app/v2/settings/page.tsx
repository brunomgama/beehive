// components/v2/pages/settings.tsx
"use client"

import { useState, useEffect } from "react"
import { Palette, LogOut, ChevronRight } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import ClippedMediaGallery from "@/components/v2/ui/clip-path-image"
import { TypingAnimation } from "@/components/ui/typing-animation"

export default function SettingsPage() {
  const { logout, user } = useAuth()
  const { setTheme, theme } = useTheme()
  const [videoSrc, setVideoSrc] = useState<string>('https://videos.pexels.com/video-files/7710243/7710243-uhd_2560_1440_30fps.mp4')

  const themes = [
    { value: "light", label: "Light", color: "bg-white" },
    { value: "dark", label: "Dark", color: "bg-gray-900" },
    { value: "orange", label: "Orange", color: "bg-orange-300" },
  ]

  useEffect(() => {
    if (user?.firstName === "Bruno" && user?.lastName === "Gama") {
      const checkVideo = async () => {
        try {
          const response = await fetch('./profile.mp4', { method: 'HEAD' })
          if (response.ok) {
            setVideoSrc('./profile.mp4')
          }
        } catch (error) {
          console.log('Custom video not found, using default')
        }
      }
      checkVideo()
    }
  }, [user])

  const mediaContent = [
    {
      src: videoSrc,
      alt: 'Profile Video',
      clipId: 'clip-rect' as const,
      type: 'video' as const,
    }
  ]

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-auto px-6 pb-6 space-y-6 mb-24 mt-4">
        
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="flex items-center gap-4">
            <div className="w-1/3">
              <ClippedMediaGallery key={videoSrc} mediaItems={mediaContent} className="!p-0 !border-0 !rounded-none !gap-0"/>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-foreground">Hello</h1>
              {user && (
                <TypingAnimation text={user.firstName + " " + user.lastName} duration={150} 
                className="text-3xl font-bold text-foreground !leading-normal !tracking-normal !text-left"/>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          
          <div className="grid grid-cols-3 gap-3">
            {themes.map((themeOption) => (
              <button key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  theme === themeOption.value 
                    ? 'border-primary bg-primary/5 scale-105' 
                    : 'border-border bg-muted/30 hover:border-muted-foreground/30'
                }`}>
                <div className={`w-10 h-10 rounded-full ${themeOption.color} shadow-md`} />
                <span className="text-xs font-medium text-foreground">{themeOption.label}</span>
                {theme === themeOption.value && (
                  <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border space-y-2">
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
          className="w-full h-12 bg-orange text-destructive-foreground font-semibold rounded-xl shadow-sm text-white">
          <LogOut className="h-4 w-4 mr-2 text-white" />
          Logout
        </Button>
      </div>
    </div>
  )
}