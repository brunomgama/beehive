'use client'

import { ReactNode } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import DesktopLayout from '@/components/desktop/layout/desktop-layout'

interface ResponsiveLayoutProps {
  mobile: ReactNode
  desktop: ReactNode
  wrapDesktop?: boolean
  loadingComponent?: ReactNode
}

/**
 * Responsive Layout Component
 * Handles mobile vs desktop rendering with proper loading states
 */
export function ResponsiveLayout({
  mobile,
  desktop,
  wrapDesktop = true,
  loadingComponent
}: ResponsiveLayoutProps) {
  const isMobile = useIsMobile()

  if (isMobile === undefined) {
    if (loadingComponent) {
      return <>{loadingComponent}</>
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (isMobile) {
    return <>{mobile}</>
  }

  if (wrapDesktop) {
    return <DesktopLayout>{desktop}</DesktopLayout>
  }

  return <>{desktop}</>
}