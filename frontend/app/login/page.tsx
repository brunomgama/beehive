'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/auth-context'
import { authApi } from '@/lib/api/auth/auth-api'
import { useIsMobile } from '@/hooks/use-mobile'
import { LoginDesktop } from '../../components/desktop/login/login'
import { LoginMobile } from '../../components/mobile/login/login'

export default function Login() {
  const isMobile = useIsMobile()

  const [formData, setFormData] = useState({username: '', password: ''})
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await authApi.login(formData);
  
    if (result.data) {
      login(result.data.token, {
        id: result.data.id,
        username: result.data.username,
        email: result.data.email,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        role: result.data.role,
      });
      router.push('/');
    } else {
      setError(result.error || 'Upps.. Sorry invalid credentials!');
    }
  
    setIsLoading(false);
  };

  return (
    <>
    { isMobile ? (
      <LoginMobile handleSubmit={handleSubmit} formData={formData} handleChange={handleChange} 
      error={error} isLoading={isLoading} showPassword={showPassword} setShowPassword={setShowPassword}/>
      ) : (
      <LoginDesktop  handleSubmit={handleSubmit} formData={formData} handleChange={handleChange} 
      error={error} isLoading={isLoading} showPassword={showPassword} setShowPassword={setShowPassword}/>
    )}
    </>
  )
}