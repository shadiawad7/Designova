import { list, put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

const PORTFOLIO_FILE = "content/portfolio.json"

interface Project {
  id: number
  title: string
  category: string
  description: string
  price: number
  image?: string
  mediaType?: "image" | "video"
}

const defaultProjects: Project[] = Array(16).fill(null).map((_, i) => ({
  id: i + 1,
  title: "Diseño grafico",
  category: ["Invitaciones", "Grabado", "Diseño gráfico"][i % 3],
  description: "Proyecto personalizado con detalles a medida.",
  price: 50 + (i % 4) * 25,
}))

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "content/" })
    const portfolioBlob = blobs.find((b) => b.pathname === PORTFOLIO_FILE)

    if (portfolioBlob) {
      const response = await fetch(portfolioBlob.url)
      const projects = await response.json()
      return NextResponse.json({ projects })
    }

    return NextResponse.json({ projects: defaultProjects })
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json({ projects: defaultProjects })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { projects } = await request.json()

    await put(PORTFOLIO_FILE, JSON.stringify(projects, null, 2), {
      access: "public",
      contentType: "application/json",
    })

    return NextResponse.json({ success: true, projects })
  } catch (error) {
    console.error("Error saving portfolio:", error)
    return NextResponse.json({ error: "Failed to save portfolio" }, { status: 500 })
  }
}
