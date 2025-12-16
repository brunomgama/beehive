'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  loadingComponent?: React.ReactNode
  redirectTo?: string
  saveReturnUrl?: boolean
}

/**
 * Protected Route Component
 * Wraps content that requires authentication
 * Automatically redirects to login if user is not authenticated
 */
export function ProtectedRoute({ children, loadingComponent, redirectTo = '/login', saveReturnUrl = true }: ProtectedRouteProps) {
  const { user, isLoading, error } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isLoading) return

    // User is authenticated - allow render
    if (user) {
      setShouldRender(true)
      return
    }

    // User is not authenticated - redirect to login
    if (!user) {
      if (saveReturnUrl && pathname) {
        try {
          sessionStorage.setItem('auth_return_url', pathname)
        } catch (err) {
          console.error('Failed to save return URL:', err)
        }
      }

      // Redirect to login
      router.replace(redirectTo)
      setShouldRender(false)
    }
  }, [user, isLoading, router, pathname, redirectTo, saveReturnUrl])

  // Show loading state
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>
    }
    // TODO: CREATE A LOADING COMPONENT
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4 p-6 max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Authentication Error</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <button onClick={() => router.push(redirectTo)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Don't render protected content until auth check complete
  if (!shouldRender || !user) {
    return null
  }

  return <>{children}</>
}

/**
 * Utility function to get and clear the return URL
 * Use this in your login component after successful authentication
 */
export function getAuthReturnUrl(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    const returnUrl = sessionStorage.getItem('auth_return_url')
    if (returnUrl) {
      sessionStorage.removeItem('auth_return_url')
      return returnUrl
    }
  } catch (err) {
    console.error('Failed to get return URL:', err)
  }
  
  return null
}