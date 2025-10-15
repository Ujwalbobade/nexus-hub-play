import { useState, useEffect, useRef } from "react"
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
  Award,
  Menu,
  Play,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// ============= TYPES =============
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

type Platform = "pc" | "ps5"
type ActiveTab = "games" | "timepacks" | "coins" | "arcade"

// ============= DATA =============
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

const navItems = [
  { id: "games" as const, label: "Games", icon: Library },
  { id: "timepacks" as const, label: "Time Packs", icon: Clock },
  { id: "coins" as const, label: "Coins", icon: Coins },
  { id: "arcade" as const, label: "Arcade", icon: Award },
]

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

// ============= GAME CARD COMPONENT =============
function GameCard({ game, onSelect, platform }: { game: Game; onSelect: (game: Game) => void; platform: Platform }) {
  return (
    <div 
      onClick={() => onSelect(game)}
      className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg flex-shrink-0 w-64"
    >
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <Gamepad2 className="w-16 h-16 text-primary/40" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 truncate">{game.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{game.category}</p>
        {game.playtime > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{game.playtime}h played</span>
          </div>
        )}
        {game.lastPlayed && (
          <p className="text-xs text-muted-foreground mt-1">Last: {game.lastPlayed}</p>
        )}
        {game.progress && game.progress > 0 && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{game.progress}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${game.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button size="lg" className="gap-2">
          <Play className="w-5 h-5" />
          Launch
        </Button>
      </div>
    </div>
  )
}

// ============= GAME CAROUSEL COMPONENT =============
function GameCarousel({ 
  title, 
  games, 
  onGameSelect, 
  platform 
}: { 
  title: string
  games: Game[]
  onGameSelect: (game: Game) => void
  platform: Platform
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (games.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => scroll('left')}
            className="rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => scroll('right')}
            className="rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {games.map((game) => (
          <GameCard 
            key={game.id} 
            game={game} 
            onSelect={onGameSelect} 
            platform={platform}
          />
        ))}
      </div>
    </div>
  )
}

