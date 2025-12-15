'use client'

import MovementsDesktop from '@/components/desktop/movements/movements'
import MovementsMobile from '@/components/mobile/movements/movements'
import { useIsMobile } from '@/hooks/use-mobile'

export default function MovementsPage() {
  const isMobile = useIsMobile()

  return (
    <>
      {isMobile ? (
        <MovementsMobile />
      ) : (
        <MovementsDesktop />
      )}
    </>
  )
}