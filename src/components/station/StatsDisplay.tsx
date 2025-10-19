import { Clock, Coins, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface StatsDisplayProps {
  timeLeft: number
  coins: number
  onConvertCoins?: () => void
}

export function StatsDisplay({ timeLeft, coins, onConvertCoins }: StatsDisplayProps) {
  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60
  
  // Determine color based on time left (in seconds)
  const getTimeColor = () => {
    if (timeLeft > 1800) return 'text-secondary' // > 30 minutes
    if (timeLeft > 600) return 'text-accent' // > 10 minutes
    return 'text-destructive' // <= 10 minutes
  }
  
  return (
    <div className="hidden md:flex items-center gap-3">
      <div className="flex items-center bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg px-4 py-2 border border-accent/30 shadow-card">
        <Clock className="w-4 h-4 text-accent mr-2" />
        <div className="text-center">
          <div className={`text-lg font-bold font-mono ${getTimeColor()}`}>
            {hours > 0 && `${hours}:`}{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-xs text-muted-foreground">Time Left</div>
        </div>
      </div>
      <div className="flex items-center bg-gradient-to-br from-primary/20 to-secondary/10 rounded-lg px-4 py-2 border border-primary/30 shadow-card">
        <Coins className="w-4 h-4 text-secondary mr-2" />
        <div className="text-center">
          <div className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{coins}</div>
          <div className="text-xs text-muted-foreground">Coins</div>
        </div>
      </div>
      {onConvertCoins && coins >= 100 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onConvertCoins}
                className="h-auto px-3 py-2 border-primary/50 hover:bg-primary/10"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Convert 100 coins to 30 minutes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
