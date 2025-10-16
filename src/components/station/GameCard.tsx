import { Gamepad2, Clock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Game, Platform } from "./types"

interface GameCardProps {
  game: Game
  onSelect: (game: Game) => void
  platform: Platform
}

export function GameCard({ game, onSelect }: GameCardProps) {
  return (
    <div 
      onClick={() => onSelect(game)}
      className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg flex-shrink-0 w-64"
    >
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <Gamepad2 className="w-16 h-16 text-primary/40" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 truncate">{game.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{game.category}</p>
        {game.playtime > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{game.playtime}h played</span>
          </div>
        )}
        {game.lastPlayed && (
          <p className="text-xs text-muted-foreground mt-1">Last: {game.lastPlayed}</p>
        )}
        {game.progress && game.progress > 0 && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{game.progress}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${game.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button size="lg" className="gap-2">
          <Play className="w-5 h-5" />
          Launch
        </Button>
      </div>
    </div>
  )
}
