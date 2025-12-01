'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react"
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface SignupProps {
  handleSubmit: (e: React.FormEvent) => Promise<void>
  formData: { 
    username: string
    email: string
    password: string
    confirmPassword: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error: string
  isLoading: boolean
  showPassword: boolean
  setShowPassword: (value: boolean | ((prev: boolean) => boolean)) => void
  showConfirmPassword: boolean
  setShowConfirmPassword: (value: boolean | ((prev: boolean) => boolean)) => void
}

export function SignupMobile({ handleSubmit, formData, handleChange, error, isLoading, showPassword, setShowPassword,
    showConfirmPassword,setShowConfirmPassword}: SignupProps) {
  const [mounted, setMounted] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'fair' | 'good' | 'strong'>('weak')

  useEffect(() => {
    setMounted(true)
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.height = '100%'
    
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }
  }, [])

  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength('weak')
      return
    }

    let strength = 0
    if (formData.password.length >= 8) strength++
    if (/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password)) strength++
    if (/\d/.test(formData.password)) strength++
    if (/[^a-zA-Z0-9]/.test(formData.password)) strength++

    if (strength === 1) setPasswordStrength('weak')
    else if (strength === 2) setPasswordStrength('fair')
    else if (strength === 3) setPasswordStrength('good')
    else setPasswordStrength('strong')
  }, [formData.password])

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500'
      case 'fair': return 'bg-orange-500'
      case 'good': return 'bg-yellow-500'
      case 'strong': return 'bg-green-500'
    }
  }

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak': return 'w-1/4'
      case 'fair': return 'w-2/4'
      case 'good': return 'w-3/4'
      case 'strong': return 'w-full'
    }
  }

  if (!mounted) return null

  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden bg-[#2A2A2A] fixed inset-0">
      
      {/* Top Section - Character Display */}
      <div className="flex-[0.8] flex items-center justify-center bg-gradient-to-b from-[#D5FFDE] to-[#C8F5D1] relative overflow-hidden rounded-b-[2rem]">
        
        {/* Soft background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-green-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl" />
        </div>
        
        {/* Video Container - Hi-five celebration character */}
        <div className="relative z-10 flex items-center justify-center p-8">
          <div className="relative">
            {/* Circular container for video */}
            <div className="w-[15rem] h-[15rem] rounded-full overflow-hidden bg-white/50 backdrop-blur-sm shadow-2xl shadow-black/10 flex items-center justify-center">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-110">
                <source src="/videos/hi_five.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            
            {/* Decorative celebration sparkles */}
            <div className="absolute -top-8 -right-8">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0L22 18L20 40L18 18L20 0Z" fill="#4ADE80" opacity="0.6" className="animate-sparkle-1"/>
                <path d="M0 20L18 22L40 20L18 18L0 20Z" fill="#4ADE80" opacity="0.6" className="animate-sparkle-2"/>
              </svg>
            </div>
            
            <div className="absolute -bottom-8 -left-8">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 0L16.5 13.5L15 30L13.5 13.5L15 0Z" fill="#22C55E" opacity="0.5" className="animate-sparkle-3"/>
                <path d="M0 15L13.5 16.5L30 15L13.5 13.5L0 15Z" fill="#22C55E" opacity="0.5" className="animate-sparkle-4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Signup Form */}
      <div className="flex-[1.2] bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] px-6 py-6 flex flex-col overflow-y-auto">
        
        {/* Welcome Text */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Join BeeHive
          </h1>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto w-full">
          
          {/* Username Field */}
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-sm font-semibold text-gray-300">
              Username
            </Label>
            <Input id="username" name="username" type="text" required value={formData.username} onChange={handleChange} placeholder="Choose a username"
              className="h-12 bg-white/10 border-2 border-white/20 text-white placeholder:text-gray-500 rounded-2xl focus:border-[#86EFAC] 
              focus:ring-4 focus:ring-[#86EFAC]/20 transition-all font-medium backdrop-blur-sm"/>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-300">
              Email
            </Label>
            <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="Enter your email"
              className="h-12 bg-white/10 border-2 border-white/20 text-white placeholder:text-gray-500 rounded-2xl focus:border-[#86EFAC] 
              focus:ring-4 focus:ring-[#86EFAC]/20 transition-all font-medium backdrop-blur-sm"/>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Input id="password" name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} 
                placeholder="Create a password" className="h-12 bg-white/10 border-2 border-white/20 text-white placeholder:text-gray-500 
                rounded-2xl pr-14 focus:border-[#86EFAC] focus:ring-4 focus:ring-[#86EFAC]/20 transition-all font-medium backdrop-blur-sm"/>
              <button type="button" 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#86EFAC] transition-colors p-1"
                onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {formData.password && (
              <div className="space-y-1">
                <div className="flex gap-1 h-1.5">
                  <div className={`flex-1 rounded-full transition-all ${getStrengthWidth()} ${getStrengthColor()}`} />
                  <div className={`flex-1 rounded-full bg-white/10`} />
                  <div className={`flex-1 rounded-full bg-white/10`} />
                  <div className={`flex-1 rounded-full bg-white/10`} />
                </div>
                <p className="text-xs text-gray-400 capitalize">{passwordStrength} password</p>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-300">
              Confirm Password
            </Label>
            <div className="relative">
              <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={formData.confirmPassword}onChange={handleChange} 
                placeholder="Confirm your password" className="h-12 bg-white/10 border-2 border-white/20 text-white placeholder:text-gray-500 rounded-2xl pr-14 
                focus:border-[#86EFAC] focus:ring-4 focus:ring-[#86EFAC]/20 transition-all font-medium backdrop-blur-sm"/>
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#86EFAC] transition-colors p-1" 
              onClick={() => setShowConfirmPassword((v) => !v)} tabIndex={-1}>
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {formData.confirmPassword && (
              <div className="flex items-center gap-2 text-xs">
                {formData.password === formData.confirmPassword ? (
                  <>
                    <Check size={14} className="text-green-400" />
                    <span className="text-green-400">Passwords match</span>
                  </>
                ) : (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-red-400" />
                    <span className="text-red-400">Passwords don't match</span>
                  </>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border-2 border-red-500/30 text-red-400 rounded-2xl p-3 text-sm font-medium animate-slide-down backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="text-xs text-gray-400 text-center pt-1">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-[#86EFAC] hover:text-[#BBF7D0] underline">
              Terms
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[#86EFAC] hover:text-[#BBF7D0] underline">
              Privacy Policy
            </Link>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Link href="/login" className="text-gray-400 hover:text-white font-medium transition-colors text-base">
              Sign in
            </Link>
            
            <Button type="submit" disabled={isLoading} 
              className="flex-1 h-14 bg-gradient-to-r from-[#86EFAC] to-[#BBF7D0] hover:from-[#BBF7D0] hover:to-[#86EFAC] 
              text-gray-900 font-bold text-base rounded-full shadow-lg shadow-[#86EFAC]/30 hover:shadow-[#86EFAC]/50 
              hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {isLoading ? (
                <span className="flex items-center gap-3 relative z-10">
                  <div className="w-5 h-5 border-3 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2 relative z-10">
                  Create account
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}