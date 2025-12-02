'use client'

import { Settings, FileText, Home, Wallet, BarChart3, ArrowLeftRight, CalendarClock } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { getThemeColors } from "@/lib/themes"
import { Button } from "@/components/ui/button"

interface DesktopHeaderProps {
  activeIndex: number
  onActiveChange: (index: number) => void
}

export default function DesktopHeader({ activeIndex, onActiveChange }: DesktopHeaderProps) {
  const { theme } = useTheme()
  const { user } = useAuth()
  const themeColors = getThemeColors(theme)

  const navItems = [
    { id: 2, label: "Dashboard", icon: Home },
    { id: 3, label: "Accounts", icon: Wallet },
    { id: 5, label: "Movements", icon: ArrowLeftRight },
    { id: 6, label: "Planned", icon: CalendarClock },
    { id: 4, label: "Analytics", icon: BarChart3 },
    { id: 1, label: "Notes", icon: FileText },
    { id: 0, label: "Settings", icon: Settings },
  ]

    return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">BeeHive</h1>
          </div>

          {/* Navigation and right side aligned to right */}
          <div className="flex items-center gap-4 justify-end w-full">
            {/* Navigation - Single blur container */}
            <nav className="flex items-center gap-1 px-1.5 py-1.5 h-12 rounded-full bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
              {navItems.slice(0, 4).map((item) => {
                const isActive = activeIndex === item.id
                return (
                  <Button key={item.id} onClick={() => onActiveChange(item.id)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-medium text-sm transition-all ${
                      isActive ? 'shadow-md' : 'hover:bg-white/40'
                    }`} style={isActive ? { backgroundColor: themeColors.primary } : undefined}>
                    <span>{item.label}</span>
                  </Button>
                )
              })}
            </nav>

            {/* Settings button - Separate blur container */}
            <Button className="px-4 h-12 rounded-full bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm hover:bg-white/70 transition-all flex items-center gap-2 h-11">
              <Settings size={18} />
              <span className="text-sm font-medium">Setting</span>
            </Button>

            {/* User Avatar - Separate blur container */}
            <div className="flex h-12 items-center gap-2 px-3 rounded-full bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm h-11">
              <Button className="w-8 h-8 rounded-full flex items-center justify-center">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}