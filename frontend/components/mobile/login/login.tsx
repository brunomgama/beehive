import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from 'next/link'

interface LoginProps {
    handleSubmit: (e: React.FormEvent) => Promise<void>
    formData: { username: string; password: string }
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error: string
    isLoading: boolean
    showPassword: boolean
    setShowPassword: (value: boolean | ((prev: boolean) => boolean)) => void
  }

export function Login({ handleSubmit, formData, handleChange, error, 
    isLoading, showPassword, setShowPassword }: LoginProps) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-950">
            <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="w-full max-w-sm sm:max-w-md space-y-6">
                    <div className="text-left">
                        <h2 className="text-5xl sm:text-4xl lg:text-6xl font-thin text-gray-100 font-[var(--font-inter)] mb-2">
                            Welcome
                        </h2>
                        <p className="text-base sm:text-lg text-gray-100 text-left">
                            Access your account and continue your journey
                        </p>
                    </div>
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="username" className='block text-gray-100 font-[var(--font-inter)] mb-2 text-base sm:text-lg'>
                                    Username
                                </Label>
                                <Input id="username" name="username" type="text" 
                                    required value={formData.username} onChange={handleChange}
                                    placeholder="Enter your username" className="w-full text-gray-100 h-12 sm:h-14 rounded-xl text-base sm:text-lg px-4"/>
                            </div>
                            <div className="relative">
                                <Label htmlFor="password" className='block text-gray-100 font-[var(--font-inter)] mb-2 text-base sm:text-lg'>
                                    Password
                                </Label>
                                <Input id="password" name="password"type={showPassword ? "text" : "password"} required value={formData.password}
                                 onChange={handleChange}  placeholder="Enter your password" className="w-full text-gray-100 h-12 sm:h-14 rounded-xl text-base sm:text-lg px-4 pr-12"/>
                                <Button type="button" variant={"ghost"}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-4 text-gray-400 hover:text-gray-300 transition-colors"
                                    onClick={() => setShowPassword((v) => !v)} tabIndex={-1}
                                    aria-label={showPassword ? "Hide password" : "Show password"}>
                                    {showPassword ? 
                                        <EyeOff size={20} /> : 
                                        <Eye size={20} />}
                                </Button>
                            </div>
                        </div>
                        
                        <hr className="border-gray-700" />

                        {error && (
                            <div className="text-red-400 text-base sm:text-lg text-center bg-red-950/30 border border-red-800 rounded-lg p-3">
                                {error}
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <Button type="submit" disabled={isLoading} 
                                className="w-full bg-purple-900 text-gray-100 hover:text-gray-900 hover:bg-purple-100 
                                disabled:bg-purple-900/50 disabled:text-gray-400 rounded-xl h-12 sm:h-14 text-base sm:text-lg 
                                font-medium transition-all duration-200">
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>
                            
                            <p className="text-base sm:text-lg text-gray-100 text-center">
                                New to the platform?{' '}
                                <Link  href="/signup" 
                                    className="font-medium text-purple-400 hover:text-purple-300 transition-colors" >
                                    Create a new account
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* <div className="hidden lg:block fixed right-0 top-0 w-1/2 h-screen"
                style={{ 
                    backgroundImage: "url('/LoginWallpaperIII.jpg')", backgroundSize: 'cover', 
                    backgroundPosition: 'center', zIndex: -1 }}/> */}
        </div>
    )
}