'use client'

import { useRouter } from "next/navigation"
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi, User } from '@/lib/api/auth/auth-api'
import { invalidateCache } from '@/lib/util/cache'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Authentication Provider
 * Manages user session, token storage, and cache invalidation
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token')
        
        if (storedToken) {
          try {
            const userData = await authApi.getCurrentUser(storedToken)
            setToken(storedToken)
            setUser(userData)
            setError(null)
          } catch (err) {
            console.error('Failed to validate token:', err)
            localStorage.removeItem('auth_token')
            setError('Session expired. Please login again.')
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err)
        setError('Failed to initialize authentication')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  /**
   * Login user and store credentials
   */
  const login = useCallback((newToken: string, newUser: User) => {
    try {
      setToken(newToken)
      setUser(newUser)
      setError(null)
      localStorage.setItem('auth_token', newToken)
    } catch (err) {
      console.error('Failed to save auth token:', err)
      setError('Failed to save session')
    }
  }, [])

  /**
   * Logout user and clear all cached data
   */
  const logout = useCallback(() => {
    try {
      // Clear user state
      setToken(null)
      setUser(null)
      setError(null)
      
      localStorage.removeItem('auth_token')
      if (user?.id) { invalidateCache.clearUserCache(user.id) }
      router.push('/login')
    } catch (err) {
      console.error('Error during logout:', err)
      router.push('/login')
    }
  }, [router, user])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access authentication context
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}