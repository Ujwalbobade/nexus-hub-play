import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gamepad2, User, Lock, Eye, EyeOff } from "lucide-react"

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      onLogin(email, password)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestLogin = () => {
    setIsLoading(true)
    try {
      onLogin("guest@example.com", "guest")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ps5-black via-ps5-surface to-ps5-card flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-ps5-accent to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ps5-white">Gaming Station</h1>
            <p className="text-ps5-white/70 mt-2">Welcome back, gamer!</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-ps5-card/80 backdrop-blur-sm border-ps5-secondary/30 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-ps5-white/90">
                Email Address
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ps5-white/50 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 bg-ps5-surface border-ps5-secondary/50 text-ps5-white placeholder-ps5-white/50 focus:border-ps5-accent"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-ps5-white/90">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ps5-white/50 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 bg-ps5-surface border-ps5-secondary/50 text-ps5-white placeholder-ps5-white/50 focus:border-ps5-accent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ps5-white/50 hover:text-ps5-accent transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-ps5-accent hover:bg-ps5-accent/90 text-white font-medium py-3 text-base shadow-lg hover:shadow-[0_8px_30px_hsl(0_112%_60%_/_0.3)] transition-all duration-200"
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

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-ps5-secondary/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-ps5-card px-3 text-ps5-white/50">Or</span>
              </div>
            </div>

            {/* Guest Login */}
            <Button
              type="button"
              onClick={handleGuestLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full border-ps5-secondary/50 text-ps5-white hover:bg-ps5-surface/50 hover:border-ps5-accent/50"
            >
              Continue as Guest
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-ps5-white/50">
            <p>Demo credentials: any email + password</p>
          </div>
        </Card>

        {/* Background Animation */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-ps5-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-ps5-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </div>
    </div>
  )
}