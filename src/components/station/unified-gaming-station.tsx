import { useState, useEffect } from "react"
import { useAuth } from "@/contextProvider/AuthContext"
import { toast } from "sonner"
import { GamingSidebar } from "./GamingSidebar"
import { Header } from "./Header"
import { GamesTab } from "./tabs/GamesTab"
import { TimePacksTab } from "./tabs/TimePacksTab"
import { CoinsTab } from "./tabs/CoinsTab"
import { ArcadeTab } from "./tabs/ArcadeTab"
import { AppsTab } from "./tabs/AppsTab"
import { FoodTab } from "./tabs/FoodTab"
import { gameData, timePacks, coinPacks } from "./data"
import { Platform, ActiveTab, User, Game } from "./types"

export default function UnifiedGamingStation({ onLogout }: { onLogout?: () => void }) {
  const { user: authUser } = useAuth()
  const [platform, setPlatform] = useState<Platform>("pc")
  const [searchQuery, setSearchQuery] = useState("")
  const [timeLeft, setTimeLeft] = useState(120)
  const [activeTab, setActiveTab] = useState<ActiveTab>("games")
  const [coins, setCoins] = useState(150)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeOrders, setActiveOrders] = useState(0)
  
  const user: User = {
    name: authUser?.username || authUser?.email?.split('@')[0] || "Gamer",
    email: authUser?.email || "user@example.com",
    level: 15,
    totalPlaytime: 2847,
    gamesPlayed: 12,
    achievements: 45,
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const handleGameSelect = (game: Game) => {
    if (timeLeft === 0) {
      toast.error("No time left! Purchase a time pack to continue playing.")
      return
    }
    toast.success(`Launching ${game.title}...`)
  }

  const handleTimePackPurchase = (pack: typeof timePacks[0]) => {
    if (coins < pack.price) {
      toast.error("Not enough coins!")
      return
    }
    setCoins(prev => prev - pack.price)
    setTimeLeft(prev => prev + pack.duration)
    setActiveOrders(prev => prev + 1)
    toast.success(`Purchased ${pack.label}!`)
    
    setTimeout(() => {
      setActiveOrders(prev => prev - 1)
      toast.success("Order completed!")
    }, 5000)
  }

  const handleCoinPackPurchase = (pack: typeof coinPacks[0]) => {
    setCoins(prev => prev + pack.amount)
    setActiveOrders(prev => prev + 1)
    toast.success(`Purchased ${pack.label}!`)
    
    setTimeout(() => {
      setActiveOrders(prev => prev - 1)
      toast.success("Order completed!")
    }, 5000)
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  const games = gameData[platform]

  return (
    <div className="min-h-screen bg-background flex w-full">
      <GamingSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        platform={platform} 
        setPlatform={setPlatform}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
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
          activeOrders={activeOrders}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
            {activeTab === "games" && (
              <GamesTab 
                games={games}
                searchQuery={searchQuery}
                platform={platform}
                onGameSelect={handleGameSelect}
              />
            )}
            {activeTab === "timepacks" && (
              <TimePacksTab coins={coins} onPurchase={handleTimePackPurchase} />
            )}
            {activeTab === "coins" && (
              <CoinsTab coins={coins} onPurchase={handleCoinPackPurchase} />
            )}
            {activeTab === "arcade" && <ArcadeTab />}
            {activeTab === "apps" && <AppsTab />}
            {activeTab === "food" && <FoodTab user={user} />}
          </div>
        </main>
      </div>
    </div>
  )
}
