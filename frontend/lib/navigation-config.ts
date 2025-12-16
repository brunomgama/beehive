import { lazy, ComponentType } from 'react'

/**
 * Mobile Navigation Section
 */
export interface MobileSection {
  id: number
  title: string
  component: ComponentType
  icon?: string
}

/**
 * Mobile Navigation Configuration
 * Uses lazy loading for better performance
 */
export const MOBILE_SECTIONS: MobileSection[] = [
  {
    id: 0,
    title: "Settings",
    component: lazy(() => import('@/components/mobile/settings/settings')),
  },
  {
    id: 1,
    title: "Notes",
    component: lazy(() => import('@/components/mobile/settings/settings')),
  },
  {
    id: 2,
    title: "Home",
    component: lazy(() => import('@/components/mobile/landing/landing')),
  },
  {
    id: 3,
    title: "Accounts",
    component: lazy(() => import('@/components/mobile/accounts/accounts')),
  },
  {
    id: 4,
    title: "Analytics",
    component: lazy(() => import('@/components/mobile/analytics/analytics').then(m => ({ default: m.AnalyticsMobile }))),
  },
  {
    id: 5,
    title: "Movements",
    component: lazy(() => import('@/components/mobile/movements/movements')),
  },
  {
    id: 6,
    title: "Planned",
    component: lazy(() => import('@/components/mobile/planned/planned')),
  },
]

/**
 * Get section by ID
 */
export function getMobileSectionById(id: number): MobileSection | undefined {
  return MOBILE_SECTIONS.find(section => section.id === id)
}

/**
 * Default section (Home)
 */
export const DEFAULT_MOBILE_SECTION = 2