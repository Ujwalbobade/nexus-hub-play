import { Gamepad2 } from "lucide-react"
import { MobileNav } from "./MobileNav"
import { SearchBar } from "./SearchBar"
import { StatsDisplay } from "./StatsDisplay"
import { ProfileDropdown } from "./ProfileDropdown"
import { ActiveTab, Platform, User } from "./types"

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
  onLogout 
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
            <StatsDisplay timeLeft={timeLeft} coins={coins} />
            <ProfileDropdown user={user} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  )
}
