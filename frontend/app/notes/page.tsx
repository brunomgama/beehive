'use client'

import { NotesMobile } from '@/components/mobile/notes/notes'
import { useIsMobile } from '@/hooks/use-mobile'

export default function Notes() {
  const isMobile = useIsMobile()

  return (
    <>
      {isMobile ? (
        <NotesMobile />
      ) : (
        <></>
      )}
    </>
  )
}