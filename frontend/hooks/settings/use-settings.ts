import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

/**
 * Shared hook for settings page logic
 * Handles profile video selection and user data
 */
export function useSettings() {
  const { user, logout } = useAuth()
  const [videoSrc, setVideoSrc] = useState<string>(
    'https://videos.pexels.com/video-files/7710243/7710243-uhd_2560_1440_30fps.mp4'
  )

  /**
   * Check for custom profile video
   * If user is Bruno Gama, try to load custom video
   */
  useEffect(() => {
    if (user?.firstName === 'Bruno' && user?.lastName === 'Gama') {
      checkCustomVideo()
    }
  }, [user])

  /**
   * Check if custom video exists
   */
  const checkCustomVideo = async () => {
    try {
      const response = await fetch('./profile.mp4', { method: 'HEAD' })
      if (response.ok) {
        setVideoSrc('./profile.mp4')
      }
    } catch (error) {
      console.log('Custom video not found, using default')
    }
  }

  /**
   * Get user's full name
   */
  const fullName = user ? `${user.firstName} ${user.lastName}` : ''

  /**
   * Media content for profile video
   */
  const mediaContent = [
    {
      src: videoSrc,
      alt: 'Profile Video',
      clipId: 'clip-rect' as const,
      type: 'video' as const,
    }
  ]

  return {
    user,
    fullName,
    videoSrc,
    mediaContent,
    logout,
  }
}