import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Clock, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface Game {
  id: number
  title: string
  image?: string
  category: string
  playtime: number
  lastPlayed?: string
  isInstalled: boolean
  progress?: number
}

interface GameCarouselProps {
  title: string
  games: Game[]
  onGameSelect?: (game: Game) => void
  platform?: "pc" | "ps5"
}

export function GameCarousel({ title, games, onGameSelect, platform = "pc" }: GameCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = platform === "ps5" ? 3 : 4 // Fewer items for PS5 mode for better controller navigation

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= games.length ? 0 : prev + itemsPerView
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - itemsPerView < 0 
        ? Math.max(0, games.length - itemsPerView) 
        : prev - itemsPerView
    )
  }

  const formatPlaytime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className={`font-bold text-foreground ${platform === "ps5" ? "text-3xl" : "text-2xl"}`}>{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size={platform === "ps5" ? "lg" : "icon"}
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`text-foreground hover:bg-muted focus:outline-none focus:ring-4 focus:ring-primary/30 ${
              platform === "ps5" ? "px-6 py-3" : ""
            }`}
          >
            <ChevronLeft className={platform === "ps5" ? "w-6 h-6" : "w-5 h-5"} />
            {platform === "ps5" && <span className="ml-2">Previous</span>}
          </Button>
          <Button
            variant="ghost"
            size={platform === "ps5" ? "lg" : "icon"}
            onClick={nextSlide}
            disabled={currentIndex + itemsPerView >= games.length}
            className={`text-foreground hover:bg-muted focus:outline-none focus:ring-4 focus:ring-primary/30 ${
              platform === "ps5" ? "px-6 py-3" : ""
            }`}
          >
            <ChevronRight className={platform === "ps5" ? "w-6 h-6" : "w-5 h-5"} />
            {platform === "ps5" && <span className="ml-2">Next</span>}
          </Button>
        </div>
      </div>

      {/* Games Grid */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-out gap-4"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
          }}
        >
          {games.map((game) => (
            <div
              key={game.id}
              className="flex-shrink-0"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <Card
                className={cn(
                  "group cursor-pointer transition-all duration-200",
                  platform === "ps5" 
                    ? "hover:scale-110 focus-within:scale-110 focus-within:ring-4 focus-within:ring-primary/30 h-80" // Larger cards for PS5
                    : "hover:scale-105 h-72",
                  "bg-card border-border hover:border-primary/50",
                  "overflow-hidden",
                  "hover:shadow-[0_8px_30px_hsl(var(--primary)_/_0.3)]",
                  "focus:outline-none focus:ring-4 focus:ring-primary/30"
                )}
                onClick={() => onGameSelect?.(game)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onGameSelect?.(game)
                  }
                }}
              >
                {/* Game Image/Cover */}
                <div className={`relative bg-gradient-to-br from-muted to-muted-foreground/20 overflow-hidden ${
                  platform === "ps5" ? "h-56" : "h-48"
                }`}>
                  {game.image ? (
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className={`text-primary opacity-50 ${platform === "ps5" ? "w-16 h-16" : "w-12 h-12"}`} />
                    </div>
                  )}
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Button 
                      size={platform === "ps5" ? "lg" : "sm"} 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-4 focus:ring-primary/30"
                    >
                      <Play className={platform === "ps5" ? "w-6 h-6 mr-3" : "w-4 h-4 mr-2"} />
                      {platform === "ps5" ? "Launch Game" : "Play"}
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  {game.progress && game.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${game.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Installation Status */}
                  <div className="absolute top-2 right-2">
                    <div className={cn(
                      "w-3 h-3 rounded-full border-2 border-white",
                      game.isInstalled ? "bg-green-500" : "bg-red-500"
                    )} />
                  </div>
                </div>

                {/* Game Info */}
                <div className={`space-y-2 ${platform === "ps5" ? "p-6" : "p-4"}`}>
                  <h3 className={`font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors ${
                    platform === "ps5" ? "text-lg" : "text-base"
                  }`}>
                    {game.title}
                  </h3>
                  
                  <div className={`flex items-center justify-between text-muted-foreground ${
                    platform === "ps5" ? "text-base" : "text-sm"
                  }`}>
                    <span className="bg-muted px-2 py-1 rounded text-xs">
                      {game.category}
                    </span>
                    
                    {game.playtime > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatPlaytime(game.playtime)}</span>
                      </div>
                    )}
                  </div>

                  {game.lastPlayed && (
                    <div className={`text-muted-foreground/70 ${platform === "ps5" ? "text-sm" : "text-xs"}`}>
                      Last played: {game.lastPlayed}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}