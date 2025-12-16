'use client'

import { NotesMobile } from '@/components/mobile/notes/notes'
import { ProtectedRoute } from '@/components/protected-route'
import { ResponsiveLayout } from '@/components/responsive-layout'

export default function Notes() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout mobile={<NotesMobile />} desktop={<></>} />
    </ProtectedRoute>
  )
}