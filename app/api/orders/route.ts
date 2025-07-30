import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_name, customer_email, customer_phone, shipping_address, items, total_amount } = body

    // Insert order
    const orderResult = await sql`
      INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, total_amount)
      VALUES (${customer_name}, ${customer_email}, ${customer_phone}, ${shipping_address}, ${total_amount})
      RETURNING id
    `

    const orderId = orderResult[0].id

    // Insert order items
    for (const item of items) {
      await sql`
        INSERT INTO order_items (order_id, product_name, quantity, price)
        VALUES (${orderId}, ${item.product_name}, ${item.quantity}, ${item.price})
      `
    }

    // Insert initial status history
    await sql`
      INSERT INTO order_status_history (order_id, status, notes)
      VALUES (${orderId}, 'placed', 'Order received and confirmed')
    `

    return NextResponse.json({ orderId, message: "Order placed successfully" })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const orders = await sql`
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'product_name', oi.product_name,
                 'quantity', oi.quantity,
                 'price', oi.price
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
