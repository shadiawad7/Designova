import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { getDbPool } from "@/lib/db"

export const runtime = "nodejs"

interface TrabajoRow {
  id: string
  foto: string | null
  nombre: string | null
  descripcion: string | null
  precio: number | null
}

export async function GET() {
  try {
    const pool = getDbPool()
    const result = await pool.query<TrabajoRow>(
      "SELECT id, foto, nombre, descripcion, precio FROM ejemplos_trabajos"
    )
    return NextResponse.json({ items: result.rows })
  } catch (error) {
    console.error("Error fetching ejemplos_trabajos:", error)
    return NextResponse.json({ items: [], error: "Failed to fetch items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, descripcion, precio, foto } = await request.json()
    const pool = getDbPool()
    const id = randomUUID()
    const result = await pool.query<TrabajoRow>(
      "INSERT INTO ejemplos_trabajos (id, foto, nombre, descripcion, precio) VALUES ($1, $2, $3, $4, $5) RETURNING id, foto, nombre, descripcion, precio",
      [id, foto ?? null, nombre ?? null, descripcion ?? null, precio ?? null]
    )
    return NextResponse.json({ item: result.rows[0] })
  } catch (error) {
    console.error("Error creating ejemplos_trabajos item:", error)
    const message = error instanceof Error ? error.message : "Failed to create item"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, nombre, descripcion, precio, foto } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    const pool = getDbPool()
    const result = await pool.query<TrabajoRow>(
      "UPDATE ejemplos_trabajos SET foto = $1, nombre = $2, descripcion = $3, precio = $4 WHERE id = $5 RETURNING id, foto, nombre, descripcion, precio",
      [foto ?? null, nombre ?? null, descripcion ?? null, precio ?? null, id]
    )
    return NextResponse.json({ item: result.rows[0] })
  } catch (error) {
    console.error("Error updating ejemplos_trabajos item:", error)
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
    await pool.query("DELETE FROM ejemplos_trabajos WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting ejemplos_trabajos item:", error)
    const message = error instanceof Error ? error.message : "Failed to delete item"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
