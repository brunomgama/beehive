import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { authApi } from '@/lib/api/auth/auth-api'

interface LoginFormData {
  username: string
  password: string
}

/**
 * Shared hook for login logic
 * Handles form state, validation, and submission
 */
export function useLogin() {
  const router = useRouter()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  })
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  /**
   * Handle form field changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  /**
   * Validate form data
   */
  const validateForm = (): string | null => {
    if (!formData.username.trim()) {
      return 'Please enter your username'
    }
    
    if (!formData.password) {
      return 'Please enter your password'
    }

    if (formData.username.length < 3) {
      return 'Username must be at least 3 characters long'
    }

    return null
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      // Login user
      const result = await authApi.login(formData)
      
      if (result.data) {
        // Save auth token and user data
        login(result.data.token, {
          id: result.data.id,
          username: result.data.username,
          email: result.data.email,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          role: result.data.role,
        })
        
        // Redirect to home
        router.push('/')
      } else {
        setError(result.error || 'Invalid credentials. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    error,
    isLoading,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
  }
}