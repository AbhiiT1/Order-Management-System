import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Truck, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Management System</h1>
          <p className="text-xl text-gray-600 mb-8">
            Place orders online and track them through every step of delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/place-order">Place New Order</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/track-order">Track Order</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <ShoppingCart className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <CardTitle>Placed</CardTitle>
              <CardDescription>Order received and confirmed</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Package className="h-12 w-12 mx-auto text-orange-600 mb-2" />
              <CardTitle>Picked</CardTitle>
              <CardDescription>Items picked from warehouse</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Truck className="h-12 w-12 mx-auto text-purple-600 mb-2" />
              <CardTitle>Shipped</CardTitle>
              <CardDescription>Package on the way</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-2" />
              <CardTitle>Delivered</CardTitle>
              <CardDescription>Successfully delivered</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full p-2 text-sm font-semibold min-w-[2rem] h-8 flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Place Your Order</h3>
                  <p className="text-gray-600">Fill out the order form with your details and items</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 text-orange-600 rounded-full p-2 text-sm font-semibold min-w-[2rem] h-8 flex items-center justify-center">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Order Processing</h3>
                  <p className="text-gray-600">We pick your items from our warehouse</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 text-purple-600 rounded-full p-2 text-sm font-semibold min-w-[2rem] h-8 flex items-center justify-center">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Shipping</h3>
                  <p className="text-gray-600">Your package is shipped and on its way</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full p-2 text-sm font-semibold min-w-[2rem] h-8 flex items-center justify-center">
                  4
                </div>
                <div>
                  <h3 className="font-semibold">Delivery</h3>
                  <p className="text-gray-600">Package delivered to your address</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
