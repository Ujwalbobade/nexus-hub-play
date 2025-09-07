import { useState } from "react"
import { Input } from "@/components/ui/input"
import { GameCard } from "@/components/ui/game-card"
import { CategorySection } from "@/components/ui/category-section"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Gamepad2, 
  Settings, 
  Globe, 
  Rocket, 
  Monitor,
  Cpu,
  HardDrive,
  Terminal,
  Chrome,
  Compass
} from "lucide-react"

const games = [
  { id: 1, title: "Valorant", category: "FPS", isInstalled: true },
  { id: 2, title: "League of Legends", category: "MOBA", isInstalled: true },
  { id: 3, title: "Cyberpunk 2077", category: "RPG", isInstalled: false },
  { id: 4, title: "Counter-Strike 2", category: "FPS", isInstalled: true },
  { id: 5, title: "Apex Legends", category: "Battle Royale", isInstalled: true },
  { id: 6, title: "Minecraft", category: "Sandbox", isInstalled: true },
  { id: 7, title: "GTA V", category: "Action", isInstalled: false },
  { id: 8, title: "Fortnite", category: "Battle Royale", isInstalled: true },
]

const tools = [
  { id: 1, title: "Task Manager", icon: Monitor, category: "System", isInstalled: true },
  { id: 2, title: "Discord", icon: Cpu, category: "Communication", isInstalled: true },
  { id: 3, title: "OBS Studio", icon: HardDrive, category: "Recording", isInstalled: true },
  { id: 4, title: "Command Prompt", icon: Terminal, category: "System", isInstalled: true },
]

const browsers = [
  { id: 1, title: "Google Chrome", icon: Chrome, category: "Browser", isInstalled: true },
  { id: 2, title: "Mozilla Firefox", icon: Compass, category: "Browser", isInstalled: true },
]

const launchers = [
  { id: 1, title: "Steam", category: "Gaming", isInstalled: true },
  { id: 2, title: "Epic Games", category: "Gaming", isInstalled: true },
  { id: 3, title: "Battle.net", category: "Gaming", isInstalled: false },
  { id: 4, title: "Origin", category: "Gaming", isInstalled: false },
]

export function GameStation() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All", icon: Monitor },
    { id: "games", name: "Games", icon: Gamepad2 },
    { id: "tools", name: "Tools", icon: Settings },
    { id: "browsers", name: "Browsers", icon: Globe },
    { id: "launchers", name: "Launchers", icon: Rocket },
  ]

  const handleLaunchApp = (appName: string) => {
    // Simulate app launch
    console.log(`Launching ${appName}`)
    // In a real implementation, this would interface with the system to launch apps
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Gaming Station
              </h1>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search games, tools, or apps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gaming-surface border-border/50 focus:border-neon-blue/50"
                />
              </div>
            </div>

            {/* System Status */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse-neon" />
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "secondary"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white"
                    : ""
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Button>
            )
          })}
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Games Section */}
          {(activeCategory === "all" || activeCategory === "games") && (
            <CategorySection title="Games" icon={Gamepad2}>
              {games
                .filter(game => 
                  searchTerm === "" || 
                  game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  game.category.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((game) => (
                  <GameCard
                    key={game.id}
                    title={game.title}
                    category={game.category}
                    isInstalled={game.isInstalled}
                    onClick={() => handleLaunchApp(game.title)}
                  />
                ))}
            </CategorySection>
          )}

          {/* Tools Section */}
          {(activeCategory === "all" || activeCategory === "tools") && (
            <CategorySection title="Tools" icon={Settings}>
              {tools
                .filter(tool => 
                  searchTerm === "" || 
                  tool.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((tool) => (
                  <GameCard
                    key={tool.id}
                    title={tool.title}
                    icon={tool.icon}
                    category={tool.category}
                    isInstalled={tool.isInstalled}
                    onClick={() => handleLaunchApp(tool.title)}
                  />
                ))}
            </CategorySection>
          )}

          {/* Browsers Section */}
          {(activeCategory === "all" || activeCategory === "browsers") && (
            <CategorySection title="Browsers" icon={Globe}>
              {browsers
                .filter(browser => 
                  searchTerm === "" || 
                  browser.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((browser) => (
                  <GameCard
                    key={browser.id}
                    title={browser.title}
                    icon={browser.icon}
                    category={browser.category}
                    isInstalled={browser.isInstalled}
                    onClick={() => handleLaunchApp(browser.title)}
                  />
                ))}
            </CategorySection>
          )}

          {/* Launchers Section */}
          {(activeCategory === "all" || activeCategory === "launchers") && (
            <CategorySection title="Launchers" icon={Rocket}>
              {launchers
                .filter(launcher => 
                  searchTerm === "" || 
                  launcher.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((launcher) => (
                  <GameCard
                    key={launcher.id}
                    title={launcher.title}
                    category={launcher.category}
                    isInstalled={launcher.isInstalled}
                    onClick={() => handleLaunchApp(launcher.title)}
                  />
                ))}
            </CategorySection>
          )}
        </div>

        {/* Empty State */}
        {searchTerm && (
          games.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 &&
          tools.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 &&
          browsers.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 &&
          launchers.filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0
        ) && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gaming-surface flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try searching with different keywords or browse all categories
            </p>
          </div>
        )}
      </div>
    </div>
  )
}