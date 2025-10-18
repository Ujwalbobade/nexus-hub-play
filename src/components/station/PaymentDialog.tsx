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
import { CreditCard, Wallet, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number | string
  itemName: string
  customerName?: string
  customerPhone?: string
  onPaymentSuccess: () => void
}

export function PaymentDialog({
  open,
  onOpenChange,
  amount,
  itemName,
  customerName,
  customerPhone,
  onPaymentSuccess,
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("upi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [qrData, setQrData] = useState<null | {
    qrCodeUrl: string
    transactionId: string
    expiresAt: string
    upiString: string
  }>(null)

  // ✅ Handle payment (generate QR from backend)
 const handlePayment = async () => {
  if (paymentMethod === "cash") {
    setPaymentSuccess(true)
    toast.success("Please pay cash at counter.")
    setTimeout(() => {
      onPaymentSuccess()
      onOpenChange(false)
      setPaymentSuccess(false)
    }, 1500)
    return
  }

  setIsProcessing(true)
  try {
    const numericAmount = typeof amount === "string" ? Number(amount.replace("$", "")) : amount

    const response = await fetch("http://localhost:8088/api/payment/generate-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: numericAmount,
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

  // 🕒 Optional: poll backend for payment status
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
          setPaymentSuccess(true)
          toast.success(`Payment successful for ${itemName}!`)
          setTimeout(() => {
            onPaymentSuccess()
            onOpenChange(false)
            setPaymentSuccess(false)
            setQrData(null)
          }, 2000)
        }
      } catch (err) {
        console.error("Status check failed:", err)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [qrData])

  const handleClose = () => {
    if (!isProcessing && !paymentSuccess) {
      onOpenChange(false)
      setPaymentSuccess(false)
      setQrData(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!paymentSuccess ? (
          <>
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
          </>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <DialogTitle className="text-2xl">Payment Successful!</DialogTitle>
            <DialogDescription className="text-base">
              Your payment for {itemName} has been processed successfully.
            </DialogDescription>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}