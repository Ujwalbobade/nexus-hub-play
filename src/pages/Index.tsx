import { useState } from "react"
import { LoginScreen } from "@/components/auth/login-screen"
import { PS5GamingStation } from "@/components/station/ps5-gaming-station"

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

  return <PS5GamingStation onLogout={handleLogout} />
};

export default Index;
