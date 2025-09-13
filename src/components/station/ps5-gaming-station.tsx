import { useState, useEffect } from "react"
import { GameCarousel } from "@/components/ui/game-carousel"
import { UserProfile } from "@/components/ui/user-profile"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Home, 
  Gamepad2, 
  User, 
  Clock,
  Settings, 
  Search,
  Tv,
  Wifi,
  Volume2,
  Monitor,
  Zap,
  LogOut,
  Palette,
  X,
  Trophy,
  ChevronDown
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

interface User {
  name: string
  email: string
  avatar?: string
  level: number
  totalPlaytime: number
  gamesPlayed: number
  achievements: number
  joinDate: string
}

interface Game {
  id: number
  title: string
  image?: string
  category: string
  playtime: number
  lastPlayed?: string
  isInstalled: boolean
  progress?: number
}

interface PS5GamingStationProps {
  onLogout: () => void
}

export function PS5GamingStation({ onLogout }: PS5GamingStationProps) {
  const [activeTab, setActiveTab] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [platform, setPlatform] = useState<"pc" | "ps5">("ps5")
  const [theme, setTheme] = useState<"dark" | "blue" | "purple">("dark")
  const [sessionTime, setSessionTime] = useState(0) // in minutes
  const [timeLeft, setTimeLeft] = useState(120) // 2 hours in minutes
  const [user, setUser] = useState<User>({
    name: "Player One",
    email: "player@example.com",
    level: 15,
    totalPlaytime: 2847,
    gamesPlayed: 12,
    achievements: 45,
    joinDate: "2024-01-15"
  })

  // Session timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1)
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const [pcGames] = useState<Game[]>([
    { id: 1, title: "Cyberpunk 2077", category: "Game", playtime: 234, lastPlayed: "2 hours ago", isInstalled: true, progress: 65 },
    { id: 2, title: "Valorant", category: "Game", playtime: 456, lastPlayed: "Yesterday", isInstalled: true, progress: 0 },
    { id: 3, title: "League of Legends", category: "Game", playtime: 789, lastPlayed: "3 days ago", isInstalled: true, progress: 0 },
    { id: 4, title: "Minecraft", category: "Game", playtime: 123, lastPlayed: "1 week ago", isInstalled: true, progress: 0 },
    { id: 5, title: "Counter-Strike 2", category: "Game", playtime: 345, lastPlayed: "2 days ago", isInstalled: true, progress: 0 },
    { id: 6, title: "Steam", category: "Launcher", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
    { id: 7, title: "Epic Games", category: "Launcher", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
    { id: 8, title: "Battle.net", category: "Launcher", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
    { id: 9, title: "Chrome", category: "Browser", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
    { id: 10, title: "Firefox", category: "Browser", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
    { id: 11, title: "Edge", category: "Browser", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
    { id: 12, title: "Discord", category: "Tool", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
    { id: 13, title: "OBS Studio", category: "Tool", playtime: 45, lastPlayed: "1 week ago", isInstalled: true, progress: 0 },
    { id: 14, title: "VS Code", category: "Tool", playtime: 120, lastPlayed: "Today", isInstalled: true, progress: 0 },
    { id: 15, title: "Spotify", category: "Tool", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
  ])

  const [ps5Games] = useState<Game[]>([
    { id: 1, title: "Spider-Man 2", category: "Action", playtime: 134, lastPlayed: "1 hour ago", isInstalled: true, progress: 75 },
    { id: 2, title: "God of War Ragnarök", category: "Action RPG", playtime: 256, lastPlayed: "Yesterday", isInstalled: true, progress: 45 },
    { id: 3, title: "Horizon Forbidden West", category: "Action RPG", playtime: 189, lastPlayed: "2 days ago", isInstalled: true, progress: 60 },
    { id: 4, title: "The Last of Us Part II", category: "Action", playtime: 223, lastPlayed: "1 week ago", isInstalled: true, progress: 100 },
    { id: 5, title: "Ratchet & Clank", category: "Platformer", playtime: 145, lastPlayed: "3 days ago", isInstalled: true, progress: 85 },
    { id: 6, title: "Gran Turismo 7", category: "Racing", playtime: 78, lastPlayed: "5 days ago", isInstalled: true, progress: 30 },
    { id: 7, title: "Demon's Souls", category: "Action RPG", playtime: 167, lastPlayed: "1 month ago", isInstalled: false, progress: 45 },
    { id: 8, title: "Returnal", category: "Roguelike", playtime: 89, lastPlayed: "2 weeks ago", isInstalled: true, progress: 25 },
    { id: 9, title: "Ghost of Tsushima", category: "Action", playtime: 234, lastPlayed: "1 week ago", isInstalled: true, progress: 95 },
    { id: 10, title: "Bloodborne", category: "Action RPG", playtime: 156, lastPlayed: "3 days ago", isInstalled: true, progress: 70 },
  ])

  const allGames = platform === "pc" ? pcGames : ps5Games

  const getTopGames = () => {
    const filtered = allGames.filter(game => 
      searchQuery === "" || 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return [...filtered].sort((a, b) => b.playtime - a.playtime).slice(0, 5)
  }

  const getRecentGames = () => {
    const filtered = allGames.filter(game => 
      game.lastPlayed && 
      (searchQuery === "" || 
       game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       game.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    return filtered.slice(0, 6)
  }

  const getInstalledGames = () => {
    return allGames.filter(game => 
      game.isInstalled &&
      (searchQuery === "" || 
       game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       game.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  const handleGameSelect = (game: Game) => {
    console.log(`Launching ${game.title}`)
    // In a real implementation, this would launch the game
  }

  const handleTimeUpdate = (gameName: string, minutes: number) => {
    // Update user's total playtime
    setUser(prev => ({
      ...prev,
      totalPlaytime: prev.totalPlaytime + minutes
    }))
  }

  const tabs = [
    { id: "home", name: "Home", icon: Home },
    { id: "games", name: "Games", icon: Gamepad2 },
    { id: "profile", name: "Profile", icon: User },
  ]

  const getThemeClasses = () => {
    switch(theme) {
      case "blue": return "from-blue-900 via-blue-800 to-slate-900"
      case "purple": return "from-purple-900 via-purple-800 to-slate-900"
      default: return "from-ps5-black via-ps5-surface to-ps5-card"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* Clean Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand & Platform */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary shadow-lg">
                  <Gamepad2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Gaming Station</h1>
                  <p className="text-sm text-muted-foreground">Premium Gaming Experience</p>
                </div>
              </div>
              
              {/* Clean Platform Switch */}
              <div className="flex items-center bg-muted rounded-lg p-1 border border-border">
                <button
                  onClick={() => setPlatform("pc")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    platform === "pc"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-background"
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  PC Mode
                </button>
                <button
                  onClick={() => setPlatform("ps5")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    platform === "ps5"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-background"
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  PS5 Mode
                </button>
              </div>
            </div>

            {/* Enhanced Search */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search games, apps, tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* User Actions & Info */}
            <div className="flex items-center gap-4">
              {/* Time Remaining Info */}
              <div className="hidden lg:flex items-center bg-muted rounded-lg px-4 py-2 border border-border">
                <div className="text-center">
                  <div className={`text-lg font-bold ${timeLeft > 30 ? 'text-green-600' : timeLeft > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {Math.floor(timeLeft / 60)}h {timeLeft % 60}m
                  </div>
                  <div className="text-xs text-muted-foreground">Time Remaining</div>
                </div>
              </div>

              {/* Theme Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-muted">
                    <Palette className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <div className="w-3 h-3 rounded-full bg-slate-900 mr-3" />
                    Dark Theme
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('blue')}>
                    <div className="w-3 h-3 rounded-full bg-blue-600 mr-3" />
                    PS5 Blue
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('purple')}>
                    <div className="w-3 h-3 rounded-full bg-purple-600 mr-3" />
                    Purple Neon
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Enhanced Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 h-auto hover:bg-muted">
                    <Avatar className="w-10 h-10 border-2 border-primary">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <div className="text-sm font-semibold text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground">Level {user.level} • {user.email}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  {/* Profile Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 border-2 border-primary">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground text-lg">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs font-medium">
                            Level {user.level}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Premium Member
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="p-4 border-b border-border">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-foreground">
                          {Math.floor(user.totalPlaytime / 60)}h
                        </div>
                        <div className="text-xs text-muted-foreground">Total Play</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">{user.gamesPlayed}</div>
                        <div className="text-xs text-muted-foreground">Games</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-foreground">{user.achievements}</div>
                        <div className="text-xs text-muted-foreground">Achievements</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="p-2">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="w-4 h-4 mr-3" />
                      View Full Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Trophy className="w-4 h-4 mr-3" />
                      Achievements & Stats
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-3" />
                      Settings & Preferences
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={onLogout}
                      className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Controller-Friendly Navigation for PS5 Mode */}
      <nav className="bg-muted/50 border-b border-border">
        <div className="container mx-auto px-6">
          <div className={platform === "ps5" ? "flex justify-center space-x-6" : "flex space-x-2"}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 ${
                    platform === "ps5" 
                      ? `px-8 py-6 text-lg font-bold rounded-xl ${
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground shadow-lg scale-105"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50 hover:scale-105"
                        }`
                      : `px-6 py-4 text-sm font-medium rounded-t-lg ${
                          activeTab === tab.id
                            ? "bg-background text-primary border-b-2 border-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        }`
                  }`}
                >
                  <Icon className={platform === "ps5" ? "w-6 h-6" : "w-4 h-4"} />
                  {tab.name}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === "home" && (
          <div className="space-y-12">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-ps5-accent/20 to-blue-600/20 rounded-2xl p-8 border border-ps5-accent/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-ps5-white mb-2">
                    Welcome back, {user.name}!
                  </h2>
                  <p className="text-ps5-white/70">
                    Ready to continue your {platform === "pc" ? "PC" : "PS5"} gaming adventure?
                  </p>
                </div>
                <div className="text-right text-ps5-white/70">
                  <div className="text-2xl font-bold text-ps5-accent">
                    {Math.floor(user.totalPlaytime / 60)}h
                  </div>
                  <div className="text-sm">Total Playtime</div>
                </div>
              </div>
            </div>

            {/* Top 5 Most Played */}
            <GameCarousel
              title={`🏆 Top ${platform.toUpperCase()} Games`}
              games={getTopGames()}
              onGameSelect={handleGameSelect}
              platform={platform}
            />

            {/* Recently Played */}
            <GameCarousel
              title="⏱️ Continue Playing"
              games={getRecentGames()}
              onGameSelect={handleGameSelect}
              platform={platform}
            />

            {platform === "pc" && (
              <>
                {/* PC Tools & Launchers */}
                <GameCarousel
                  title="🚀 Launchers & Tools"
                  games={allGames.filter(game => 
                    game.category === "Launcher" || 
                    game.category === "Tool" || 
                    game.category === "Browser" ||
                    game.category === "Communication"
                  )}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />
              </>
            )}

            {platform === "ps5" && (
              <>
                {/* PS5 Exclusives */}
                <GameCarousel
                  title="🎮 PlayStation Exclusives"
                  games={allGames.filter(game => 
                    ["Spider-Man 2", "God of War Ragnarök", "Horizon Forbidden West", "Ratchet & Clank"].includes(game.title)
                  )}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />
              </>
            )}
          </div>
        )}

        {activeTab === "games" && (
          <div className="space-y-12">
            {/* Platform-specific categories */}
            {platform === "pc" ? (
              <>
                {/* PC Games */}
                <GameCarousel
                  title="🎮 PC Games"
                  games={getInstalledGames().filter(game => 
                    game.category === "Game"
                  )}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />

                {/* Game Launchers */}
                <GameCarousel
                  title="🚀 Game Launchers"
                  games={getInstalledGames().filter(game => 
                    game.category === "Launcher"
                  )}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />

                {/* Browsers */}
                <GameCarousel
                  title="🌐 Web Browsers"
                  games={getInstalledGames().filter(game => 
                    game.category === "Browser"
                  )}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />

                {/* Tools & Applications */}
                <GameCarousel
                  title="🔧 Tools & Applications"
                  games={getInstalledGames().filter(game => 
                    game.category === "Tool"
                  )}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />
              </>
            ) : (
              <>
                {/* PS5 Games by Category */}
                <GameCarousel
                  title="🎮 Action Games"
                  games={getInstalledGames().filter(game => 
                    ["Action", "Action RPG"].includes(game.category)
                  )}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />

                <GameCarousel
                  title="🏁 Racing & Sports"
                  games={getInstalledGames().filter(game => 
                    ["Racing", "Sports"].includes(game.category)
                  )}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />

                <GameCarousel
                  title="🎲 Other Games"
                  games={getInstalledGames().filter(game => 
                    !["Action", "Action RPG", "Racing", "Sports"].includes(game.category)
                  )}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />
              </>
            )}

            {/* All Games */}
            <GameCarousel
              title={`📥 All ${platform.toUpperCase()} ${platform === "pc" ? "Software" : "Games"}`}
              games={allGames.filter(game => 
                searchQuery === "" || 
                game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                game.category.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              onGameSelect={handleGameSelect}
              platform={platform}
            />
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto">
            <UserProfile
              user={user}
              onLogout={onLogout}
              onSettings={() => console.log("Settings clicked")}
            />
          </div>
        )}

      </main>
    </div>
  )
}