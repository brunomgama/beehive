'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSignup } from '@/hooks/signup/use-signup'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import Link from 'next/link'

/**
 * Signup Desktop Component
 * Split-screen layout with wallpaper and form
 */
export function SignupDesktop() {
  const {
    formData,
    error,
    isLoading,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
  } = useSignup()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-950">
      
      {/* Left: Wallpaper */}
      <div
        className="hidden md:block md:w-1/2 h-[calc(100vh-1rem)] m-2 rounded-3xl"
        style={{
          backgroundImage: "url('/SignupWallpaper.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Right: Signup Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-950 p-8">
        <div className="max-w-2xl w-full space-y-8">
          
          {/* Header */}
          <div>
            <h2 className="text-5xl font-thin text-gray-100 text-left font-[var(--font-inter)] mb-8">
              Create Account
            </h2>
            <p className="mt-4 text-xl text-gray-100 text-left">
              Join us and start your journey
            </p>
          </div>
          
          {/* Form */}
          <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              
              {/* First Name */}
              <div>
                <Label htmlFor="firstName" className="text-gray-100 font-[var(--font-inter)] mb-1 text-lg">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="mt-2 text-gray-100 h-14 rounded-xl text-lg px-4"
                />
              </div>
              
              {/* Last Name */}
              <div>
                <Label htmlFor="lastName" className="text-gray-100 font-[var(--font-inter)] mb-1 text-lg">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="mt-2 text-gray-100 h-14 rounded-xl text-lg px-4"
                />
              </div>
              
              {/* Username */}
              <div>
                <Label htmlFor="username" className="text-gray-100 font-[var(--font-inter)] mb-1 text-lg">
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
                  className="mt-2 text-gray-100 h-14 rounded-xl text-lg px-4"
                />
              </div>
              
              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-gray-100 font-[var(--font-inter)] mb-1 text-lg">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="mt-2 text-gray-100 h-14 rounded-xl text-lg px-4"
                />
              </div>
              
              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-gray-100 font-[var(--font-inter)] mb-1 text-lg">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password (min 8 characters)"
                    className="mt-2 text-gray-100 h-14 rounded-xl text-lg px-4 pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-100 font-[var(--font-inter)] mb-1 text-lg">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="mt-2 text-gray-100 h-14 rounded-xl text-lg px-4"
                />
              </div>
            </div>

            <hr className="my-8 border-gray-700" />

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/30 text-red-400 rounded-xl p-4 text-lg text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-900 text-gray-100 hover:text-gray-900 hover:bg-purple-100 rounded-xl h-14 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <div className="w-5 h-5 border-3 border-gray-100/30 border-t-gray-100 rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create account
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
              
              <p className="mt-4 text-lg text-gray-100 text-center">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-purple-400 hover:text-purple-100 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}