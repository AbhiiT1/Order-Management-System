"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface OrderItem {
  product_name: string
  quantity: number
  price: number
}

export default function PlaceOrderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
  })
  const [items, setItems] = useState<OrderItem[]>([{ product_name: "", quantity: 1, price: 0 }])

  const addItem = () => {
    setItems([...items, { product_name: "", quantity: 1, price: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setItems(updatedItems)
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...customerInfo,
          items,
          total_amount: calculateTotal(),
        }),
      })

      if (response.ok) {
        const { orderId } = await response.json()
        router.push(`/order-confirmation/${orderId}`)
      } else {
        alert("Failed to place order. Please try again.")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Place New Order</CardTitle>
            <CardDescription>Fill out the form below to place your order</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">Full Name *</Label>
                    <Input
                      id="customer_name"
                      required
                      value={customerInfo.customer_name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, customer_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_email">Email *</Label>
                    <Input
                      id="customer_email"
                      type="email"
                      required
                      value={customerInfo.customer_email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, customer_email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="customer_phone">Phone Number</Label>
                  <Input
                    id="customer_phone"
                    value={customerInfo.customer_phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, customer_phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="shipping_address">Shipping Address *</Label>
                  <Textarea
                    id="shipping_address"
                    required
                    value={customerInfo.shipping_address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, shipping_address: e.target.value })}
                  />
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Order Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {items.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div className="md:col-span-2">
                        <Label htmlFor={`product_name_${index}`}>Product Name *</Label>
                        <Input
                          id={`product_name_${index}`}
                          required
                          value={item.product_name}
                          onChange={(e) => updateItem(index, "product_name", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`quantity_${index}`}>Quantity *</Label>
                        <Input
                          id={`quantity_${index}`}
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`price_${index}`}>Price ($) *</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`price_${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={item.price}
                            onChange={(e) => updateItem(index, "price", Number.parseFloat(e.target.value) || 0)}
                          />
                          {items.length > 1 && (
                            <Button type="button" variant="outline" size="icon" onClick={() => removeItem(index)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-right text-sm text-gray-600">
                      Subtotal: ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