// ============= SIDEBAR COMPONENT =============
function GamingSidebar({ 
  activeTab, 
  setActiveTab, 
  platform, 
  setPlatform,
  isOpen,
  setIsOpen
}: { 
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  platform: Platform
  setPlatform: (platform: Platform) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col w-64 border-r border-border bg-gradient-to-b from-card to-background`}>
        <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-glow">
              <Gamepad2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Gaming Hub</h2>
              <p className="text-xs text-muted-foreground">Premium Station</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id 
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-accent" 
                  : "hover:bg-muted/50 text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">Platform</div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setPlatform("pc")}
              variant={platform === "pc" ? "default" : "outline"}
              size="sm"
              className={`w-full justify-start transition-all ${
                platform === "pc" 
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-accent hover:shadow-glow" 
                  : ""
              }`}
            >
              <Monitor className="w-4 h-4 mr-2" />
              PC Gaming
            </Button>
            <Button
              onClick={() => setPlatform("ps5")}
              variant={platform === "ps5" ? "default" : "outline"}
              size="sm"
              className={`w-full justify-start transition-all ${
                platform === "ps5" 
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-accent hover:shadow-glow" 
                  : ""
              }`}
            >
              <Zap className="w-4 h-4 mr-2" />
              PlayStation 5
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

// ============= MOBILE NAVIGATION DRAWER =============
function MobileNav({ 
  activeTab, 
  setActiveTab, 
  platform, 
  setPlatform 
}: { 
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  platform: Platform
  setPlatform: (platform: Platform) => void
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
          <Menu className="w-5 h-5 text-foreground" />
        </button>
      </SheetTrigger>
      <SheetContent side="top" className="bg-gradient-to-b from-card to-background border-b border-border">
        <div className="py-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-accent' 
                    : 'bg-muted/50 text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="border-t border-border pt-4">
            <div className="text-xs text-muted-foreground mb-3">Platform</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPlatform("pc")}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                  platform === "pc"
                    ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-accent'
                    : 'bg-muted/50 text-foreground hover:bg-muted'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="text-sm font-medium">PC</span>
              </button>
              <button
                onClick={() => setPlatform("ps5")}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                  platform === "ps5"
                    ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-accent'
                    : 'bg-muted/50 text-foreground hover:bg-muted'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">PS5</span>
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ============= SEARCH BAR =============
function SearchBar({ 
  searchQuery, 
  setSearchQuery 
}: { 
  searchQuery: string
  setSearchQuery: (query: string) => void
}) {
  return (
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
  )
}

// ============= STATS DISPLAY =============
function StatsDisplay({ timeLeft, coins }: { timeLeft: number; coins: number }) {
  return (
    <div className="hidden md:flex items-center gap-3">
      <div className="flex items-center bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg px-4 py-2 border border-accent/30 shadow-card">
        <Clock className="w-4 h-4 text-accent mr-2" />
        <div className="text-center">
          <div className={`text-lg font-bold ${timeLeft > 30 ? 'text-secondary' : timeLeft > 10 ? 'text-accent' : 'text-destructive'}`}>
            {Math.floor(timeLeft / 60)}h {timeLeft % 60}m
          </div>
          <div className="text-xs text-muted-foreground">Time Left</div>
        </div>
      </div>
      <div className="flex items-center bg-gradient-to-br from-primary/20 to-secondary/10 rounded-lg px-4 py-2 border border-primary/30 shadow-card">
        <Coins className="w-4 h-4 text-secondary mr-2" />
        <div className="text-center">
          <div className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{coins}</div>
          <div className="text-xs text-muted-foreground">Coins</div>
        </div>
      </div>
    </div>
  )
}

// ============= PROFILE DROPDOWN =============
function ProfileDropdown({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 h-auto hover:bg-muted rounded-xl">
          <Avatar className="w-10 h-10 border-2 border-primary shadow-glow">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden md:block">
            <div className="text-sm font-semibold text-foreground">{user.name}</div>
            <div className="text-xs bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Level {user.level}</div>
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
  )
}

// ============= HEADER COMPONENT =============
function Header({ 
  activeTab, 
  setActiveTab, 
  platform, 
  setPlatform, 
  searchQuery, 
  setSearchQuery, 
  timeLeft, 
  coins, 
  user, 
  onLogout 
}: {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  platform: Platform
  setPlatform: (platform: Platform) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  timeLeft: number
  coins: number
  user: User
  onLogout: () => void
}) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-card/95 via-primary/5 to-secondary/5 backdrop-blur-md border-b border-border shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-glow">
                <Gamepad2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Gaming Hub</h1>
              </div>
            </div>
            <MobileNav 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              platform={platform} 
              setPlatform={setPlatform} 
            />
          </div>
          
          {activeTab === "games" && (
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          )}

          <div className="flex items-center gap-4 ml-auto">
            <StatsDisplay timeLeft={timeLeft} coins={coins} />
            <ProfileDropdown user={user} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  )
}

// ============= GAMES TAB CONTENT =============
function GamesTabContent({ 
  games, 
  searchQuery, 
  platform, 
  onGameSelect 
}: { 
  games: Game[]
  searchQuery: string
  platform: Platform
  onGameSelect: (game: Game) => void
}) {
  const filterGames = (type: 'top' | 'recent' | 'all') => {
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

  const allGames = filterGames('all')

  return (
    <>
      <GameCarousel
        title="Recently Played"
        games={filterGames('recent')}
        onGameSelect={onGameSelect}
        platform={platform}
      />
      <GameCarousel
        title="Most Played"
        games={filterGames('top')}
        onGameSelect={onGameSelect}
        platform={platform}
      />
      <GameCarousel
        title="All Games"
        games={allGames}
        onGameSelect={onGameSelect}
        platform={platform}
      />

      {searchQuery && allGames.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
          <p className="text-muted-foreground">Try searching with different keywords</p>
        </div>
      )}
    </>
  )
}

// ============= TIME PACKS TAB CONTENT =============
function TimePacksTabContent({ 
  coins, 
  onPurchase 
}: { 
  coins: number
  onPurchase: (pack: typeof timePacks[0]) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold text-foreground">Time Packs</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {timePacks.map((pack) => (
          <Card key={pack.id} className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {pack.label}
              </CardTitle>
              <CardDescription>{pack.price} Coins</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => onPurchase(pack)}
                className="w-full"
                disabled={coins < pack.price}
              >
                {coins >= pack.price ? 'Purchase' : 'Not Enough Coins'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============= COINS TAB CONTENT =============
function CoinsTabContent({ 
  coins, 
  onPurchase 
}: { 
  coins: number
  onPurchase: (pack: typeof coinPacks[0]) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Coins className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold text-foreground">Coin Packs</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <CardDescription>{pack.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => onPurchase(pack)}
                className="w-full"
                variant="secondary"
              >
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============= ARCADE TAB CONTENT =============
function ArcadeTabContent() {
  return (
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
  )
}

// ============= MAIN COMPONENT =============
export default function UnifiedGamingStation({ onLogout }: { onLogout?: () => void }) {
  const [platform, setPlatform] = useState<Platform>("pc")
  const [searchQuery, setSearchQuery] = useState("")
  const [timeLeft, setTimeLeft] = useState(120)
  const [activeTab, setActiveTab] = useState<ActiveTab>("games")
  const [coins, setCoins] = useState(150)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user] = useState<User>({
    name: "Player One",
    email: "player@example.com",
    level: 15,
    totalPlaytime: 2847,
    gamesPlayed: 12,
    achievements: 45,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

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

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      console.log("Logout clicked")
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-background via-card to-muted">
      <GamingSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        platform={platform} 
        setPlatform={setPlatform}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          platform={platform}
          setPlatform={setPlatform}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          timeLeft={timeLeft}
          coins={coins}
          user={user}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-auto px-6 py-8 space-y-8">
          {activeTab === "games" && (
            <GamesTabContent 
              games={gameData[platform]} 
              searchQuery={searchQuery} 
              platform={platform} 
              onGameSelect={handleGameSelect} 
            />
          )}

          {activeTab === "timepacks" && (
            <TimePacksTabContent 
              coins={coins} 
              onPurchase={handlePurchaseTimePack} 
            />
          )}

          {activeTab === "coins" && (
            <CoinsTabContent 
              coins={coins} 
              onPurchase={handlePurchaseCoinPack} 
            />
          )}

          {activeTab === "arcade" && <ArcadeTabContent />}
        </main>
      </div>
    </div>
  )
}
