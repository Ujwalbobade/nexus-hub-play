import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AppsTab() {
  const apps = [
    { id: 1, name: "Google Chrome", description: "Fast and secure web browser", icon: "🌐", category: "Browser" },
    { id: 2, name: "Logitech Mouse", description: "Configure your Logitech devices", icon: "🖱️", category: "Utility" },
    { id: 3, name: "Discord", description: "Voice and chat for gamers", icon: "💬", category: "Communication" },
    { id: 4, name: "Spotify", description: "Music streaming service", icon: "🎵", category: "Entertainment" },
    { id: 5, name: "OBS Studio", description: "Streaming and recording", icon: "🎥", category: "Streaming" },
    { id: 6, name: "Visual Studio Code", description: "Code editor", icon: "💻", category: "Development" },
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Windows Apps</h1>
        <p className="text-sm md:text-base text-muted-foreground">Access your favorite applications</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <Card key={app.id} className="border-border hover:border-primary/50 transition-all cursor-pointer group hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="text-3xl md:text-4xl">{app.icon}</div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base md:text-lg truncate">{app.name}</CardTitle>
                  <Badge variant="outline" className="mt-1 text-xs">{app.category}</Badge>
                </div>
              </div>
              <CardDescription className="mt-2 text-sm">{app.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Launch App
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
