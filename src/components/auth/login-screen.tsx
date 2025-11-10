import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gamepad2, User, Lock, Eye, EyeOff, Mail, ArrowLeft } from "lucide-react"
import { z } from "zod"
import { toast } from "sonner"
import { forgotPassword } from "@/services/api"

const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Username or email is required").max(100),
  password: z.string().min(1, "Password is required").max(100)
})

const registerSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(50).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100)
})

interface LoginScreenProps {
  onLogin: (identifier: string, password: string) => void
  onRegister: (username: string, email: string, password: string) => void
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const validated = loginSchema.parse({ identifier, password })
      await onLogin(validated.identifier, validated.password)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const validated = registerSchema.parse({ username, email, password })
      await onRegister(validated.username, validated.email, validated.password)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestLogin = () => {
    setIsLoading(true)
    try {
      onLogin("guest", "guest")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const emailSchema = z.string().email("Invalid email address")
      emailSchema.parse(email)
      
      const response = await forgotPassword(email)
      toast.success(response.message || "Password reset link sent to your email")
      setIsForgotPassword(false)
      setEmail("")
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message)
      } else {
        toast.error(error instanceof Error ? error.message : "Failed to send reset link")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ps5-black via-ps5-surface to-ps5-card flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md space-y-6 md:space-y-8">
        {/* Logo */}
        <div className="text-center space-y-3 md:space-y-4">
          <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-ps5-accent to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Gamepad2 className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ps5-white">Nexus Gaming Hub</h1>
            <p className="text-sm md:text-base text-ps5-white/70 mt-2">Welcome back, gamer!</p>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="bg-ps5-card/80 backdrop-blur-sm border-ps5-secondary/30 p-6 md:p-8 shadow-2xl">
          {isForgotPassword ? (
            /* Forgot Password Form */
            <div className="space-y-5 md:space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setIsForgotPassword(false)}
                  className="text-ps5-white/70 hover:text-ps5-accent transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg md:text-xl font-semibold text-ps5-white">Reset Password</h2>
              </div>
              
              <p className="text-sm text-ps5-white/70">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-ps5-white/90 text-sm md:text-base">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ps5-white/50 w-4 h-4 md:w-5 md:h-5" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 md:pl-12 bg-ps5-surface border-ps5-secondary/50 text-ps5-white placeholder-ps5-white/50 focus:border-ps5-accent text-sm md:text-base"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-ps5-accent hover:bg-ps5-accent/90 text-white font-medium py-2.5 md:py-3 text-sm md:text-base shadow-lg hover:shadow-[0_8px_30px_hsl(0_112%_60%_/_0.3)] transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </div>
          ) : !isRegistering ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-5 md:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-ps5-white/90 text-sm md:text-base">
                  Username or Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ps5-white/50 w-4 h-4 md:w-5 md:h-5" />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Enter your username or email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10 md:pl-12 bg-ps5-surface border-ps5-secondary/50 text-ps5-white placeholder-ps5-white/50 focus:border-ps5-accent text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-ps5-white/90 text-sm md:text-base">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ps5-white/50 w-4 h-4 md:w-5 md:h-5" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 md:pl-12 pr-10 md:pr-12 bg-ps5-surface border-ps5-secondary/50 text-ps5-white placeholder-ps5-white/50 focus:border-ps5-accent text-sm md:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ps5-white/50 hover:text-ps5-accent transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !identifier || !password}
                className="w-full bg-ps5-accent hover:bg-ps5-accent/90 text-white font-medium py-2.5 md:py-3 text-sm md:text-base shadow-lg hover:shadow-[0_8px_30px_hsl(0_112%_60%_/_0.3)] transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs md:text-sm text-ps5-white/70 hover:text-ps5-accent transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative my-5 md:my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-ps5-secondary/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-ps5-card px-3 text-ps5-white/50">Or</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGuestLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full border-ps5-secondary/50 text-ps5-white hover:bg-ps5-surface/50 hover:border-ps5-accent/50 text-sm md:text-base"
              >
                Continue as Guest
              </Button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-5 md:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-ps5-white/90 text-sm md:text-base">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ps5-white/50 w-4 h-4 md:w-5 md:h-5" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 md:pl-12 bg-ps5-surface border-ps5-secondary/50 text-ps5-white placeholder-ps5-white/50 focus:border-ps5-accent text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-ps5-white/90 text-sm md:text-base">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ps5-white/50 w-4 h-4 md:w-5 md:h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 md:pl-12 bg-ps5-surface border-ps5-secondary/50 text-ps5-white placeholder-ps5-white/50 focus:border-ps5-accent text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-ps5-white/90 text-sm md:text-base">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ps5-white/50 w-4 h-4 md:w-5 md:h-5" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 md:pl-12 pr-10 md:pr-12 bg-ps5-surface border-ps5-secondary/50 text-ps5-white placeholder-ps5-white/50 focus:border-ps5-accent text-sm md:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ps5-white/50 hover:text-ps5-accent transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !username || !email || !password}
                className="w-full bg-ps5-accent hover:bg-ps5-accent/90 text-white font-medium py-2.5 md:py-3 text-sm md:text-base shadow-lg hover:shadow-[0_8px_30px_hsl(0_112%_60%_/_0.3)] transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          )}

          {/* Toggle between login/register */}
          <div className="mt-5 md:mt-6 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs md:text-sm text-ps5-white/70 hover:text-ps5-accent transition-colors"
            >
              {isRegistering ? (
                <>Already have an account? <span className="font-semibold">Sign In</span></>
              ) : (
                <>Don't have an account? <span className="font-semibold">Sign Up</span></>
              )}
            </button>
          </div>
        </Card>

        {/* Background Animation */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-24 h-24 md:w-32 md:h-32 bg-ps5-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 md:w-40 md:h-40 bg-blue-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-20 h-20 md:w-24 md:h-24 bg-ps5-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </div>
    </div>
  )
}