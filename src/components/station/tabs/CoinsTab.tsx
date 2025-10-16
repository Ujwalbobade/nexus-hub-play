import { useState } from "react"
import { Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { coinPacks } from "../data"
import { PaymentDialog } from "../PaymentDialog"

interface CoinsTabProps {
  coins: number
  onPurchase: (pack: typeof coinPacks[0]) => void
}

export function CoinsTab({ coins, onPurchase }: CoinsTabProps) {
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [selectedPack, setSelectedPack] = useState<typeof coinPacks[0] | null>(null)

  const handlePurchaseClick = (pack: typeof coinPacks[0]) => {
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
        <Coins className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Coin Packs</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="col-span-full bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Coins className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              Your Balance
            </CardTitle>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {coins} Coins
            </div>
          </CardHeader>
        </Card>
        {coinPacks.map((pack) => (
          <Card key={pack.id} className="hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Coins className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                {pack.label}
              </CardTitle>
              <CardDescription className="text-sm">{pack.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handlePurchaseClick(pack)}
                className="w-full"
                size="sm"
                variant="secondary"
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
          itemName={selectedPack.label}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
