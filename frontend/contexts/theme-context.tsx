'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Theme } from '@/lib/themes'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Theme Provider with proper hydration handling
 * Prevents hydration mismatches in Next.js SSR
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    try {
      const stored = localStorage.getItem('theme') as Theme
      if (stored && ['light', 'dark', 'orange'].includes(stored)) {
        setThemeState(stored)
        document.documentElement.classList.remove('light', 'dark', 'orange')
        document.documentElement.classList.add(stored)
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    try {
      localStorage.setItem('theme', theme)
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error)
    }
    
    document.documentElement.classList.remove('light', 'dark', 'orange')
    document.documentElement.classList.add(theme)
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to access theme context
 * @throws Error if used outside ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}