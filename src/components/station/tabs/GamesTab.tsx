import { Search } from "lucide-react"
import { GameCarousel } from "../GameCarousel"
import { Game, Platform } from "../types"

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
