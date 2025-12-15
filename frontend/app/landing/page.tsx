'use client'

import LandingDesktop from '@/components/desktop/landing/landing'
import LandingMobile from '@/components/mobile/landing/landing'
import DesktopLayout from '@/components/desktop/layout/desktop-layout'
import { useIsMobile } from '@/hooks/use-mobile'

export default function Landing() {
  const isMobile = useIsMobile()
  
  return isMobile ? (
    <LandingMobile />
  ) : (
    <DesktopLayout>
      <LandingDesktop />
    </DesktopLayout>
  )
}