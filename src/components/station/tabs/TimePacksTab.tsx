import { useState } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { timePacks } from "../data"
import { PaymentDialog } from "../PaymentDialog"

interface TimePacksTabProps {
  onPurchase: (pack: typeof timePacks[0]) => void
}

export function TimePacksTab({ onPurchase }: TimePacksTabProps) {
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [selectedPack, setSelectedPack] = useState<typeof timePacks[0] | null>(null)

  const handlePurchaseClick = (pack: typeof timePacks[0]) => {
    setSelectedPack(pack)
    setPaymentOpen(true)
  }

  const handlePaymentSuccess = () => {
    if (selectedPack) {
      onPurchase(selectedPack)
    }
  }
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
              <CardDescription className="text-sm">
                {pack.price} • Get {pack.bonusCoins} bonus coins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handlePurchaseClick(pack)}
                className="w-full"
                size="sm"
              >
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPack && (
        <PaymentDialog
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          amount={selectedPack.price}
          itemName={`${selectedPack.label} + ${selectedPack.bonusCoins} Bonus Coins`}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
