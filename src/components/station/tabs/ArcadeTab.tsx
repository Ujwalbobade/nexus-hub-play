import { Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ArcadeTab() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Arcade</h1>
        <p className="text-sm md:text-base text-muted-foreground">Compete in tournaments and win prizes</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Trophy className="w-7 h-7 md:w-8 md:h-8 text-accent" />
              <Badge variant="secondary" className="text-xs">Live</Badge>
            </div>
            <CardTitle className="text-base md:text-lg">Weekly Championship</CardTitle>
            <CardDescription className="text-sm">Compete for the top spot this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Prize Pool</span>
                <span className="font-semibold text-foreground">5,000 Coins</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Participants</span>
                <span className="font-semibold text-foreground">247</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Ends In</span>
                <span className="font-semibold text-destructive">2d 5h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
