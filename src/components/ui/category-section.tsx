import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface CategorySectionProps {
  title: string
  icon: LucideIcon
  children: React.ReactNode
  className?: string
}

export function CategorySection({ title, icon: Icon, children, className }: CategorySectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-border/50">
        <div className="p-2 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30">
          <Icon className="w-5 h-5 text-neon-blue" />
        </div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-neon-blue/50 via-neon-purple/30 to-transparent" />
      </div>

      {/* Section Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {children}
      </div>
    </section>
  )
}