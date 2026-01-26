import { list, put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

const LASER_FILE = "content/laser.json"

interface LaserProduct {
  id: string
  name: string
  price: number
  description: string
  image?: string
  mediaType?: "image" | "video"
}

interface Material {
  name: string
  description: string
  image?: string
}

interface LaserContent {
  materials: Material[]
  products: LaserProduct[]
}

const defaultContent: LaserContent = {
  materials: [
    { name: "Madera", description: "Grabado en madera natural para sensación cálida y natural" },
    { name: "Acrílico", description: "Grabado en acrílico transparente o de color para look moderno" },
    { name: "Cuero", description: "Grabado dedicado en cuero para añadido lujos" },
    { name: "Metal", description: "Grabado en varios metales para productos duraderos" },
  ],
  products: [
    { id: "laser-1", name: "Diseño grafico", price: 75, description: "Grabado personalizado en madera." },
    { id: "laser-2", name: "Diseño grafico", price: 75, description: "Grabado en acrilico con acabado limpio." },
    { id: "laser-3", name: "Diseños grafico", price: 75, description: "Detalles precisos para regalos." },
    { id: "laser-4", name: "Diseño grafico", price: 75, description: "Grabado para piezas corporativas." },
    { id: "laser-5", name: "Diseño grafico", price: 75, description: "Personalizacion con texto y logo." },
    { id: "laser-6", name: "Diseño grafico", price: 75, description: "Ideal para eventos y souvenirs." },
    { id: "laser-7", name: "Diseño grafico", price: 75, description: "Acabado premium en metal." },
    { id: "laser-8", name: "Diseño grafico", price: 75, description: "Grabado fino en cuero." },
  ],
}

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "content/" })
    const laserBlob = blobs.find((b) => b.pathname === LASER_FILE)

    if (laserBlob) {
      const response = await fetch(laserBlob.url)
      const content = await response.json()
      return NextResponse.json(content)
    }

    return NextResponse.json(defaultContent)
  } catch (error) {
    console.error("Error fetching laser content:", error)
    return NextResponse.json(defaultContent)
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json()

    await put(LASER_FILE, JSON.stringify(content, null, 2), {
      access: "public",
      contentType: "application/json",
    })

    return NextResponse.json({ success: true, ...content })
  } catch (error) {
    console.error("Error saving laser content:", error)
    return NextResponse.json({ error: "Failed to save laser content" }, { status: 500 })
  }
}
