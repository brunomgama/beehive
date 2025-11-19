"use client"

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <NextThemesProvider {...props} enableSystem={false} disableTransitionOnChange={false}>
      <ThemeHandler>
        {children}
      </ThemeHandler>
    </NextThemesProvider>
  )
}

function ThemeHandler({ children }: { children: React.ReactNode }) {
  const [forceUpdate, setForceUpdate] = useState(0)

  useEffect(() => {
    const handleThemeChange = () => {
      setForceUpdate(prev => prev + 1)
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          handleThemeChange()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  return <div key={forceUpdate}>{children}</div>
}