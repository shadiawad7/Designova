import { list, put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

const GRAPHIC_DESIGN_FILE = "content/graphic-design.json"

interface GraphicService {
  id: string
  title: string
  description: string
  price: number
  image?: string
  mediaType?: "image" | "video"
}

const defaultServices: GraphicService[] = [
  {
    id: "service-1",
    title: "Diseño para redes sociales",
    description: "Post y stories con identidad visual coherente.",
    price: 45,
  },
  {
    id: "service-2",
    title: "Roll-ups y banners",
    description: "Diseño listo para impresión y ferias.",
    price: 90,
  },
  {
    id: "service-3",
    title: "Vallas publicitarias",
    description: "Composición de alto impacto para exteriores.",
    price: 150,
  },
  {
    id: "service-4",
    title: "Pegatinas y material",
    description: "Diseños versatiles para productos y marca.",
    price: 60,
  },
  {
    id: "service-5",
    title: "Tarjetas de visita",
    description: "Tarjetas modernas con acabados profesionales.",
    price: 40,
  },
  {
    id: "service-6",
    title: "Imprenta adicional",
    description: "Folletos, catalogos y menus personalizados.",
    price: 70,
  },
]

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "content/" })
    const contentBlob = blobs.find((b) => b.pathname === GRAPHIC_DESIGN_FILE)

    if (contentBlob) {
      const response = await fetch(contentBlob.url)
      const content = await response.json()
      return NextResponse.json({ services: content.services || defaultServices })
    }

    return NextResponse.json({ services: defaultServices })
  } catch (error) {
    console.error("Error fetching graphic design content:", error)
    return NextResponse.json({ services: defaultServices })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { services } = await request.json()

    await put(GRAPHIC_DESIGN_FILE, JSON.stringify({ services }, null, 2), {
      access: "public",
      contentType: "application/json",
    })

    return NextResponse.json({ success: true, services })
  } catch (error) {
    console.error("Error saving graphic design content:", error)
    return NextResponse.json({ error: "Failed to save graphic design content" }, { status: 500 })
  }
}
