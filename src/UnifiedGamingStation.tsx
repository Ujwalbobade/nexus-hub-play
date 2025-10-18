// UnifiedGamingStation.tsx
import { useState, useEffect } from "react"
import { useAuth } from "@/contextProvider/AuthContext"
import { Sidebar } from "@/components/sideBar/sidebar"
import { Header } from "./components/Header"
import { GamesTab } from "./components/tabs/GamesTab"
import { TimePacksTab } from "./components/tabs/TimePacksTab"
import { CoinsTab } from "./components/tabs/CoinsTab"
import { ArcadeTab } from "./components/tabs/ArcadeTab"
import { AppsTab } from "./components/tabs/AppsTab"
import { FoodTab } from "./components/tabs/FoodTab"
import { gameData, timePacks, coinPacks } from "./constants"
import { Platform, ActiveTab, User, Game } from "./types"

interface UnifiedGamingStationProps {
  onLogout?: () => void
}

export default function UnifiedGamingStation({ onLogout }: UnifiedGamingStationProps) {
  const { user: authUser } = useAuth()
  const [platform, setPlatform] = useState<Platform>("pc")
  const [searchQuery, setSearchQuery] = useState("")
  const [timeLeft, setTimeLeft] = useState(120)
  const [activeTab, setActiveTab] = useState<ActiveTab>("games")
  const [coins, setCoins] = useState(150)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
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
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        platform={platform} 
        setPlatform={setPlatform}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
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
        />

        <main className="flex-1 overflow-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-6 md:space-y-8">
          {activeTab === "games" && (
            <GamesTab 
              games={gameData[platform]} 
              searchQuery={searchQuery} 
              platform={platform} 
              onGameSelect={handleGameSelect} 
            />
          )}

          {activeTab === "timepacks" && (
            <TimePacksTab 
              coins={coins} 
              onPurchase={handlePurchaseTimePack} 
            />
          )}

          {activeTab === "coins" && (
            <CoinsTab 
              coins={coins} 
              onPurchase={handlePurchaseCoinPack} 
            />
          )}

          {activeTab === "arcade" && <ArcadeTab />}

          {activeTab === "apps" && <AppsTab />}

          {activeTab === "food" && <FoodTab user={user} />}
        </main>
      </div>
    </div>
  )
}
