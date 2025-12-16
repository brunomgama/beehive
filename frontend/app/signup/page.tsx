'use client'

import { ResponsiveLayout } from '@/components/responsive-layout'
import { SignupMobile } from '@/components/mobile/signup/signup'
import { SignupDesktop } from '@/components/desktop/signup/signup'

/**
 * Signup Page
 * User registration with responsive layout
 */
export default function SignupPage() {
  return (
    <ResponsiveLayout mobile={<SignupMobile />} desktop={<SignupDesktop />}/>
  )
}