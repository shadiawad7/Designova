import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { getDbPool } from "@/lib/db"

export const runtime = "nodejs"

interface LogoRow {
  id: string
  foto: string | null
}

export async function GET() {
  try {
    const pool = getDbPool()
    const result = await pool.query<LogoRow>("SELECT id, foto FROM logo")
    return NextResponse.json({ items: result.rows })
  } catch (error) {
    console.error("Error fetching logo:", error)
    return NextResponse.json({ items: [], error: "Failed to fetch logo" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { foto } = await request.json()
    const pool = getDbPool()
    const id = randomUUID()
    const result = await pool.query<LogoRow>(
      "INSERT INTO logo (id, foto) VALUES ($1, $2) RETURNING id, foto",
      [id, foto ?? null]
    )
    return NextResponse.json({ item: result.rows[0] })
  } catch (error) {
    console.error("Error creating logo:", error)
    const message = error instanceof Error ? error.message : "Failed to create logo"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, foto } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    const pool = getDbPool()
    const result = await pool.query<LogoRow>(
      "UPDATE logo SET foto = $1 WHERE id = $2 RETURNING id, foto",
      [foto ?? null, id]
    )
    return NextResponse.json({ item: result.rows[0] })
  } catch (error) {
    console.error("Error updating logo:", error)
    const message = error instanceof Error ? error.message : "Failed to update logo"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
