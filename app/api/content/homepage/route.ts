import { list, put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

const HOMEPAGE_FILE = "content/homepage.json"

interface Project {
  id: number
  title: string
  image?: string
}

interface HeroAssets {
  logo?: string
  leftTop?: string
  leftBottom?: string
  rightTop?: string
  rightBottom?: string
}

interface HomeContent {
  projects: Project[]
  heroAssets?: HeroAssets
}

const defaultContent: HomeContent = {
  projects: [
    { id: 1, title: "Diseño grafico" },
    { id: 2, title: "Diseño grafico" },
    { id: 3, title: "Diseño grafico" },
    { id: 4, title: "Diseño grafico" },
  ],
  heroAssets: {},
}

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "content/" })
    const homeBlob = blobs.find((b) => b.pathname === HOMEPAGE_FILE)

    if (homeBlob) {
      const response = await fetch(homeBlob.url)
      const content = await response.json()
      return NextResponse.json(content)
    }

    return NextResponse.json(defaultContent)
  } catch (error) {
    console.error("Error fetching homepage content:", error)
    return NextResponse.json(defaultContent)
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json()

    await put(HOMEPAGE_FILE, JSON.stringify(content, null, 2), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    })

    return NextResponse.json({ success: true, ...content })
  } catch (error) {
    console.error("Error saving homepage content:", error)
    return NextResponse.json({ error: "Failed to save homepage content" }, { status: 500 })
  }
}
