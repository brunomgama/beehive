'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useLogin } from '@/hooks/login/use-login'

/**
 * Login Mobile Component
 * Beautiful mobile login with video background
 */
export function LoginMobile() {
  const [mounted, setMounted] = useState(false)
  
  const {
    formData,
    error,
    isLoading,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
  } = useLogin()

  // Prevent scrolling on mobile
  useEffect(() => {
    setMounted(true)
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

  if (!mounted) return null

  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden bg-[#2A2A2A] fixed inset-0">
      
      {/* Top Section - Character Display */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#FFE5D9] to-[#FFD5C8] relative overflow-hidden rounded-b-[2rem]">
        
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl" />
        </div>
        
        {/* Video Container */}
        <div className="relative z-10 flex items-center justify-center p-8">
          <div className="relative">
            <div className="w-[15rem] h-[15rem] rounded-full overflow-hidden bg-white/50 backdrop-blur-sm shadow-2xl shadow-black/10 flex items-center justify-center">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-110">
                <source src="/videos/choose_character.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            
            {/* Decorative Line */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
              <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                <path d="M 5 35 Q 10 5 30 10 Q 50 15 55 5" stroke="#2A2A2A" strokeWidth="3" strokeLinecap="round" fill="none" className="animate-draw-line"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Login Form */}
      <div className="flex-1 bg-[#2A2A2A] px-6 py-8 flex flex-col overflow-hidden">
        
        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to BeeHive
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto w-full">
          
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-semibold text-gray-300">
              Username
            </Label>
            <Input 
              id="username" 
              name="username" 
              type="text" 
              required 
              value={formData.username} 
              onChange={handleChange}
              placeholder="Enter your username" 
              className="h-14 bg-white/10 border-2 border-white/20 text-white placeholder:text-gray-500 rounded-2xl focus:border-[#FFB380] focus:ring-4 focus:ring-[#FFB380]/20 transition-all font-medium backdrop-blur-sm"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-300">
                Password
              </Label>
              <Link href="/forgot-password" className="text-sm text-[#FFB380] hover:text-[#FFC99E] font-medium transition-colors">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                value={formData.password}
                onChange={handleChange} 
                placeholder="Enter your password"
                className="h-14 bg-white/10 border-2 border-white/20 text-white placeholder:text-gray-500 rounded-2xl pr-14 focus:border-[#FFB380] focus:ring-4 focus:ring-[#FFB380]/20 transition-all font-medium backdrop-blur-sm"
              />
              <button 
                type="button" 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FFB380] transition-colors p-1"
                onClick={() => setShowPassword((v) => !v)} 
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border-2 border-red-500/30 text-red-400 rounded-2xl p-4 text-sm font-medium animate-slide-down backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Link href="/signup" className="text-gray-400 hover:text-white font-medium transition-colors text-base">
              Sign up
            </Link>
            
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="flex-1 h-14 bg-gradient-to-r from-[#FFB380] to-[#FFC99E] hover:from-[#FFC99E] hover:to-[#FFB380] text-gray-900 font-bold text-base rounded-full shadow-lg shadow-[#FFB380]/30 hover:shadow-[#FFB380]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {isLoading ? (
                <span className="flex items-center gap-3 relative z-10">
                  <div className="w-5 h-5 border-3 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2 relative z-10">
                  Sign in
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </div>
        </form>

        {/* Spacer */}
        <div className="flex-1" />
        
        {/* Trust Badge */}
        <div className="text-center pt-6 pb-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
            Secure & Encrypted
          </div>
        </div>
      </div>
    </div>
  )
}