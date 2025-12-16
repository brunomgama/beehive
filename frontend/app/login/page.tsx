'use client'

import { ResponsiveLayout } from '@/components/responsive-layout'
import { LoginMobile } from '@/components/mobile/login/login'
import { LoginDesktop } from '@/components/desktop/login/login'

/**
 * Login Page
 * User authentication with responsive layout
 */
export default function LoginPage() {
  return (
    <ResponsiveLayout mobile={<LoginMobile />} desktop={<LoginDesktop />} />
  )
}