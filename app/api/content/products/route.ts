import { list, put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

const PRODUCTS_FILE = "content/products.json"

interface Product {
  id: string
  name: string
  price: number
  category: string
  image?: string
  description?: string
}

const defaultProducts: Product[] = [
  { id: "1", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "2", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "3", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "4", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "5", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "6", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "7", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "8", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "9", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "10", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "11", name: "Diseño grafico", price: 50, category: "Diseño" },
  { id: "12", name: "Diseño grafico", price: 50, category: "Diseño" },
]

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "content/" })
    const productsBlob = blobs.find((b) => b.pathname === PRODUCTS_FILE)

    if (productsBlob) {
      const response = await fetch(productsBlob.url)
      const products = await response.json()
      return NextResponse.json({ products })
    }

    return NextResponse.json({ products: defaultProducts })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ products: defaultProducts })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json()

    await put(PRODUCTS_FILE, JSON.stringify(products, null, 2), {
      access: "public",
      contentType: "application/json",
    })

    return NextResponse.json({ success: true, products })
  } catch (error) {
    console.error("Error saving products:", error)
    return NextResponse.json({ error: "Failed to save products" }, { status: 500 })
  }
}
