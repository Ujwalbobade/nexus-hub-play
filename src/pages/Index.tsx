import { LoginScreen } from "@/components/auth/login-screen"
import UnifiedGamingStation from "@/components/station/unified-gaming-station"
import { useAuth } from "@/contextProvider/AuthContext"

const Index = () => {
  const { user, loginUser, logoutUser } = useAuth()
  
  const handleLogin = async (identifier: string, password: string) => {
    // Mock login - in production, this would call your API
    const mockUser = {
      id: 1,
      username: identifier,
      email: `${identifier}@gaming.com`,
      balance: 100,
      isActive: true,
      role: "user",
      fullName: identifier,
      phoneNumber: null,
    }
    
    // Store user in auth context
    loginUser({ token: "mock-token", user: mockUser })
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return <UnifiedGamingStation onLogout={logoutUser} />
}

export default Index
