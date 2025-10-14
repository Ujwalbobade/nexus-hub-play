import { useState, useEffect } from "react"
import { GameCarousel } from "@/components/ui/game-carousel"
import { Button } from "@/components/ui/button"
import { 
  Gamepad2, 
  User, 
  Settings, 
  Search,
  Monitor,
  Zap,
  LogOut,
  X,
  Trophy,
  ChevronDown,
  Clock,
  Coins,
  Library,
  Award
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { CategorySection } from "@/components/ui/category-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"

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

interface User {
  name: string
  email: string
  avatar?: string
  level: number
  totalPlaytime: number
  gamesPlayed: number
  achievements: number
}

interface UnifiedGamingStationProps {
  onLogout: () => void
}

// Unified game data
const gameData = {
  pc: [
    { id: 1, title: "Cyberpunk 2077", category: "Game", playtime: 234, lastPlayed: "2 hours ago", isInstalled: true, progress: 65 },
    { id: 2, title: "Valorant", category: "Game", playtime: 456, lastPlayed: "Yesterday", isInstalled: true, progress: 0 },
    { id: 3, title: "League of Legends", category: "Game", playtime: 789, lastPlayed: "3 days ago", isInstalled: true, progress: 0 },
    { id: 4, title: "Steam", category: "Launcher", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
    { id: 5, title: "Discord", category: "Tool", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
    { id: 6, title: "Chrome", category: "Browser", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
  ],
  ps5: [
    { id: 1, title: "Spider-Man 2", category: "Action", playtime: 134, lastPlayed: "1 hour ago", isInstalled: true, progress: 75 },
    { id: 2, title: "God of War Ragnarök", category: "Action RPG", playtime: 256, lastPlayed: "Yesterday", isInstalled: true, progress: 45 },
    { id: 3, title: "Horizon Forbidden West", category: "Action RPG", playtime: 189, lastPlayed: "2 days ago", isInstalled: true, progress: 60 },
    { id: 4, title: "The Last of Us Part II", category: "Action", playtime: 223, lastPlayed: "1 week ago", isInstalled: true, progress: 100 },
    { id: 5, title: "Ratchet & Clank", category: "Platformer", playtime: 145, lastPlayed: "3 days ago", isInstalled: true, progress: 85 },
  ]
}

export function UnifiedGamingStation({ onLogout }: UnifiedGamingStationProps) {
  const [platform, setPlatform] = useState<"pc" | "ps5">("pc")
  const [searchQuery, setSearchQuery] = useState("")
  const [timeLeft, setTimeLeft] = useState(120)
  const [activeTab, setActiveTab] = useState<"games" | "timepacks" | "coins" | "arcade">("games")
  const [user] = useState<User>({
    name: "Player One",
    email: "player@example.com",
    level: 15,
    totalPlaytime: 2847,
    gamesPlayed: 12,
    achievements: 45,
  })
  const [coins, setCoins] = useState(150)

  const timePacks = [
    { id: 1, duration: 30, price: 50, label: "30 Minutes" },
    { id: 2, duration: 60, price: 90, label: "1 Hour" },
    { id: 3, duration: 120, price: 160, label: "2 Hours" },
    { id: 4, duration: 180, price: 220, label: "3 Hours" },
    { id: 5, duration: 300, price: 350, label: "5 Hours" },
    { id: 6, duration: 480, price: 500, label: "8 Hours" },
  ]

  const coinPacks = [
    { id: 1, amount: 100, price: "$5", label: "100 Coins" },
    { id: 2, amount: 250, price: "$10", label: "250 Coins" },
    { id: 3, amount: 600, price: "$20", label: "600 Coins" },
    { id: 4, amount: 1500, price: "$45", label: "1500 Coins" },
  ]

  const navItems = [
    { id: "games" as const, label: "Games", icon: Library },
    { id: "timepacks" as const, label: "Time Packs", icon: Clock },
    { id: "coins" as const, label: "Coins", icon: Coins },
    { id: "arcade" as const, label: "Arcade", icon: Award },
  ]

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Unified filtering logic
  const getFilteredGames = (type: 'top' | 'recent' | 'all') => {
    const games = gameData[platform]
    const filtered = games.filter(game => 
      searchQuery === "" || 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    switch(type) {
      case 'top':
        return [...filtered].sort((a, b) => b.playtime - a.playtime).slice(0, 5)
      case 'recent':
        return filtered.filter(game => game.lastPlayed).slice(0, 6)
      default:
        return filtered
    }
  }

  const handleGameSelect = (game: Game) => {
    console.log(`Launching ${game.title}`)
  }

  const handlePurchaseTimePack = (pack: typeof timePacks[0]) => {
    if (coins >= pack.price) {
      setCoins(prev => prev - pack.price)
      setTimeLeft(prev => prev + pack.duration)
      console.log(`Purchased ${pack.label} for ${pack.price} coins`)
    } else {
      console.log("Not enough coins")
    }
  }

  const handlePurchaseCoinPack = (pack: typeof coinPacks[0]) => {
    console.log(`Purchase ${pack.label} for ${pack.price}`)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-background via-card to-muted">
        {/* Sidebar Navigation */}
        <Sidebar className="border-r border-border">
          <SidebarContent>
            <SidebarGroup>
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary">
                    <Gamepad2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">Gaming Hub</h2>
                    <p className="text-xs text-muted-foreground">Premium Station</p>
                  </div>
                </div>
              </div>

              <SidebarGroupContent className="mt-4">
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveTab(item.id)}
                        className={activeTab === item.id ? "bg-primary text-primary-foreground" : ""}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>

              {/* Platform Switch in Sidebar */}
              <div className="p-4 border-t border-border mt-auto">
                <div className="text-xs text-muted-foreground mb-2">Platform</div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => setPlatform("pc")}
                    variant={platform === "pc" ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    PC Gaming
                  </Button>
                  <Button
                    onClick={() => setPlatform("ps5")}
                    variant={platform === "ps5" ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    PlayStation 5
                  </Button>
                </div>
              </div>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-lg">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <SidebarTrigger />
                
                {/* Search Bar */}
                {activeTab === "games" && (
                  <div className="flex-1 max-w-lg">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search games..."
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
                )}

                {/* Stats & Profile */}
                <div className="flex items-center gap-4 ml-auto">
                  {/* Time & Coins Display */}
                  <div className="hidden lg:flex items-center gap-3">
                    <div className="flex items-center bg-muted rounded-lg px-4 py-2 border border-border">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${timeLeft > 30 ? 'text-green-600' : timeLeft > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {Math.floor(timeLeft / 60)}h {timeLeft % 60}m
                        </div>
                        <div className="text-xs text-muted-foreground">Time Left</div>
                      </div>
                    </div>
                    <div className="flex items-center bg-primary/10 rounded-lg px-4 py-2 border border-primary/20">
                      <Coins className="w-4 h-4 text-primary mr-2" />
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{coins}</div>
                        <div className="text-xs text-muted-foreground">Coins</div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Dropdown */}
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
                          <div className="text-xs text-muted-foreground">Level {user.level}</div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
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
                            <Badge variant="secondary" className="text-xs font-medium mt-2">
                              Level {user.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border-b border-border">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-foreground">
                              {Math.floor(user.totalPlaytime / 60)}h
                            </div>
                            <div className="text-xs text-muted-foreground">Play Time</div>
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
                      
                      <div className="p-2">
                        <DropdownMenuItem className="cursor-pointer">
                          <User className="w-4 h-4 mr-3" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Trophy className="w-4 h-4 mr-3" />
                          Achievements
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
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

          {/* Main Content */}
          <main className="flex-1 overflow-auto px-6 py-8 space-y-8">
            {/* Games Tab */}
            {activeTab === "games" && (
              <>
                <div>
                  <GameCarousel
                    title="Recently Played"
                    games={getFilteredGames('recent')}
                    onGameSelect={handleGameSelect}
                    platform={platform}
                  />
                </div>

                <div>
                  <GameCarousel
                    title="Most Played"
                    games={getFilteredGames('top')}
                    onGameSelect={handleGameSelect}
                    platform={platform}
                  />
                </div>

                <div>
                  <GameCarousel
                    title="All Games"
                    games={getFilteredGames('all')}
                    onGameSelect={handleGameSelect}
                    platform={platform}
                  />
                </div>

                {searchQuery && getFilteredGames('all').length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
                    <p className="text-muted-foreground">
                      Try searching with different keywords
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Time Packs Tab */}
            {activeTab === "timepacks" && (
              <CategorySection title="Time Packs" icon={Clock}>
                {timePacks.map((pack) => (
                  <Card key={pack.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        {pack.label}
                      </CardTitle>
                      <CardDescription>
                        {pack.price} Coins
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handlePurchaseTimePack(pack)}
                        className="w-full"
                        disabled={coins < pack.price}
                      >
                        {coins >= pack.price ? 'Purchase' : 'Not Enough Coins'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CategorySection>
            )}

            {/* Coins Tab */}
            {activeTab === "coins" && (
              <CategorySection title="Coin Packs" icon={Coins}>
                <Card className="col-span-full bg-primary/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="w-6 h-6 text-primary" />
                      Your Balance
                    </CardTitle>
                    <div className="text-4xl font-bold text-primary">{coins} Coins</div>
                  </CardHeader>
                </Card>
                {coinPacks.map((pack) => (
                  <Card key={pack.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Coins className="w-5 h-5 text-primary" />
                        {pack.label}
                      </CardTitle>
                      <CardDescription>
                        {pack.price}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handlePurchaseCoinPack(pack)}
                        className="w-full"
                        variant="secondary"
                      >
                        Buy Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CategorySection>
            )}

            {/* Arcade Tab */}
            {activeTab === "arcade" && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Arcade Competitions</h3>
                <p className="text-muted-foreground mb-6">
                  Compete with other players and win amazing prizes
                </p>
                <Badge variant="secondary" className="text-sm">Coming Soon</Badge>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
