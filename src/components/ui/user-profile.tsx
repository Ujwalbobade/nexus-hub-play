import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Clock, 
  Trophy, 
  Settings, 
  LogOut,
  Calendar,
  Gamepad2,
  Star
} from "lucide-react"

interface UserProfileProps {
  user: {
    name: string
    email: string
    avatar?: string
    level: number
    totalPlaytime: number
    gamesPlayed: number
    achievements: number
    joinDate: string
  }
  onLogout: () => void
  onSettings: () => void
}

export function UserProfile({ user, onLogout, onSettings }: UserProfileProps) {
  const formatPlaytime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    
    if (days > 0) {
      return `${days}d ${remainingHours}h`
    }
    return `${hours}h ${minutes % 60}m`
  }

  return (
    <Card className="bg-ps5-card border-ps5-secondary/30 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-ps5-accent">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-ps5-accent text-white text-xl">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-2xl font-bold text-ps5-white">{user.name}</h2>
            <p className="text-ps5-white/70">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="outline" 
                className="bg-ps5-accent/20 text-ps5-accent border-ps5-accent/50"
              >
                Level {user.level}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettings}
            className="text-ps5-white hover:bg-ps5-surface"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="text-ps5-white hover:bg-red-500/20 hover:text-red-400"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-ps5-surface rounded-lg p-4 text-center">
          <Clock className="w-6 h-6 text-ps5-accent mx-auto mb-2" />
          <div className="text-lg font-bold text-ps5-white">
            {formatPlaytime(user.totalPlaytime)}
          </div>
          <div className="text-sm text-ps5-white/70">Total Playtime</div>
        </div>

        <div className="bg-ps5-surface rounded-lg p-4 text-center">
          <Gamepad2 className="w-6 h-6 text-ps5-accent mx-auto mb-2" />
          <div className="text-lg font-bold text-ps5-white">{user.gamesPlayed}</div>
          <div className="text-sm text-ps5-white/70">Games Played</div>
        </div>

        <div className="bg-ps5-surface rounded-lg p-4 text-center">
          <Trophy className="w-6 h-6 text-ps5-accent mx-auto mb-2" />
          <div className="text-lg font-bold text-ps5-white">{user.achievements}</div>
          <div className="text-sm text-ps5-white/70">Achievements</div>
        </div>

        <div className="bg-ps5-surface rounded-lg p-4 text-center">
          <Calendar className="w-6 h-6 text-ps5-accent mx-auto mb-2" />
          <div className="text-lg font-bold text-ps5-white">
            {Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="text-sm text-ps5-white/70">Days Active</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-ps5-white flex items-center gap-2">
          <Star className="w-5 h-5 text-ps5-accent" />
          Recent Achievements
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-ps5-surface rounded-lg">
            <div className="w-8 h-8 bg-ps5-accent rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-ps5-white">First Victory</div>
              <div className="text-xs text-ps5-white/70">Won your first match in Valorant</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-ps5-surface rounded-lg">
            <div className="w-8 h-8 bg-ps5-accent rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-ps5-white">Time Warrior</div>
              <div className="text-xs text-ps5-white/70">Played for 10 hours total</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}