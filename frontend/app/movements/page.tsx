'use client'

import MovementsDesktop from '@/components/desktop/movements/movements'
import { useIsMobile } from '@/hooks/use-mobile'

export default function MovementsPage() {
  const isMobile = useIsMobile()

  return (
    <>
      {isMobile ? (
        <></>
      ) : (
        <MovementsDesktop />
      )}
    </>
  )
}