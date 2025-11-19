import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface SignupProps {
    handleSubmit: (e: React.FormEvent) => Promise<void>
    formData: { 
        firstName: string; 
        lastName: string;
        username: string;
        email: string;
        password: string;
    }
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error: string
    isLoading: boolean
    showPassword: boolean
    setShowPassword: (value: boolean | ((prev: boolean) => boolean)) => void
}

export function Signup({handleSubmit, formData, handleChange, error, 
    isLoading, showPassword, setShowPassword }: SignupProps) {

    return (
     <div className="min-h-screen bg-gray-950 flex flex-col px-4 py-6">
        <div className="flex-1 flex items-start justify-center">
          <div className="w-full max-w-md space-y-6">
            <div>
              <h2 className="text-3xl font-thin text-gray-100 text-left font-[var(--font-inter)] mb-3">
                Create Account
              </h2>
              <p className="text-base text-gray-100 text-left">
                Join us and start your journey
              </p>
            </div>
  
            <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <Label
                    htmlFor="firstName"
                    className="text-gray-100 font-[var(--font-inter)] mb-1 text-base"
                  >
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
                    className="mt-2 text-gray-100 h-12 rounded-xl text-base px-4"
                  />
                </div>
  
                <div>
                  <Label
                    htmlFor="lastName"
                    className="text-gray-100 font-[var(--font-inter)] mb-1 text-base"
                  >
                    Last Name
                  </Label>
                  <Input id="lastName" name="lastName" type="text" required value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="mt-2 text-gray-100 h-12 rounded-xl text-base px-4"
                  />
                </div>
  
                <div>
                  <Label
                    htmlFor="username"
                    className="text-gray-100 font-[var(--font-inter)] mb-1 text-base"
                  >
                    Username
                  </Label>
                  <Input id="username" name="username" type="text" required value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="mt-2 text-gray-100 h-12 rounded-xl text-base px-4"
                  />
                </div>
  
                <div>
                  <Label
                    htmlFor="email"
                    className="text-gray-100 font-[var(--font-inter)] mb-1 text-base"
                  >
                    Email
                  </Label>
                  <Input id="email" name="email" type="email" required value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="mt-2 text-gray-100 h-12 rounded-xl text-base px-4"
                  />
                </div>
  
                <div>
                  <Label htmlFor="password" className="text-gray-100 font-[var(--font-inter)] mb-1 text-base">
                    Password
                  </Label>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password (min 8 characters)"
                      className="mt-2 text-gray-100 h-12 rounded-xl text-base px-4 pr-12" />
                    <button type="button" className="absolute right-4 bottom-4 text-gray-400"
                        onClick={() => setShowPassword((v) => !v)} tabIndex={-1} >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
  
              <hr className="my-4 border-gray-800" />
  
              {error && (
                <div className="text-red-500 text-sm text-center px-2">
                  {error}
                </div>
              )}
  
              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-900 text-gray-100 hover:text-gray-900 hover:bg-purple-100 rounded-xl h-12 text-base"
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
                <p className="mt-4 text-sm text-gray-100 text-center">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-purple-400 hover:text-purple-100">
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