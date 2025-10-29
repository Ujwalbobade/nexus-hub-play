import { useState, useEffect } from "react"
import { Clock, Wallet, CheckCircle2, Hourglass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { timePacks } from "../data"
import { PaymentDialog } from "../PaymentDialog"
import { fetchTimeRequests } from "@/services/api"

interface TimePacksTabProps {
  onPurchase: (pack: typeof timePacks[0], transactionId?: string) => void
  userId: number
  sessionId: number
}

export function TimePacksTab({ onPurchase, userId, sessionId }: TimePacksTabProps) {
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [selectedPack, setSelectedPack] = useState<typeof timePacks[0] | null>(null)
  const [requests, setRequests] = useState<any[]>([])

  // Fetch all time requests
  useEffect(() => {
    if (!sessionId) return
    ;(async () => {
      try {
        const data = await fetchTimeRequests(sessionId)
        setRequests(data)
      } catch (err) {
        console.error("Failed to fetch time requests:", err)
      }
    })()
  }, [sessionId])

  const handlePurchaseClick = (pack: typeof timePacks[0]) => {
    setSelectedPack(pack)
    setPaymentOpen(true)
  }

  const handlePaymentSuccess = (transactionId?: string) => {
    if (selectedPack) {
      onPurchase(selectedPack, transactionId)
      setPaymentOpen(false)
      setSelectedPack(null)
      // Refresh list after purchase
      fetchTimeRequests(sessionId).then(setRequests)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 md:gap-3">
        <Clock className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Time Packs</h2>
      </div>

      {/* Time Pack Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {timePacks.map((pack) => (
          <Card key={pack.id} className="hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                {pack.label}
              </CardTitle>
              <CardDescription className="text-sm">
                ₹{pack.priceValue} • +{pack.bonusCoins} bonus coins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handlePurchaseClick(pack)} className="w-full" size="sm">
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Dialog */}
      {selectedPack && (
        <PaymentDialog
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          amount={selectedPack.priceValue}
          itemName={`${selectedPack.label} + ${selectedPack.bonusCoins} Bonus Coins`}
          onPaymentSuccess={handlePaymentSuccess}
          userId={userId}
          sessionId={sessionId}
        />
      )}

      {/* Existing Time Requests */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Recent Transactions
        </h3>

        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No time requests yet.</p>
        ) : (
          <div className="grid gap-2">
            {requests.map((req) => (
              <Card key={req.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    +{req.additionalMinutes} min • ₹{req.amount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Method: {req.paymentMethod || (req.transactionId?.startsWith("CASH") ? "Cash" : "UPI")}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {req.status === "PENDING" && (
                    <>
                      <Hourglass className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-600 font-medium">Pending</span>
                    </>
                  )}
                  {req.status === "APPROVED" && (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">Approved</span>
                    </>
                  )}
                  {req.status === "REJECTED" && (
                    <span className="text-red-500 font-medium">Rejected</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}