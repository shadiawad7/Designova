import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { getDbPool } from "@/lib/db"

export const runtime = "nodejs"

interface MaterialRow {
  id: string
  foto: string | null
  nombre: string | null
  descripcion: string | null
}

export async function GET() {
  try {
    const pool = getDbPool()
    const result = await pool.query<MaterialRow>(
      "SELECT id, foto, nombre, descripcion FROM materiales_grabado"
    )
    return NextResponse.json({ items: result.rows })
  } catch (error) {
    console.error("Error fetching materiales_grabado:", error)
    return NextResponse.json({ items: [], error: "Failed to fetch items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, descripcion, foto } = await request.json()
    const pool = getDbPool()
    const id = randomUUID()
    const result = await pool.query<MaterialRow>(
      "INSERT INTO materiales_grabado (id, foto, nombre, descripcion) VALUES ($1, $2, $3, $4) RETURNING id, foto, nombre, descripcion",
      [id, foto ?? null, nombre ?? null, descripcion ?? null]
    )
    return NextResponse.json({ item: result.rows[0] })
  } catch (error) {
    console.error("Error creating materiales_grabado item:", error)
    const message = error instanceof Error ? error.message : "Failed to create item"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, nombre, descripcion, foto } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    const pool = getDbPool()
    const result = await pool.query<MaterialRow>(
      "UPDATE materiales_grabado SET foto = $1, nombre = $2, descripcion = $3 WHERE id = $4 RETURNING id, foto, nombre, descripcion",
      [foto ?? null, nombre ?? null, descripcion ?? null, id]
    )
    return NextResponse.json({ item: result.rows[0] })
  } catch (error) {
    console.error("Error updating materiales_grabado item:", error)
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
    await pool.query("DELETE FROM materiales_grabado WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting materiales_grabado item:", error)
    const message = error instanceof Error ? error.message : "Failed to delete item"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
