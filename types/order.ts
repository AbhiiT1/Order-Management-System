export interface Order {
  id: number
  customer_name: string
  customer_email: string
  customer_phone?: string
  shipping_address: string
  total_amount: number
  status: "placed" | "picked" | "shipped" | "delivered"
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_name: string
  quantity: number
  price: number
  created_at: string
}

export interface OrderStatusHistory {
  id: number
  order_id: number
  status: string
  changed_at: string
  notes?: string
}
