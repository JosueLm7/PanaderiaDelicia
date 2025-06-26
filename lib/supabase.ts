import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          address?: string | null
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number
          category: string
          image_url: string | null
          active: boolean
          created_at: string
        }
      }
      orders: {
        Row: {
          id: number
          user_id: string
          customer_name: string
          customer_phone: string
          customer_email: string
          delivery_address: string
          delivery_date: string
          delivery_time: string
          notes: string | null
          subtotal: number
          shipping: number
          total: number
          payment_method: string
          status: string
          order_number: string
          created_at: string
        }
        Insert: {
          user_id: string
          customer_name: string
          customer_phone: string
          customer_email: string
          delivery_address: string
          delivery_date: string
          delivery_time: string
          notes?: string | null
          subtotal: number
          shipping?: number
          total: number
          payment_method: string
          order_number: string
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          product_id: number | null
          product_name: string
          product_price: number
          quantity: number
          subtotal: number
        }
        Insert: {
          order_id: number
          product_id?: number | null
          product_name: string
          product_price: number
          quantity: number
          subtotal: number
        }
      }
    }
  }
}
