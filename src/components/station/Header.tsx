import { Gamepad2, ShoppingBag, Utensils } from "lucide-react"
import { MobileNav } from "./MobileNav"
import { SearchBar } from "./SearchBar"
import { StatsDisplay } from "./StatsDisplay"
import { ProfileDropdown } from "./ProfileDropdown"
import { ActiveTab, Platform, User } from "./types"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
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
  activeOrders?: number
  activeFoodOrders?: number
  onConvertCoins?: () => void
}

export function Header({ 
  activeTab, 
  setActiveTab, 
  platform, 
  setPlatform, 
  searchQuery, 
  setSearchQuery, 
  timeLeft, 
  coins, 
  user, 
  onLogout,
  activeOrders = 0,
  activeFoodOrders = 0,
  onConvertCoins
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-card/95 via-primary/5 to-secondary/5 backdrop-blur-md border-b border-border shadow-lg">
      <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-glow">
                <Gamepad2 className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-base md:text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Nexus Gaming</h1>
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
            <div className="hidden md:block flex-1 max-w-md">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
          )}

          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            {activeFoodOrders > 0 && (
              <div className="relative">
                <div className="flex items-center bg-gradient-to-br from-orange-500/20 to-orange-400/10 rounded-lg px-3 py-2 border border-orange-500/30 shadow-card">
                  <Utensils className="w-4 h-4 text-orange-500 mr-2" />
                  <div className="hidden sm:block text-center">
                    <div className="text-sm font-bold text-orange-500">Food Orders</div>
                  </div>
                  <Badge className="ml-2 bg-orange-500 text-white">{activeFoodOrders}</Badge>
                </div>
              </div>
            )}
            {activeOrders > 0 && (
              <div className="relative">
                <div className="flex items-center bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg px-3 py-2 border border-accent/30 shadow-card">
                  <ShoppingBag className="w-4 h-4 text-accent mr-2" />
                  <div className="hidden sm:block text-center">
                    <div className="text-sm font-bold text-accent">Active Orders</div>
                  </div>
                  <Badge className="ml-2 bg-accent text-accent-foreground">{activeOrders}</Badge>
                </div>
              </div>
            )}
            <StatsDisplay timeLeft={timeLeft} coins={coins} onConvertCoins={onConvertCoins} />
            <ProfileDropdown user={user} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  )
}
