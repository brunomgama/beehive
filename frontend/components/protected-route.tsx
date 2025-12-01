'use client'

import { useAuth } from '../contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoadingPage from './mobile/loading/loading'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (<LoadingPage />)
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}