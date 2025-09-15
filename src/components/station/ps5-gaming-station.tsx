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
    { id: "settings", name: "Settings", icon: Settings },
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
      {/* Clean Header - Only shown in PC mode */}
      {platform === "pc" && (
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
                      platform !== "pc"
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
                      <DropdownMenuItem 
                        onClick={() => setActiveTab('settings')}
                        className="cursor-pointer"
                      >
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
      )}

      {/* Controller-Friendly Navigation - Only shown in PC mode */}
      {platform === "pc" && (
        <nav className="bg-muted/50 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 px-6 py-4 text-sm font-medium rounded-t-lg ${
                      activeTab === tab.id
                        ? "bg-background text-foreground border-t-2 border-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                )
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {platform === "ps5" ? (
          /* PS5 Interface - Fullscreen with Background */
          <div className="relative h-screen w-full overflow-hidden">
            {/* Game Background Wallpaper */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
              }}
            />
            
            {/* Top Drawer - Game Selector & System Info */}
            <div className="absolute top-0 left-0 right-0 z-20">
              <div className="bg-ps5-black/60 backdrop-blur-xl border-b border-ps5-surface/30">
                <div className="container mx-auto px-6 py-4">
                  {/* Game Selector Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <h2 className="text-ps5-text font-bold text-lg">Featured Games</h2>
                      <div className="flex items-center bg-ps5-surface/20 rounded-lg p-1">
                        <button
                          onClick={() => setPlatform("pc")}
                          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-ps5-blue/50 text-ps5-text/80 hover:text-ps5-text hover:bg-ps5-surface/20"
                        >
                          <Monitor className="w-4 h-4" />
                          PC Mode
                        </button>
                        <button
                          onClick={() => setPlatform("ps5")}
                          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-ps5-blue/50 bg-ps5-blue text-white shadow-md"
                        >
                          <Zap className="w-4 h-4" />
                          PS5 Mode
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-ps5-text">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Wifi className="w-4 h-4 text-ps5-text/80" />
                          <span className="text-sm">Connected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-ps5-text/80" />
                          <span className="text-sm">85%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-ps5-text/80" />
                          <span className={`text-sm font-semibold ${timeLeft > 30 ? 'text-green-400' : timeLeft > 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {Math.floor(timeLeft / 60)}h {timeLeft % 60}m left
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Game Selection Carousel */}
                  <div className="overflow-x-auto">
                    <div className="flex gap-4 pb-2">
                      {ps5Games.slice(0, 6).map((game) => (
                        <button
                          key={game.id}
                          onClick={() => handleGameSelect(game)}
                          className="flex-shrink-0 w-32 h-20 bg-ps5-surface/20 rounded-lg border border-ps5-blue/30 hover:border-ps5-blue hover:bg-ps5-surface/30 transition-all focus:outline-none focus:ring-4 focus:ring-ps5-blue/50 overflow-hidden group"
                        >
                          <div className="w-full h-full bg-gradient-to-br from-ps5-blue/20 to-purple-600/20 flex items-center justify-center">
                            <span className="text-ps5-text text-xs font-medium text-center px-2 group-hover:text-white transition-colors">
                              {game.title}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Info Panel - Right Side */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-80 animate-slide-in-right">
              <div className="bg-ps5-surface/40 backdrop-blur-xl rounded-2xl border border-ps5-blue/30 p-6 space-y-6 hover-scale">
                {/* Featured Game */}
                <div className="space-y-4 animate-fade-in">
                  <div className="aspect-video bg-gradient-to-br from-ps5-blue to-purple-600 rounded-xl relative overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                      alt="Spider-Man 2"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-ps5-text animate-fade-in" style={{ animationDelay: '0.2s' }}>
                      <h3 className="text-xl font-bold">Spider-Man 2</h3>
                      <p className="text-sm opacity-90">Continue your adventure</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="absolute bottom-4 right-4 bg-ps5-blue text-white hover:bg-ps5-blue/80 font-semibold px-6 text-lg py-3 focus:outline-none focus:ring-4 focus:ring-ps5-blue/50 hover-scale animate-scale-in"
                      style={{ animationDelay: '0.4s' }}
                      onClick={() => handleGameSelect(ps5Games.find(g => g.title === "Spider-Man 2") || ps5Games[0])}
                    >
                      Play
                    </Button>
                  </div>
                  
                  {/* Game Progress */}
                  <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="flex justify-between text-ps5-text text-sm">
                      <span>Story Progress</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-ps5-surface/30 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-ps5-blue to-cyan-400 h-2 rounded-full transition-all duration-1000" style={{width: '75%'}} />
                    </div>
                  </div>
                </div>

                {/* Recent Games */}
                <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  <h4 className="text-ps5-text font-semibold">Recent Games</h4>
                  <div className="space-y-3">
                    {getRecentGames().slice(0, 3).map((game, index) => (
                      <button
                        key={game.id}
                        onClick={() => handleGameSelect(game)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-ps5-surface/20 hover:bg-ps5-surface/30 transition-all group focus:outline-none focus:ring-2 focus:ring-ps5-blue hover-scale animate-fade-in"
                        style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-ps5-surface to-ps5-card rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Gamepad2 className="w-6 h-6 text-ps5-text" />
                        </div>
                        <div className="flex-1 text-left">
                          <h5 className="text-ps5-text font-medium text-sm group-hover:text-ps5-blue transition-colors">
                            {game.title}
                          </h5>
                          <p className="text-ps5-text/60 text-xs">{game.lastPlayed}</p>
                        </div>
                        {game.progress && game.progress > 0 && (
                          <div className="text-xs text-ps5-text/60">{game.progress}%</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-ps5-surface/20 border-ps5-blue/30 text-ps5-text hover:bg-ps5-surface/30 hover:border-ps5-blue text-lg py-3 focus:outline-none focus:ring-4 focus:ring-ps5-blue/30 hover-scale"
                    onClick={() => setActiveTab('games')}
                  >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    All Games
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-ps5-surface/20 border-ps5-blue/30 text-ps5-text hover:bg-ps5-surface/30 hover:border-ps5-blue text-lg py-3 focus:outline-none focus:ring-4 focus:ring-ps5-blue/30 hover-scale"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* PC Mode - Grid Layout */
          <div className="container mx-auto px-6 py-8 space-y-8">
            {activeTab === "home" && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-card border border-border rounded-xl p-6 text-center shadow-lg">
                    <div className="text-3xl font-bold text-primary">{allGames.filter(g => g.isInstalled).length}</div>
                    <div className="text-sm text-muted-foreground mt-1">Installed</div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6 text-center shadow-lg">
                    <div className="text-3xl font-bold text-foreground">{Math.floor(user.totalPlaytime / 60)}h</div>
                    <div className="text-sm text-muted-foreground mt-1">Total Playtime</div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6 text-center shadow-lg">
                    <div className="text-3xl font-bold text-foreground">{user.achievements}</div>
                    <div className="text-sm text-muted-foreground mt-1">Achievements</div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6 text-center shadow-lg">
                    <div className="text-3xl font-bold text-foreground">{user.level}</div>
                    <div className="text-sm text-muted-foreground mt-1">Level</div>
                  </div>
                </div>

                {/* Recently Played */}
                <GameCarousel
                  title="🕒 Recently Played"
                  games={getRecentGames()}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />

                {/* Top Games */}
                <GameCarousel
                  title="🏆 Most Played"
                  games={getTopGames()}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />
              </>
            )}

            {activeTab === "games" && (
              <>
                {/* Categories for PC */}
                <GameCarousel
                  title="🎮 Games"
                  games={getInstalledGames().filter(game => game.category === "Game")}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />

                <GameCarousel
                  title="🚀 Game Launchers"
                  games={getInstalledGames().filter(game => game.category === "Launcher")}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />

                <GameCarousel
                  title="🌐 Web Browsers"
                  games={getInstalledGames().filter(game => game.category === "Browser")}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />

                <GameCarousel
                  title="🔧 Tools & Applications"
                  games={getInstalledGames().filter(game => game.category === "Tool")}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />

                {/* All Software */}
                <GameCarousel
                  title="📥 All PC Software"
                  games={allGames.filter(game => 
                    searchQuery === "" || 
                    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    game.category.toLowerCase().includes(searchQuery.toLowerCase())
                  )}
                  onGameSelect={handleGameSelect}
                  platform={platform}
                />
              </>
            )}

            {activeTab === "profile" && (
              <div className="max-w-2xl mx-auto">
                <UserProfile
                  user={user}
                  onLogout={onLogout}
                  onSettings={() => setActiveTab('settings')}
                />
              </div>
            )}

            {activeTab === "settings" && (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-foreground mb-2">Settings & Preferences</h2>
                  <p className="text-muted-foreground">Customize your gaming experience</p>
                </div>

                {/* Theme Preferences */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Palette className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Theme Preferences</h3>
                      <p className="text-sm text-muted-foreground">Choose your preferred color theme</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`group relative p-6 rounded-xl border-2 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 ${
                        theme === 'dark' 
                          ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 border-4 border-white/20 shadow-lg" />
                        <div className="text-center">
                          <h4 className="font-semibold text-foreground">Dark Theme</h4>
                          <p className="text-xs text-muted-foreground mt-1">Classic dark gaming mode</p>
                        </div>
                        {theme === 'dark' && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => setTheme('blue')}
                      className={`group relative p-6 rounded-xl border-2 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 ${
                        theme === 'blue' 
                          ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 border-4 border-blue-300/30 shadow-lg" />
                        <div className="text-center">
                          <h4 className="font-semibold text-foreground">PS5 Blue</h4>
                          <p className="text-xs text-muted-foreground mt-1">Official PlayStation colors</p>
                        </div>
                        {theme === 'blue' && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => setTheme('purple')}
                      className={`group relative p-6 rounded-xl border-2 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 ${
                        theme === 'purple' 
                          ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-900 to-purple-600 border-4 border-purple-300/30 shadow-lg" />
                        <div className="text-center">
                          <h4 className="font-semibold text-foreground">Purple Neon</h4>
                          <p className="text-xs text-muted-foreground mt-1">Futuristic gaming vibe</p>
                        </div>
                        {theme === 'purple' && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Other Settings Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Display Settings */}
                  <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Monitor className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">Display Settings</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Resolution</span>
                        <span className="text-sm font-medium text-foreground">1920x1080</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Refresh Rate</span>
                        <span className="text-sm font-medium text-foreground">60 Hz</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">HDR</span>
                        <span className="text-sm font-medium text-foreground">Enabled</span>
                      </div>
                    </div>
                  </div>

                  {/* Audio Settings */}
                  <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Volume2 className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">Audio Settings</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Master Volume</span>
                        <span className="text-sm font-medium text-foreground">85%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">3D Audio</span>
                        <span className="text-sm font-medium text-foreground">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Voice Chat</span>
                        <span className="text-sm font-medium text-foreground">Always On</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}
