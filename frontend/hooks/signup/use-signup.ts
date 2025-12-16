import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { authApi } from '@/lib/api/auth/auth-api'

interface SignupFormData {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

/**
 * Shared hook for signup logic
 * Handles form state, validation, and submission
 */
export function useSignup() {
  const router = useRouter()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  /**
   * Calculate password strength
   */
  const getPasswordStrength = (): 'weak' | 'fair' | 'good' | 'strong' => {
    if (!formData.password) return 'weak'

    let strength = 0
    if (formData.password.length >= 8) strength++
    if (/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password)) strength++
    if (/\d/.test(formData.password)) strength++
    if (/[^a-zA-Z0-9]/.test(formData.password)) strength++

    if (strength === 1) return 'weak'
    if (strength === 2) return 'fair'
    if (strength === 3) return 'good'
    return 'strong'
  }

  /**
   * Check if passwords match
   */
  const passwordsMatch = formData.password === formData.confirmPassword

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
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match'
    }

    if (!formData.email.includes('@')) {
      return 'Please enter a valid email address'
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
      // Register user
      const result = await authApi.register(formData)
      
      if (result.data) {
        // Auto-login after successful registration
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
        setError(result.error || 'Registration failed. Username or email may already exist.')
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
    showConfirmPassword,
    setShowConfirmPassword,
    passwordStrength: getPasswordStrength(),
    passwordsMatch,
    handleChange,
    handleSubmit,
  }
}