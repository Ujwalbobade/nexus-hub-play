import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  onPaymentSuccess: () => void
}

export function PaymentDialog({ open, onOpenChange, amount, itemName, onPaymentSuccess }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("upi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setPaymentSuccess(true)
    
    // Wait a bit to show success message
    setTimeout(() => {
      onPaymentSuccess()
      onOpenChange(false)
      setPaymentSuccess(false)
      toast.success(`Payment successful! ${itemName} purchased.`)
    }, 1500)
  }

  const handleClose = () => {
    if (!isProcessing && !paymentSuccess) {
      onOpenChange(false)
      setPaymentSuccess(false)
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
                Choose your payment method for {itemName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                <span className="font-medium">Amount:</span>
                <span className="text-2xl font-bold text-primary">{amount}</span>
              </div>

              <RadioGroup value={paymentMethod} onValueChange={(value: "upi" | "cash") => setPaymentMethod(value)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-3 flex-1 cursor-pointer">
                      <Wallet className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">UPI Payment</div>
                        <div className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-3 flex-1 cursor-pointer">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">Cash Payment</div>
                        <div className="text-sm text-muted-foreground">Pay at counter</div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleClose} disabled={isProcessing} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={isProcessing} className="w-full sm:w-auto">
                {isProcessing ? "Processing..." : `Pay ${amount}`}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <DialogTitle className="text-2xl">Payment Successful!</DialogTitle>
            <DialogDescription className="text-base">
              Your payment has been processed successfully.
            </DialogDescription>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
