import { Clock, Coins } from "lucide-react"

interface StatsDisplayProps {
  timeLeft: number
  coins: number
}

export function StatsDisplay({ timeLeft, coins }: StatsDisplayProps) {
  return (
    <div className="hidden md:flex items-center gap-3">
      <div className="flex items-center bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg px-4 py-2 border border-accent/30 shadow-card">
        <Clock className="w-4 h-4 text-accent mr-2" />
        <div className="text-center">
          <div className={`text-lg font-bold ${timeLeft > 30 ? 'text-secondary' : timeLeft > 10 ? 'text-accent' : 'text-destructive'}`}>
            {Math.floor(timeLeft / 60)}h {timeLeft % 60}m
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
    </div>
  )
}
