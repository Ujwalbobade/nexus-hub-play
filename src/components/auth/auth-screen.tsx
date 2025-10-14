import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gamepad2, User, Lock, Eye, EyeOff } from "lucide-react";
import { login, register,forgotPassword} from "@/services/api"; // Assume these API functions exist

interface AuthScreenProps {
  onLogin: (identifier: string, password: string) => void;
  onRegister: (username: string, email: string, password: string) => void;
  onForgotPassword: (identifier: string) => void;
}

// ----------------- UI COMPONENT -----------------
const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    if (mode === "login") {
      const data = await login(identifier, password);
      localStorage.setItem("token", data.token);
      console.log("Logged in user:", data.user);
      // optionally navigate to /home
    } else if (mode === "register") {
      await register(identifier, email, password);
      alert("Registration successful!");
      setMode("login");
    } else if (mode === "forgot") {
      await forgotPassword(identifier);
      alert("If an account exists, check your email!");
    }
  } catch (err: any) {
    alert(err.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-ps5-black via-ps5-surface to-ps5-card flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-ps5-accent to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-ps5-white">
            {mode === "login"
              ? "Sign In"
              : mode === "register"
              ? "Register"
              : "Forgot Password"}
          </h1>
        </div>

        {/* Toggle buttons */}
        <div className="flex justify-center space-x-3">
          <Button
            variant={mode === "login" ? "default" : "outline"}
            onClick={() => setMode("login")}
          >
            Login
          </Button>
          <Button
            variant={mode === "register" ? "default" : "outline"}
            onClick={() => setMode("register")}
          >
            Register
          </Button>
          <Button
            variant={mode === "forgot" ? "default" : "outline"}
            onClick={() => setMode("forgot")}
          >
            Forgot
          </Button>
        </div>

        {/* Card Form */}
        <Card className="bg-ps5-card/80 backdrop-blur-sm border-ps5-secondary/30 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Identifier */}
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-ps5-white/90">
                {mode === "register" ? "Username" : "Username or Email"}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ps5-white/50 w-5 h-5" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder={
                    mode === "register" ? "Enter username" : "Username or email"
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-12 bg-ps5-surface border-ps5-secondary/50 text-ps5-white placeholder-ps5-white/50 focus:border-ps5-accent"
                  required
                />
              </div>
            </div>

            {/* Email only for register */}
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-ps5-white/90">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-ps5-surface border-ps5-secondary/50 text-ps5-white placeholder-ps5-white/50 focus:border-ps5-accent"
                  required
                />
              </div>
            )}

            {/* Password */}
            {(mode === "login" || mode === "register") && (
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ps5-white/50 hover:text-ps5-accent"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm password for register */}
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-ps5-white/90">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-ps5-surface border-ps5-secondary/50 text-ps5-white placeholder-ps5-white/50 focus:border-ps5-accent"
                  required
                />
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={
                isLoading ||
                (mode === "login" && (!identifier || !password)) ||
                (mode === "register" &&
                  (!identifier || !email || !password || !confirmPassword)) ||
                (mode === "forgot" && !identifier)
              }
              className="w-full bg-ps5-accent hover:bg-ps5-accent/90 text-white font-medium py-3 text-base shadow-lg"
            >
              {isLoading
                ? mode === "login"
                  ? "Signing In..."
                  : mode === "register"
                  ? "Registering..."
                  : "Sending..."
                : mode === "login"
                ? "Login"
                : mode === "register"
                ? "Register"
                : "Recover"}
            </Button>

            {mode === "login" && (
              <div className="mt-4 text-center">
                <Button variant="link" onClick={() => setMode("forgot")}>
                  Forgot Password?
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AuthScreen;