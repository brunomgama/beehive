'use client'

import { useState, Suspense } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { ResponsiveLayout } from "@/components/responsive-layout"
import FloatingNav from "@/components/ui/floating_navbar"
import LandingDesktop from "@/components/desktop/landing/landing"
import { MOBILE_SECTIONS, DEFAULT_MOBILE_SECTION } from "@/lib/navigation-config"

/**
 * Loading fallback for lazy-loaded sections
 */
function SectionLoader() {
  // TODO: CREATE A LOADING COMPONENT
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

/**
 * Mobile App Container
 * Handles section navigation with floating nav bar
 */
function MobileApp() {
  const [activeIndex, setActiveIndex] = useState(DEFAULT_MOBILE_SECTION)
  const ActiveSection = MOBILE_SECTIONS[activeIndex].component

  return (
    <div className="min-h-screen w-full bg-background">
      <main className="w-full h-[calc(100vh-80px)] overflow-y-auto pb-safe">
        <Suspense fallback={<SectionLoader />}>
          <ActiveSection />
        </Suspense>
      </main>
      <FloatingNav active={activeIndex} onActiveChange={setActiveIndex} />
    </div>
  )
}

/**
 * Home Page - Main application entry point
 * Renders mobile app or desktop dashboard based on screen size
 */
export default function Home() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout mobile={<MobileApp />} desktop={<LandingDesktop />} wrapDesktop={true} />
    </ProtectedRoute>
  )
}