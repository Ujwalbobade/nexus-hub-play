import { LoginScreen } from "@/components/auth/login-screen"
import UnifiedGamingStation from "@/components/station/unified-gaming-station"
import { useAuth } from "@/contextProvider/AuthContext"
import { login, register } from "@/services/api"
import { toast } from "sonner"

const Index = () => {
  const { user, loginUser, logoutUser } = useAuth()
  
  const handleLogin = async (identifier: string, password: string) => {
    try {
      const response = await login(identifier, password)
      loginUser({ 
        token: response.token, 
        user: response.user 
      })
      toast.success("Login successful!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed")
      throw error
    }
  }

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const response = await register(username, email, password)
      toast.success(response.message || "Account created successfully! Please sign in.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed")
      throw error
    }
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />
  }

  return <UnifiedGamingStation onLogout={logoutUser} />
}

export default Index
