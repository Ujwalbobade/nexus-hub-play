import { useState, useEffect, useRef } from "react"
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
import { StationWebSocket } from "@/services/StationWebSocket"

export default function UnifiedGamingStation({ onLogout }: { onLogout?: () => void }) {
  const { user: authUser } = useAuth()
  const [platform, setPlatform] = useState<Platform>("pc")
  const [searchQuery, setSearchQuery] = useState("")
  const [timeLeft, setTimeLeft] = useState(120)
  const [activeTab, setActiveTab] = useState<ActiveTab>("games")
  const [coins, setCoins] = useState(150)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeOrders, setActiveOrders] = useState(0)
  const [activeFoodOrders, setActiveFoodOrders] = useState(0)
  const wsRef = useRef<StationWebSocket | null>(null)
  
  const user: User = {
    name: authUser?.username || authUser?.email?.split('@')[0] || "Gamer",
    email: authUser?.email || "user@example.com",
    level: 15,
    totalPlaytime: 2847,
    gamesPlayed: 12,
    achievements: 45,
  }

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new StationWebSocket()
    wsRef.current = ws
    ws.connect()

    // Handle admin commands
    ws.on("TIME_APPROVED", (data: any) => {
      setTimeLeft(prev => prev + data.minutes)
      setCoins(prev => prev + (data.bonusCoins || 0))
      setActiveOrders(prev => prev - 1)
      toast.success(`Admin approved! +${data.minutes} minutes added`)
    })

    ws.on("ADD_TIME", (data: any) => {
      setTimeLeft(prev => prev + data.minutes)
      toast.success(`Admin added ${data.minutes} minutes to your session`)
    })

    ws.on("LOGOUT_USER", () => {
      toast.error("Admin has logged you out")
      setTimeout(() => handleLogout(), 2000)
    })

    ws.on("SHUTDOWN_STATION", () => {
      toast.error("Admin is shutting down the station")
      setTimeout(() => window.location.reload(), 3000)
    })

    ws.on("RESTART_STATION", () => {
      toast.error("Admin is restarting the station")
      setTimeout(() => window.location.reload(), 3000)
    })

    return () => {
      ws.disconnect()
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = Math.max(0, prev - 1)
        // Award coins for every 30 minutes played
        if (prev > 0 && prev % 30 === 0) {
          setCoins(c => c + 5)
          toast.success("🎁 Earned 5 coins for playtime!")
        }
        return newTime
      })
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

  const handleTimePackPurchase = (pack: typeof timePacks[0], transactionId?: string) => {
    setActiveOrders(prev => prev + 1)
    toast.info(`Payment received. Waiting for admin approval...`)
    
    // Notify admin via WebSocket
    if (wsRef.current && transactionId) {
      wsRef.current.sendPaymentNotification(
        transactionId,
        typeof pack.price === 'string' ? parseFloat(pack.price.replace('$', '')) : pack.price,
        pack.label
      )
    }
  }


  const handleConvertCoins = () => {
    if (coins >= 100) {
      setCoins(prev => prev - 100)
      setTimeLeft(prev => prev + 30)
      toast.success("Converted 100 coins to 30 minutes!")
    } else {
      toast.error("Not enough coins! Need 100 coins.")
    }
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
          activeFoodOrders={activeFoodOrders}
          onConvertCoins={handleConvertCoins}
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
              <TimePacksTab onPurchase={handleTimePackPurchase} />
            )}
            {activeTab === "coins" && (
              <CoinsTab coins={coins} onConvertCoins={handleConvertCoins} />
            )}
            {activeTab === "arcade" && <ArcadeTab />}
            {activeTab === "apps" && <AppsTab />}
          {activeTab === "food" && (
            <FoodTab 
              user={user} 
              onFoodOrderPlaced={() => {
                setActiveFoodOrders(prev => prev + 1)
                setTimeout(() => {
                  setActiveFoodOrders(prev => Math.max(0, prev - 1))
                }, 300000) // 5 minutes
              }}
            />
          )}
          </div>
        </main>
      </div>
    </div>
  )
}
