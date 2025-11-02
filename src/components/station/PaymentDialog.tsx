import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Wallet } from "lucide-react"
import { toast } from "sonner"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number
  itemName: string
  customerName?: string
  customerPhone?: string
  onPaymentSuccess: (transactionId?: string) => void
  userId: number
  sessionId: number
}

export function PaymentDialog({
  open,
  onOpenChange,
  amount,
  itemName,
  customerName,
  customerPhone,
  onPaymentSuccess,
  userId,
  sessionId,
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("upi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [qrData, setQrData] = useState<null | {
    qrCodeUrl: string
    transactionId: string
    expiresAt: string
    upiString: string
  }>(null)

  // ✅ Handle payment (generate QR from backend)
  const handlePayment = async () => {
  if (paymentMethod === "cash") {
    const cashTransactionId = `CASH_${Date.now()}`
    toast.success("Please pay cash at counter. Waiting for admin confirmation...")
    onPaymentSuccess(cashTransactionId)
    onOpenChange(false)
    return
  }

  setIsProcessing(true)
  try {
    const response = await fetch("http://localhost:8088/api/payment/generate-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amount,
        itemName,
        customerName,
        customerPhone,
        method: paymentMethod,
      }),
    })

    if (!response.ok) throw new Error("Failed to generate QR")

    const data = await response.json()
    setQrData({
      qrCodeUrl: data.qrCodeUrl,
      transactionId: data.transactionId,
      expiresAt: data.expiresAt,
      upiString: data.upiString,
    })
  } catch (err) {
    console.error(err)
    toast.error("Error generating QR code.")
  } finally {
    setIsProcessing(false)
  }
}

  // 🕒 Poll backend for payment status
  useEffect(() => {
    if (!qrData) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `http://localhost:8088/api/payment/status/${qrData.transactionId}`
        )
        if (!res.ok) return
        const status = await res.json()
        if (status.success) {
          clearInterval(interval)
          toast.success(`Payment received! Waiting for admin confirmation...`)
          onPaymentSuccess(qrData.transactionId)
          onOpenChange(false)
          setQrData(null)
        }
      } catch (err) {
        console.error("Status check failed:", err)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [qrData, onPaymentSuccess, onOpenChange, itemName])

  const handleClose = () => {
    if (!isProcessing) {
      onOpenChange(false)
      setQrData(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Complete Payment</DialogTitle>
          <DialogDescription>
            {qrData
              ? "Scan the QR to complete payment"
              : `Choose your payment method for ${itemName}`}
          </DialogDescription>
        </DialogHeader>

        {!qrData ? (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <span className="font-medium">Amount:</span>
              <span className="text-2xl font-bold text-primary">₹{amount}</span>
            </div>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(value: "upi" | "cash") => setPaymentMethod(value)}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label
                    htmlFor="upi"
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                  >
                    <Wallet className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">UPI Payment</div>
                      <div className="text-sm text-muted-foreground">
                        Google Pay, PhonePe, Paytm
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label
                    htmlFor="cash"
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                  >
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Cash Payment</div>
                      <div className="text-sm text-muted-foreground">
                        Pay at counter
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <img
              src={qrData.qrCodeUrl}
              alt="UPI QR"
              className="w-56 h-56 border rounded-lg shadow-md mx-auto"
            />
            <p className="text-sm text-muted-foreground">
              Transaction ID: {qrData.transactionId}
            </p>
            <a
              href={qrData.upiString}
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in UPI App
            </a>
            <p className="text-sm font-medium text-muted-foreground">
              Waiting for admin confirmation...
            </p>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {!qrData ? (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full sm:w-auto"
              >
                {isProcessing ? "Processing..." : `Pay ₹${amount}`}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full"
            >
              Cancel Payment
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}