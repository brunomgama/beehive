'use client'

import PlannedMovementsDesktop from '@/components/desktop/planned/planned'
import PlannedMovementsMobile from '@/components/mobile/planned/planned'
import { useIsMobile } from '@/hooks/use-mobile'

export default function PlannedPage() {
  const isMobile = useIsMobile()

  return (
    <>
      {isMobile ? (
        <PlannedMovementsMobile />
      ) : (
        <PlannedMovementsDesktop />
      )}
    </>
  )
}