'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/auth-context'
import { authApi } from '@/lib/api/auth-api'
import { Signup as SignupMobile } from '@/components/mobile/signup/signup'
import { Signup as SignupDesktop } from '@/components/desktop/signup/signup'
import { useIsMobile } from '@/hooks/use-mobile'

export default function Signup() {
  const isMobile = useIsMobile()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    const result = await authApi.register(formData)
    
    if (result.data) {
      login(result.data.token, {
        id: result.data.id,
        username: result.data.username,
        email: result.data.email,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        role: result.data.role,
      })
      router.push('/')
    } else {
      setError(result.error || 'Registration failed. Username or email may already exist.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
        { isMobile ? (
          <SignupMobile
            handleSubmit={handleSubmit}
            formData={formData}
            handleChange={handleChange}
            error={error}
            isLoading={isLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}/>
          ) : (
          <SignupDesktop 
            handleSubmit={handleSubmit}
            formData={formData}
            handleChange={handleChange}
            error={error}
            isLoading={isLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}/>
        )}
        </>
  )
}