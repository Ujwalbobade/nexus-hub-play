import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { useState } from "react"

interface GameCardProps {
  title: string
  icon?: LucideIcon
  image?: string
  category?: string
  isInstalled?: boolean
  onClick?: () => void
  className?: string
}

export function GameCard({ 
  title, 
  icon: Icon, 
  image, 
  category, 
  isInstalled = true, 
  onClick,
  className 
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className={cn(
        "relative group cursor-pointer transition-all duration-300 hover:scale-105",
        "bg-gradient-to-br from-gaming-card to-gaming-surface",
        "border-border/50 hover:border-neon-blue/50",
        "overflow-hidden",
        "hover:shadow-[0_0_30px_hsl(193_100%_50%_/_0.3)]",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-transparent to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative p-6 h-32 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-gaming-surface border border-border/50">
                <Icon className={cn(
                  "w-6 h-6 transition-colors duration-300",
                  isHovered ? "text-neon-blue" : "text-muted-foreground"
                )} />
              </div>
            )}
            {image && (
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/50">
                <img src={image} alt={title} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          
          {category && (
            <span className="text-xs px-2 py-1 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
              {category}
            </span>
          )}
        </div>

        {/* Title and Status */}
        <div>
          <h3 className={cn(
            "font-medium transition-colors duration-300 line-clamp-2",
            isHovered ? "text-neon-blue" : "text-foreground"
          )}>
            {title}
          </h3>
          
          <div className="flex items-center gap-2 mt-1">
            <div className={cn(
              "w-2 h-2 rounded-full transition-colors duration-300",
              isInstalled ? "bg-neon-cyan animate-pulse-neon" : "bg-muted"
            )} />
            <span className="text-xs text-muted-foreground">
              {isInstalled ? "Installed" : "Not Installed"}
            </span>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300",
        "shadow-[0_0_20px_hsl(193_100%_50%_/_0.2)]",
        isHovered ? "opacity-100" : "opacity-0"
      )} />
    </Card>
  )
}