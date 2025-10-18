import { Coins, Clock, ArrowRightLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CoinsTabProps {
  coins: number
  onConvertCoins: () => void
}

export function CoinsTab({ coins, onConvertCoins }: CoinsTabProps) {
  const canConvert = coins >= 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Coins Balance</h2>
          <p className="text-muted-foreground">Earn coins through playtime and time pack purchases</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-primary/20 to-secondary/10 border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Your Coin Balance</CardTitle>
            <CardDescription>Use coins to add playtime</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-6">
              <Coins className="w-8 h-8 text-secondary" />
              <span className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {coins}
              </span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Earn 5 coins every 30 minutes of playtime</p>
              <p>• Get bonus coins with time pack purchases</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Convert Coins to Time</CardTitle>
            <CardDescription>Exchange your earned coins for playtime</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-secondary" />
                  <span className="text-xl font-bold">100 Coins</span>
                </div>
                <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="text-xl font-bold">30 Minutes</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={onConvertCoins}
                disabled={!canConvert}
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                {canConvert ? "Convert 100 Coins" : `Need ${100 - coins} more coins`}
              </Button>

              {canConvert && (
                <p className="text-sm text-muted-foreground text-center">
                  You have enough coins to convert!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">How to Earn Coins</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <p className="font-medium">Play Games</p>
              <p className="text-sm text-muted-foreground">Earn 5 coins for every 30 minutes of active playtime</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Coins className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <p className="font-medium">Purchase Time Packs</p>
              <p className="text-sm text-muted-foreground">Get bonus coins with every time pack purchase</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
