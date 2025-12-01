'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AccountContextType {
  activeAccountId: number | null
  setActiveAccountId: (id: number | null) => void
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export function AccountProvider({ children }: { children: ReactNode }) {
  const [activeAccountId, setActiveAccountId] = useState<number | null>(null)

  return (
    <AccountContext.Provider value={{ activeAccountId, setActiveAccountId }}>
      {children}
    </AccountContext.Provider>
  )
}

export function useAccount() {
  const context = useContext(AccountContext)
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider')
  }
  return context
}