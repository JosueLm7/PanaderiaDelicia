import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      delivery_date,
      delivery_time,
      notes,
      payment_method,
      items,
      subtotal,
      shipping = 5.0,
    } = body

    const total = subtotal + shipping

    // Generar número de pedido único
    const orderNumber = `PD-${Date.now()}`

    // Crear el pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id,
        customer_name,
        customer_phone,
        customer_email,
        delivery_address,
        delivery_date,
        delivery_time,
        notes,
        payment_method,
        subtotal,
        shipping,
        total,
        order_number: orderNumber,
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    // Crear los items del pedido
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw itemsError
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items: orderItems,
      },
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Error creating order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 })
  }
}
