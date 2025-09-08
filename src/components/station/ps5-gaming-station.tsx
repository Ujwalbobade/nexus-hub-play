import { useState, useEffect } from "react"
import { GameCarousel } from "@/components/ui/game-carousel"
import { UserProfile } from "@/components/ui/user-profile"
import { TimeTracker } from "@/components/ui/time-tracker"
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
  Zap
} from "lucide-react"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [platform, setPlatform] = useState<"pc" | "ps5">("ps5")
  const [user, setUser] = useState<User>({
    name: "Player One",
    email: "player@example.com",
    level: 15,
    totalPlaytime: 2847,
    gamesPlayed: 12,
    achievements: 45,
    joinDate: "2024-01-15"
  })

  const [pcGames] = useState<Game[]>([
    { id: 1, title: "Cyberpunk 2077", category: "RPG", playtime: 234, lastPlayed: "2 hours ago", isInstalled: true, progress: 65 },
    { id: 2, title: "Valorant", category: "FPS", playtime: 456, lastPlayed: "Yesterday", isInstalled: true, progress: 0 },
    { id: 3, title: "League of Legends", category: "MOBA", playtime: 789, lastPlayed: "3 days ago", isInstalled: true, progress: 0 },
    { id: 4, title: "Minecraft", category: "Sandbox", playtime: 123, lastPlayed: "1 week ago", isInstalled: true, progress: 0 },
    { id: 5, title: "Counter-Strike 2", category: "FPS", playtime: 345, lastPlayed: "2 days ago", isInstalled: true, progress: 0 },
    { id: 6, title: "Steam", category: "Launcher", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
    { id: 7, title: "Epic Games", category: "Launcher", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
    { id: 8, title: "Discord", category: "Communication", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
    { id: 9, title: "OBS Studio", category: "Tool", playtime: 45, lastPlayed: "1 week ago", isInstalled: true, progress: 0 },
    { id: 10, title: "Chrome", category: "Browser", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
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
    return [...allGames].sort((a, b) => b.playtime - a.playtime).slice(0, 5)
  }

  const getRecentGames = () => {
    return allGames.filter(game => game.lastPlayed).slice(0, 6)
  }

  const getInstalledGames = () => {
    return allGames.filter(game => game.isInstalled)
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
    { id: "tracker", name: "Time Tracker", icon: Clock },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-ps5-black via-ps5-surface to-ps5-card">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-ps5-card/80 backdrop-blur-md border-b border-ps5-secondary/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Platform Switcher */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-ps5-accent to-blue-600 shadow-lg">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-ps5-white">Gaming Station</h1>
              </div>
              
              {/* Platform Switch */}
              <div className="flex items-center gap-2 bg-ps5-surface/50 rounded-lg p-1 border border-ps5-secondary/30">
                <button
                  onClick={() => setPlatform("pc")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    platform === "pc"
                      ? "bg-ps5-accent text-white shadow-lg"
                      : "text-ps5-white/70 hover:text-ps5-white hover:bg-ps5-surface/50"
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  PC
                </button>
                <button
                  onClick={() => setPlatform("ps5")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    platform === "ps5"
                      ? "bg-ps5-accent text-white shadow-lg"
                      : "text-ps5-white/70 hover:text-ps5-white hover:bg-ps5-surface/50"
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  PS5
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ps5-white/50 w-4 h-4" />
                <Input
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-ps5-surface border-ps5-secondary/50 text-ps5-white placeholder-ps5-white/50 focus:border-ps5-accent"
                />
              </div>
            </div>

            {/* System Status */}
            <div className="flex items-center gap-4 text-ps5-white/70">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                <Volume2 className="w-4 h-4" />
                <Tv className="w-4 h-4" />
              </div>
              <div className="text-sm">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-ps5-surface/50 border-b border-ps5-secondary/20">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-ps5-accent text-ps5-accent"
                      : "border-transparent text-ps5-white/70 hover:text-ps5-white hover:border-ps5-white/30"
                  }`}
                >
                  <Icon className="w-4 h-4" />
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
            />

            {/* Recently Played */}
            <GameCarousel
              title="⏱️ Continue Playing"
              games={getRecentGames()}
              onGameSelect={handleGameSelect}
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
                    !["Launcher", "Tool", "Browser", "Communication"].includes(game.category) &&
                    (searchTerm === "" || 
                     game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     game.category.toLowerCase().includes(searchTerm.toLowerCase()))
                  )}
                  onGameSelect={handleGameSelect}
                />

                {/* Launchers */}
                <GameCarousel
                  title="🚀 Game Launchers"
                  games={getInstalledGames().filter(game => 
                    game.category === "Launcher" &&
                    (searchTerm === "" || 
                     game.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  )}
                  onGameSelect={handleGameSelect}
                />

                {/* Tools */}
                <GameCarousel
                  title="🔧 Tools & Applications"
                  games={getInstalledGames().filter(game => 
                    ["Tool", "Browser", "Communication"].includes(game.category) &&
                    (searchTerm === "" || 
                     game.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  )}
                  onGameSelect={handleGameSelect}
                />
              </>
            ) : (
              <>
                {/* PS5 Games by Category */}
                <GameCarousel
                  title="🎮 Action Games"
                  games={getInstalledGames().filter(game => 
                    ["Action", "Action RPG"].includes(game.category) &&
                    (searchTerm === "" || 
                     game.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  )}
                  onGameSelect={handleGameSelect}
                />

                <GameCarousel
                  title="🏁 Racing & Sports"
                  games={getInstalledGames().filter(game => 
                    ["Racing", "Sports"].includes(game.category) &&
                    (searchTerm === "" || 
                     game.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  )}
                  onGameSelect={handleGameSelect}
                />

                <GameCarousel
                  title="🎲 Other Games"
                  games={getInstalledGames().filter(game => 
                    !["Action", "Action RPG", "Racing", "Sports"].includes(game.category) &&
                    (searchTerm === "" || 
                     game.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  )}
                  onGameSelect={handleGameSelect}
                />
              </>
            )}

            {/* All Games */}
            <GameCarousel
              title={`📥 All ${platform.toUpperCase()} ${platform === "pc" ? "Software" : "Games"}`}
              games={allGames.filter(game => 
                searchTerm === "" || 
                game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                game.category.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              onGameSelect={handleGameSelect}
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

        {activeTab === "tracker" && (
          <div className="max-w-4xl mx-auto">
            <TimeTracker onTimeUpdate={handleTimeUpdate} />
          </div>
        )}
      </main>
    </div>
  )
}