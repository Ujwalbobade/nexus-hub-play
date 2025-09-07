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
}

export function GameCarousel({ title, games, onGameSelect }: GameCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 4

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
        <h2 className="text-2xl font-bold text-ps5-white">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="text-ps5-white hover:bg-ps5-surface"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            disabled={currentIndex + itemsPerView >= games.length}
            className="text-ps5-white hover:bg-ps5-surface"
          >
            <ChevronRight className="w-5 h-5" />
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
                  "group cursor-pointer transition-all duration-200 hover:scale-105",
                  "bg-ps5-card border-ps5-secondary/30 hover:border-ps5-accent/50",
                  "overflow-hidden h-72",
                  "hover:shadow-[0_8px_30px_hsl(0_112%_60%_/_0.3)]"
                )}
                onClick={() => onGameSelect?.(game)}
              >
                {/* Game Image/Cover */}
                <div className="relative h-48 bg-gradient-to-br from-ps5-surface to-ps5-secondary overflow-hidden">
                  {game.image ? (
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-12 h-12 text-ps5-accent opacity-50" />
                    </div>
                  )}
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Button size="sm" className="bg-ps5-accent hover:bg-ps5-accent/90 text-white">
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  {game.progress && game.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                      <div 
                        className="h-full bg-ps5-accent transition-all duration-300"
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
                <div className="p-4 space-y-2">
                  <h3 className="font-medium text-ps5-white line-clamp-1 group-hover:text-ps5-accent transition-colors">
                    {game.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-ps5-white/70">
                    <span className="bg-ps5-surface px-2 py-1 rounded text-xs">
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
                    <div className="text-xs text-ps5-white/50">
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