'use client'

import AccountsDesktop from '@/components/desktop/accounts/accounts'
import AccountsMobile from '@/components/mobile/accounts/accounts'
import { useIsMobile } from '@/hooks/use-mobile'

export default function AccountsPage() {
  const isMobile = useIsMobile()

  return (
    <>
      {isMobile ? (
        <AccountsMobile />
      ) : (
        <AccountsDesktop />
      )}
    </>
  )
}