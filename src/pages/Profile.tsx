import { ArrowLeft, Calendar, Clock, Trophy, Gamepad2, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contextProvider/AuthContext"
import { Progress } from "@/components/ui/progress"

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const userProfile = {
    name: user?.fullName || user?.username || "Player",
    email: user?.email || "player@gaming.com",
    level: 42,
    totalPlaytime: 1248,
    gamesPlayed: 127,
    achievements: 89,
    joinDate: "Jan 2024",
    nextLevel: 45,
    currentXP: 7850,
    nextLevelXP: 10000,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container max-w-5xl py-8 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        <div className="space-y-6">
          <Card className="border-primary/20 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-32 h-32 border-4 border-primary shadow-glow">
                  <AvatarImage src="/placeholder.svg" alt={userProfile.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-4xl font-bold">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left space-y-3">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {userProfile.name}
                    </h1>
                    <p className="text-muted-foreground">{userProfile.email}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      Level {userProfile.level}
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {userProfile.joinDate}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Level Progress</span>
                      <span className="font-semibold">{userProfile.currentXP} / {userProfile.nextLevelXP} XP</span>
                    </div>
                    <Progress value={(userProfile.currentXP / userProfile.nextLevelXP) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {userProfile.nextLevelXP - userProfile.currentXP} XP until Level {userProfile.nextLevel}
                    </p>
                  </div>
                </div>

                <Button onClick={() => navigate("/settings")} variant="outline">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Playtime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {Math.floor(userProfile.totalPlaytime / 60)}h
                    </div>
                    <p className="text-xs text-muted-foreground">{userProfile.totalPlaytime % 60}m</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Games Played</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                  <div className="text-2xl font-bold text-primary">
                    {userProfile.gamesPlayed}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-secondary" />
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {userProfile.achievements}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  <div className="text-2xl font-bold text-foreground">
                    {userProfile.level}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { game: "Cyber Racer 2077", time: "2 hours ago", xp: 150 },
                  { game: "Fantasy Quest", time: "Yesterday", xp: 200 },
                  { game: "Space Warriors", time: "2 days ago", xp: 180 },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <Gamepad2 className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">{activity.game}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">+{activity.xp} XP</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
