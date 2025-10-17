import { ArrowLeft, Trophy, Lock, Star, Target, Zap, Award } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Achievements() {
  const navigate = useNavigate()

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Play your first game",
      icon: Zap,
      unlocked: true,
      progress: 100,
      maxProgress: 100,
      xp: 50,
      rarity: "common",
      unlockedDate: "2 days ago"
    },
    {
      id: 2,
      title: "Game Collector",
      description: "Play 50 different games",
      icon: Target,
      unlocked: true,
      progress: 50,
      maxProgress: 50,
      xp: 200,
      rarity: "rare",
      unlockedDate: "Yesterday"
    },
    {
      id: 3,
      title: "Time Master",
      description: "Accumulate 100 hours of playtime",
      icon: Trophy,
      unlocked: false,
      progress: 67,
      maxProgress: 100,
      xp: 500,
      rarity: "epic"
    },
    {
      id: 4,
      title: "Champion",
      description: "Reach level 50",
      icon: Award,
      unlocked: false,
      progress: 84,
      maxProgress: 100,
      xp: 1000,
      rarity: "legendary"
    },
    {
      id: 5,
      title: "Speed Demon",
      description: "Complete 10 games in one day",
      icon: Zap,
      unlocked: false,
      progress: 30,
      maxProgress: 100,
      xp: 150,
      rarity: "rare"
    },
    {
      id: 6,
      title: "Social Butterfly",
      description: "Add 20 friends",
      icon: Star,
      unlocked: false,
      progress: 0,
      maxProgress: 100,
      xp: 100,
      rarity: "common"
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-muted-foreground"
      case "rare": return "text-primary"
      case "epic": return "text-secondary"
      case "legendary": return "text-accent"
      default: return "text-muted-foreground"
    }
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const lockedAchievements = achievements.filter(a => !a.unlocked)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container max-w-6xl py-8 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Achievements
              </h1>
              <p className="text-muted-foreground mt-2">
                Track your gaming milestones
              </p>
            </div>
            <Card className="px-6 py-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Progress</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {unlockedAchievements.length}/{achievements.length}
                </p>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
              <TabsTrigger value="locked">Locked</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={achievement.unlocked ? "border-primary/30" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${achievement.unlocked ? 'bg-gradient-to-br from-primary/20 to-secondary/20' : 'bg-muted'}`}>
                          {achievement.unlocked ? (
                            <achievement.icon className={`w-8 h-8 ${getRarityColor(achievement.rarity)}`} />
                          ) : (
                            <Lock className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className={achievement.unlocked ? "" : "text-muted-foreground"}>
                              {achievement.title}
                            </CardTitle>
                            <Badge variant={achievement.unlocked ? "default" : "outline"} className="capitalize">
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <CardDescription>{achievement.description}</CardDescription>
                          {achievement.unlocked && achievement.unlockedDate && (
                            <p className="text-xs text-muted-foreground">Unlocked {achievement.unlockedDate}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary">+{achievement.xp} XP</Badge>
                    </div>
                  </CardHeader>
                  {!achievement.unlocked && (
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="unlocked" className="space-y-4 mt-6">
              {unlockedAchievements.map((achievement) => (
                <Card key={achievement.id} className="border-primary/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                          <achievement.icon className={`w-8 h-8 ${getRarityColor(achievement.rarity)}`} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle>{achievement.title}</CardTitle>
                            <Badge variant="default" className="capitalize">{achievement.rarity}</Badge>
                          </div>
                          <CardDescription>{achievement.description}</CardDescription>
                          <p className="text-xs text-muted-foreground">Unlocked {achievement.unlockedDate}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">+{achievement.xp} XP</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="locked" className="space-y-4 mt-6">
              {lockedAchievements.map((achievement) => (
                <Card key={achievement.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-muted">
                          <Lock className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-muted-foreground">{achievement.title}</CardTitle>
                            <Badge variant="outline" className="capitalize">{achievement.rarity}</Badge>
                          </div>
                          <CardDescription>{achievement.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">+{achievement.xp} XP</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
