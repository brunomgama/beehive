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

export function LoginDesktop({ handleSubmit, formData, handleChange, error, 
    isLoading, showPassword, setShowPassword }: LoginProps) {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-950">
        <div className="flex-1 flex items-center justify-start m-20 bg-gray-950">
            <div className="max-w-xl w-full space-y-8">
                <div>
                    <h2 className="text-5xl font-thin text-gray-100 text-left font-[var(--font-inter)] mb-4">
                        Welcome
                    </h2>
                    <p className="mt-4 text-l text-gray-100 text-left">
                        Access your account and continue your journey
                    </p>
                    
                    <form className="mt-6 space-y-8" onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="username" className='text-gray-100 font-[var(--font-inter)] mb-1 text-lg'>Username</Label>
                                <Input id="username" name="username" type="text" required value={formData.username} onChange={handleChange}
                                    placeholder="Enter your username" className="mt-2 text-gray-100 h-14 rounded-xl text-lg px-4"/>
                            </div>
                            <div className="relative">
                                <Label htmlFor="password" className='text-gray-100 font-[var(--font-inter)] mb-1 text-lg'>Password</Label>
                                <Input id="password" name="password" type={showPassword ? "text" : "password"} required value={formData.password}
                                    onChange={handleChange} placeholder="Enter your password"
                                    className="mt-2 text-gray-100 h-14 rounded-xl text-lg px-4 pr-12"/>
                                
                                <button type="button" className="absolute right-4 bottom-4 text-gray-400"
                                    onClick={() => setShowPassword((v) => !v)} tabIndex={-1} >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        
                        <hr className="my-8 border-gray-700" />

                        {error && (
                            <div className="text-red-400 text-lg text-center">{error}</div>
                        )}
                        
                        <div>
                            <Button type="submit" disabled={isLoading} className="w-full bg-purple-900 text-gray-100 hover:text-gray-900 hover:bg-purple-100 rounded-xl h-14 text-lg">
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>
                            <p className="mt-4 text-lg text-gray-100 text-center">
                                New to the platform? {' '}
                                <Link href="/signup" className="font-medium text-purple-400 hover:text-purple-100">
                                    Create a new account
                                </Link>
                            </p>
                        </div>
                    </form>

                </div>
            </div>
        </div>
        {/* Right: Background Image (hidden on mobile) */}
        <div className="hidden md:block md:w-1/2 h-[calc(100vh-1rem)] m-2 rounded-3xl" 
            style={{ backgroundImage: "url('/LoginWallpaperIII.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}/>
        </div>
    )
}