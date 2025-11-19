'use client'

import { useAuth } from "@/contexts/auth-context"
import { CarouselAccountCard } from './carousel-card'
import { MobileBackground } from "../background/mobile-background"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { LiquidGlassCard } from "@/components/ui/liquid-glass"

export function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()


  const handleAvatarClick = () => {
    router.push('/profile')
  }

  return (
    <div className="relative min-h-screen">
      <MobileBackground />
      <div className="relative z-10 max-w-sm mx-auto p-4">
      <div className="flex items-center justify-between gap-3 mb-6">
          <button onClick={handleAvatarClick}
            className="rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30">
            <Avatar>
              <AvatarImage src="/profile_1.png" />
            </Avatar>
          </button>
          
          <h2 className="text-xl font-bold text-white">Hi, {user?.firstName}!</h2>
        </div>
        
        <div className="space-y-4">
        <LiquidGlassCard>
          <CarouselAccountCard />
        </LiquidGlassCard>

        </div>
      </div>
    </div>
  )
}