'use client'

import { AnalyticsMobile } from '@/components/mobile/analytics/analytics'
import { useIsMobile } from '@/hooks/use-mobile'

export default function Analytics() {
  const isMobile = useIsMobile()

  return (
    <>
      {isMobile ? (
        <AnalyticsMobile />
      ) : (
        <></>
      )}
    </>
  )
}