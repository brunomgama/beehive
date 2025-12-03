'use client'

import LandingDesktop from '@/components/desktop/landing/landing'
import LandingMobile from '@/components/mobile/landing/landing'
import { useIsMobile } from '@/hooks/use-mobile'

export default function Landing() {
  const isMobile = useIsMobile()
  return isMobile ? <LandingMobile /> : <LandingDesktop />
}