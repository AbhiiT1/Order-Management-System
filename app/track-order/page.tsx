"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Search, Package, Truck, CheckCircle, ShoppingCart } from "lucide-react"
import Link from "next/link"
import type { Order, OrderItem, OrderStatusHistory } from "@/types/order"

interface OrderWithDetails extends Order {
  items: OrderItem[]
  history: OrderStatusHistory[]
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("")
  const [order, setOrder] = useState<OrderWithDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim()) return

    setLoading(true)
    setError("")
    setOrder(null)

    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const orderData = await response.json()
        setOrder(orderData)
      } else {
        setError("Order not found. Please check the order ID and try again.")
      }
    } catch (error) {
      console.error("Error fetching order:", error)
      setError("Failed to fetch order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "placed":
        return <ShoppingCart className="h-6 w-6" />
      case "picked":
        return <Package className="h-6 w-6" />
      case "shipped":
        return <Truck className="h-6 w-6" />
      case "delivered":
        return <CheckCircle className="h-6 w-6" />
      default:
        return <ShoppingCart className="h-6 w-6" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "text-blue-600 bg-blue-100"
      case "picked":
        return "text-orange-600 bg-orange-100"
      case "shipped":
        return "text-purple-600 bg-purple-100"
      case "delivered":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Track Your Order</CardTitle>
            <CardDescription>Enter your order ID to track its status</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="orderId" className="sr-only">
                  Order ID
                </Label>
                <Input
                  id="orderId"
                  placeholder="Enter Order ID (e.g., 1, 2, 3...)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Track Order"}
              </Button>
            </form>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </CardContent>
        </Card>

        {order && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order #{order.id}</CardTitle>
                <CardDescription>Placed on {new Date(order.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Customer Information</h3>
                    <p>
                      <strong>Name:</strong> {order.customer_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.customer_email}
                    </p>
                    {order.customer_phone && (
                      <p>
                        <strong>Phone:</strong> {order.customer_phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="whitespace-pre-line">{order.shipping_address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  {["placed", "picked", "shipped", "delivered"].map((status, index) => {
                    const isActive = order.status === status
                    const isPast = ["placed", "picked", "shipped", "delivered"].indexOf(order.status) > index
                    const isCompleted = isActive || isPast

                    return (
                      <div key={status} className="flex flex-col items-center flex-1">
                        <div
                          className={`rounded-full p-3 mb-2 ${
                            isCompleted ? getStatusColor(status) : "text-gray-400 bg-gray-100"
                          }`}
                        >
                          {getStatusIcon(status)}
                        </div>
                        <span
                          className={`text-sm font-medium capitalize ${
                            isCompleted ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {status}
                        </span>
                        {index < 3 && <div className={`h-1 w-full mt-2 ${isPast ? "bg-green-200" : "bg-gray-200"}`} />}
                      </div>
                    )
                  })}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Status History</h4>
                  <div className="space-y-2">
                    {order.history.map((entry) => (
                      <div key={entry.id} className="flex justify-between items-center text-sm">
                        <span className="capitalize font-medium">{entry.status}</span>
                        <span className="text-gray-600">{new Date(entry.changed_at).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 text-lg font-semibold">
                    <span>Total:</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
