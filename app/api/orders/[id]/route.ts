import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)

    const orderResult = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `

    if (orderResult.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const itemsResult = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `

    const historyResult = await sql`
      SELECT * FROM order_status_history 
      WHERE order_id = ${orderId} 
      ORDER BY changed_at ASC
    `

    const order = {
      ...orderResult[0],
      items: itemsResult,
      history: historyResult,
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)
    const { status, notes } = await request.json()

    // Update order status
    await sql`
      UPDATE orders 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${orderId}
    `

    // Add to status history
    await sql`
      INSERT INTO order_status_history (order_id, status, notes)
      VALUES (${orderId}, ${status}, ${notes || ""})
    `

    return NextResponse.json({ message: "Order status updated successfully" })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
