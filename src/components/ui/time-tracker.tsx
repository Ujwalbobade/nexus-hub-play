import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Timer,
  Calendar,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeSession {
  id: string
  gameName: string
  startTime: Date
  endTime?: Date
  duration: number
  date: string
}

interface TimeTrackerProps {
  selectedGame?: string
  onTimeUpdate?: (gameName: string, minutes: number) => void
}

export function TimeTracker({ selectedGame, onTimeUpdate }: TimeTrackerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [sessions, setSessions] = useState<TimeSession[]>([])
  const [currentGame, setCurrentGame] = useState(selectedGame || "")
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    if (!currentGame.trim()) return
    
    setIsRunning(true)
    setStartTime(new Date())
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleStop = () => {
    if (!startTime || !currentGame.trim()) return

    const endTime = new Date()
    const session: TimeSession = {
      id: Date.now().toString(),
      gameName: currentGame,
      startTime,
      endTime,
      duration: currentTime,
      date: endTime.toDateString()
    }

    setSessions(prev => [session, ...prev.slice(0, 9)]) // Keep last 10 sessions
    onTimeUpdate?.(currentGame, Math.floor(currentTime / 60))
    
    setIsRunning(false)
    setCurrentTime(0)
    setStartTime(null)
  }

  const handleReset = () => {
    setIsRunning(false)
    setCurrentTime(0)
    setStartTime(null)
  }

  const getTodaysSessions = () => {
    const today = new Date().toDateString()
    return sessions.filter(session => session.date === today)
  }

  const getTotalTimeToday = () => {
    const todaySessions = getTodaysSessions()
    return todaySessions.reduce((total, session) => total + session.duration, 0)
  }

  return (
    <div className="space-y-6">
      {/* Active Timer */}
      <Card className="bg-ps5-card border-ps5-secondary/30 p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Timer className="w-6 h-6 text-ps5-accent" />
            <h2 className="text-xl font-bold text-ps5-white">Game Time Tracker</h2>
          </div>

          {/* Game Selection */}
          <div className="space-y-2">
            <label className="text-sm text-ps5-white/70">Current Game</label>
            <Input
              value={currentGame}
              onChange={(e) => setCurrentGame(e.target.value)}
              placeholder="Enter game name..."
              className="bg-ps5-surface border-ps5-secondary/50 text-ps5-white"
              disabled={isRunning}
            />
          </div>

          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className={cn(
              "text-6xl font-mono font-bold transition-colors duration-300",
              isRunning ? "text-ps5-accent" : "text-ps5-white"
            )}>
              {formatTime(currentTime)}
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center gap-3">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  disabled={!currentGame.trim()}
                  className="bg-ps5-accent hover:bg-ps5-accent/90 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  variant="outline"
                  className="border-ps5-accent text-ps5-accent hover:bg-ps5-accent/10"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}

              <Button
                onClick={handleStop}
                disabled={!isRunning && currentTime === 0}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>

              <Button
                onClick={handleReset}
                disabled={isRunning}
                variant="ghost"
                className="text-ps5-white hover:bg-ps5-surface"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ps5-secondary/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-ps5-accent">
                {getTodaysSessions().length}
              </div>
              <div className="text-sm text-ps5-white/70">Sessions Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-ps5-accent">
                {formatTime(getTotalTimeToday())}
              </div>
              <div className="text-sm text-ps5-white/70">Total Time Today</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Sessions */}
      <Card className="bg-ps5-card border-ps5-secondary/30 p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-ps5-accent" />
            <h3 className="text-lg font-semibold text-ps5-white">Recent Sessions</h3>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-8 text-ps5-white/50">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No gaming sessions recorded yet</p>
              <p className="text-sm">Start tracking your game time!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-ps5-surface rounded-lg"
                >
                  <div>
                    <div className="font-medium text-ps5-white">
                      {session.gameName}
                    </div>
                    <div className="text-sm text-ps5-white/70">
                      {session.date} • {session.startTime.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {session.endTime && (
                        ` - ${session.endTime.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}`
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className="bg-ps5-accent/20 text-ps5-accent border-ps5-accent/50"
                  >
                    {formatTime(session.duration)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}