import { Search, Gamepad2, TrendingUp, Clock } from "lucide-react"
import { GameCarousel } from "../GameCarousel"
import { Game, Platform } from "../types"
import { Card } from "@/components/ui/card"

interface GamesTabProps {
  games: Game[]
  searchQuery: string
  platform: Platform
  onGameSelect: (game: Game) => void
}

export function GamesTab({ games, searchQuery, platform, onGameSelect }: GamesTabProps) {
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
  const totalPlaytime = games.reduce((acc, game) => acc + game.playtime, 0)
  const installedGames = games.filter(g => g.isInstalled).length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Gamepad2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Games</p>
              <p className="text-2xl font-bold text-foreground">{games.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Clock className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Playtime</p>
              <p className="text-2xl font-bold text-foreground">{totalPlaytime}h</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Installed</p>
              <p className="text-2xl font-bold text-foreground">{installedGames}</p>
            </div>
          </div>
        </Card>
      </div>

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
    </div>
  )
}
