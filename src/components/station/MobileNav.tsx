import { Menu, Monitor, Zap } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { navItems } from "./data"
import { ActiveTab, Platform } from "./types"

interface MobileNavProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  platform: Platform
  setPlatform: (platform: Platform) => void
}

export function MobileNav({ activeTab, setActiveTab, platform, setPlatform }: MobileNavProps) {
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
