import { User as UserIcon, Settings, Trophy, LogOut, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { User } from "./types"

interface ProfileDropdownProps {
  user: User
  onLogout: () => void
}

export function ProfileDropdown({ user, onLogout }: ProfileDropdownProps) {
  const navigate = useNavigate()
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 h-auto hover:bg-muted rounded-xl">
          <Avatar className="w-10 h-10 border-2 border-primary shadow-glow">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden md:block">
            <div className="text-sm font-semibold text-foreground">{user.name}</div>
            <div className="text-xs bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Level {user.level}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-bold text-foreground text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="text-xs font-medium mt-2">
                Level {user.level}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-b border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {Math.floor(user.totalPlaytime / 60)}h
              </div>
              <div className="text-xs text-muted-foreground">Play Time</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{user.gamesPlayed}</div>
              <div className="text-xs text-muted-foreground">Games</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{user.achievements}</div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </div>
          </div>
        </div>
        
        <div className="p-2">
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
            <UserIcon className="w-4 h-4 mr-3" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/achievements")}>
            <Trophy className="w-4 h-4 mr-3" />
            Achievements
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={onLogout}
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
