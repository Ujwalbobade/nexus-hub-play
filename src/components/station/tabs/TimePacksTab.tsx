import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { timePacks } from "../data"

interface TimePacksTabProps {
  coins: number
  onPurchase: (pack: typeof timePacks[0]) => void
}

export function TimePacksTab({ coins, onPurchase }: TimePacksTabProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-2 md:gap-3">
        <Clock className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Time Packs</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {timePacks.map((pack) => (
          <Card key={pack.id} className="hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                {pack.label}
              </CardTitle>
              <CardDescription className="text-sm">{pack.price} Coins</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => onPurchase(pack)}
                className="w-full"
                size="sm"
                disabled={coins < pack.price}
              >
                {coins >= pack.price ? 'Purchase' : 'Not Enough Coins'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
