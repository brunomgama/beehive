'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import DesktopHeader from '@/components/desktop/header/desktop_header'

interface DesktopLayoutProps {
  children: React.ReactNode
}

const pathToActiveIndex: Record<string, number> = {
  '/': 2,
  '/accounts': 3,
  '/accounts/add': 3,
  '/accounts/edit': 3,
  '/movements': 5,
  '/movements/add': 5,
  '/planned': 6,
  '/planned/add': 6,
  '/analytics': 4,
  '/notes': 1,
  '/settings': 0,
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  const pathname = usePathname()
  const [activeIndex, setActiveIndex] = useState(() => pathToActiveIndex[pathname] ?? 2)

  useEffect(() => {
    const index = pathToActiveIndex[pathname] ?? 2
    setActiveIndex(index)
  }, [pathname])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-muted/30 to-background">
      <DesktopHeader activeIndex={activeIndex} onActiveChange={setActiveIndex} />
      {children}
    </div>
  )
}
