import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { getDbPool } from "@/lib/db"

export const runtime = "nodejs"

interface SobreRow {
  id: string
  foto: string | null
}

export async function GET() {
  try {
    const pool = getDbPool()
    const result = await pool.query<SobreRow>("SELECT id, foto FROM sobre_nosotros")
    return NextResponse.json({ items: result.rows })
  } catch (error) {
    console.error("Error fetching sobre_nosotros:", error)
    return NextResponse.json({ items: [], error: "Failed to fetch items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { foto } = await request.json()
    const pool = getDbPool()
    const id = randomUUID()
    const result = await pool.query<SobreRow>(
      "INSERT INTO sobre_nosotros (id, foto) VALUES ($1, $2) RETURNING id, foto",
      [id, foto ?? null]
    )
    return NextResponse.json({ item: result.rows[0] })
  } catch (error) {
    console.error("Error creating sobre_nosotros item:", error)
    const message = error instanceof Error ? error.message : "Failed to create item"
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
    const result = await pool.query<SobreRow>(
      "UPDATE sobre_nosotros SET foto = $1 WHERE id = $2 RETURNING id, foto",
      [foto ?? null, id]
    )
    return NextResponse.json({ item: result.rows[0] })
  } catch (error) {
    console.error("Error updating sobre_nosotros item:", error)
    const message = error instanceof Error ? error.message : "Failed to update item"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    const pool = getDbPool()
    await pool.query("DELETE FROM sobre_nosotros WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting sobre_nosotros item:", error)
    const message = error instanceof Error ? error.message : "Failed to delete item"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
