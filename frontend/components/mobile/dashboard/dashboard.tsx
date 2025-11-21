'use client'

import { useAuth } from "@/contexts/auth-context"
import { CarouselAccountCard } from './carousel-card'
import { MobileBackground } from "../background/mobile-background"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { LiquidGlassCard } from "@/components/ui/liquid-glass"
import { LiquidGlassCircleButton } from "@/components/ui/liquid-glass-button"
import { ArrowRightLeft, Bell, Clock, Cog, Ellipsis, Home, MessageSquare, Plus, Search, Settings, User } from "lucide-react"

export function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()

  const handleRedirect = (path: string) => {
    router.push(path);
  };

  return (
    <div className="relative min-h-screen">
      <MobileBackground />
      <div className="relative z-10 mx-auto p-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar shape="rounded-corners" size="md">
              <AvatarImage src="/profile_1.png" />
            </Avatar>
            <div>
              <p className="text-sm text-white">Good morning!</p>
              <h2 className="text-lg font-bold text-white">{user?.firstName} {user?.lastName}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-md bg-white/10 hover:bg-white/20 focus:outline-none">
              <Settings size={25} className="text-white" />
            </button>
            {/* <button className="p-2 rounded-md bg-white/10 hover:bg-white/20 focus:outline-none">
              <Bell size={25} className="text-white" />
            </button> */}
          </div>
        </div>
        
            {/* Rest of the dashboard */}
        <div className="space-y-4 mb-6">
          <LiquidGlassCard>
            <CarouselAccountCard />
          </LiquidGlassCard>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-4 mb-6 place-items-center">
          <div className="flex flex-col items-center text-center">
            <LiquidGlassCircleButton size={48} icon={<Plus size={20} />} onClick={() => handleRedirect('/home')}/>
            <span className="text-xs text-white mt-1">Add</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <LiquidGlassCircleButton size={48} icon={<ArrowRightLeft size={20} />} onClick={() => handleRedirect('/settings')}/>
            <span className="text-xs text-white mt-1">Movements</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <LiquidGlassCircleButton size={48} icon={<Clock size={20} />} onClick={() => handleRedirect('/messages')}/>
            <span className="text-xs text-white mt-1">Planned</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <LiquidGlassCircleButton size={48} icon={<Ellipsis size={20} />} onClick={() => handleRedirect('/profile')}/>
            <span className="text-xs text-white mt-1">More</span>
          </div>
        </div>

        <div className="space-y-4">
          <LiquidGlassCard>
            HELLO
          </LiquidGlassCard>
        </div>

      </div>
    </div>
  )
}