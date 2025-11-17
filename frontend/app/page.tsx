'use client'

import { ProtectedRoute } from "@/components/protected-route"
import { useIsMobile } from "@/hooks/use-mobile"

export default function Home() {
  const isMobile = useIsMobile()

  return (
    <ProtectedRoute>
      Hello
    </ProtectedRoute>
  )
}