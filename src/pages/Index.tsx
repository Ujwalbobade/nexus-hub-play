import { LoginScreen } from "@/components/auth/login-screen"
import UnifiedGamingStation from "@/components/station/unified-gaming-station"
import { useAuth } from "@/contextProvider/AuthContext"
import { login } from "@/services/api"
import { toast } from "sonner"

const Index = () => {
  const { user, loginUser, logoutUser } = useAuth()
  
  const handleLogin = async (identifier: string, password: string) => {
    try {
      // Call the actual login API
      const response = await login(identifier, password)
      
      // Store user and token in auth context
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

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return <UnifiedGamingStation onLogout={logoutUser} />
}

export default Index
