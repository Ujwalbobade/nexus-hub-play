import { Gamepad2, Monitor, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { navItems } from "./data"
import { ActiveTab, Platform } from "./types"

interface GamingSidebarProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  platform: Platform
  setPlatform: (platform: Platform) => void
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export function GamingSidebar({ 
  activeTab, 
  setActiveTab, 
  platform, 
  setPlatform,
  isCollapsed,
  setIsCollapsed
}: GamingSidebarProps) {
  return (
    <div className={`hidden lg:flex flex-col border-r border-border bg-gradient-to-b from-card to-background transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-glow">
              <Gamepad2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Gaming Hub</h2>
              <p className="text-xs text-muted-foreground">Premium Station</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-glow mx-auto">
            <Gamepad2 className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <div className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id 
                ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-accent" 
                : "hover:bg-muted/50 text-foreground"
            }`}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className="w-4 h-4" />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <div className={`text-xs text-muted-foreground mb-2 ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed && "Platform"}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setPlatform("pc")}
            variant={platform === "pc" ? "default" : "outline"}
            size="sm"
            className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'} transition-all ${
              platform === "pc" 
                ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-accent hover:shadow-glow" 
                : ""
            }`}
            title={isCollapsed ? "PC Gaming" : undefined}
          >
            <Monitor className="w-4 h-4 mr-2" />
            {!isCollapsed && "PC Gaming"}
          </Button>
          <Button
            onClick={() => setPlatform("ps5")}
            variant={platform === "ps5" ? "default" : "outline"}
            size="sm"
            className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'} transition-all ${
              platform === "ps5" 
                ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-accent hover:shadow-glow" 
                : ""
            }`}
            title={isCollapsed ? "PlayStation 5" : undefined}
          >
            <Zap className="w-4 h-4 mr-2" />
            {!isCollapsed && "PlayStation 5"}
          </Button>
        </div>
      </div>
    </div>
  )
}
