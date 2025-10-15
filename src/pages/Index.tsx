import { useState } from "react"
import { LoginScreen } from "@/components/auth/login-screen"
import UnifiedGamingStation from "@/components/station/unified-gaming-station"

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const handleLogin = (email: string, password: string) => {
    // In a real app, you'd validate credentials here
    console.log("Login attempt:", email)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return <UnifiedGamingStation onLogout={handleLogout} />
};

export default Index;
