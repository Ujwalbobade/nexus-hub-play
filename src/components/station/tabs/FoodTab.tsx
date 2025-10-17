import { useState } from "react"
import { Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "../types"
import { PaymentDialog } from "../PaymentDialog"
import { toast } from "sonner"

interface FoodTabProps {
  user: User
  onFoodOrderPlaced?: () => void
}

type MenuItem = {
  id: number
  name: string
  price: number
  category: string
  image: string
  description: string
}

export function FoodTab({ user, onFoodOrderPlaced }: FoodTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  
  const menuItems = [
    { id: 1, name: "Classic Burger", price: 150, category: "Burgers", image: "🍔", description: "Juicy beef patty with cheese" },
    { id: 2, name: "Margherita Pizza", price: 200, category: "Pizza", image: "🍕", description: "Fresh mozzarella and basil" },
    { id: 3, name: "Chicken Wings", price: 120, category: "Snacks", image: "🍗", description: "Crispy fried wings" },
    { id: 4, name: "French Fries", price: 80, category: "Snacks", image: "🍟", description: "Golden crispy fries" },
    { id: 5, name: "Coca Cola", price: 50, category: "Drinks", image: "🥤", description: "Ice cold soda" },
    { id: 6, name: "Energy Drink", price: 70, category: "Drinks", image: "⚡", description: "Boost your energy" },
  ]

  const categories = ["all", "Burgers", "Pizza", "Snacks", "Drinks"]
  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const handleOrderClick = (item: MenuItem) => {
    setSelectedItem(item)
    setPaymentOpen(true)
  }

  const handlePaymentSuccess = () => {
    onFoodOrderPlaced?.()
    toast.success(`Order placed! Your ${selectedItem?.name} will be ready in 5 minutes.`, {
      duration: 5000,
    })
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Order Food</h1>
        <p className="text-sm md:text-base text-muted-foreground">Hi {user.name}, hungry? Order from our menu!</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize whitespace-nowrap text-xs md:text-sm"
          >
            {category}
          </Button>
        ))}
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border-border hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="text-4xl md:text-5xl">{item.image}</div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base md:text-lg truncate">{item.name}</CardTitle>
                  <Badge variant="outline" className="mt-1">{item.category}</Badge>
                </div>
              </div>
              <CardDescription className="mt-2">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-secondary" />
                  <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {item.price}
                  </span>
                </div>
                <Button size="sm" className="gap-1" onClick={() => handleOrderClick(item)}>
                  Order Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedItem && (
        <PaymentDialog
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          amount={`₹${selectedItem.price}`}
          itemName={selectedItem.name}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
