import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { getDbPool } from "@/lib/db"

export const runtime = "nodejs"

interface ContactoRow {
  id: string
  nombre_completo: string | null
  email: string | null
  telefono: string | null
  tipo_consulta: string | null
  mensaje: string | null
}

export async function POST(request: NextRequest) {
  try {
    const { nombreCompleto, email, telefono, tipoConsulta, mensaje } = await request.json()

    const pool = getDbPool()
    const id = randomUUID()
    const result = await pool.query<ContactoRow>(
      "INSERT INTO contacto (id, nombre_completo, email, telefono, tipo_consulta, mensaje) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [
        id,
        nombreCompleto ?? null,
        email ?? null,
        telefono ?? null,
        tipoConsulta ?? null,
        mensaje ?? null,
      ]
    )

    return NextResponse.json({ success: true, id: result.rows[0]?.id ?? id })
  } catch (error) {
    console.error("Error creating contacto:", error)
    const message = error instanceof Error ? error.message : "Failed to send message"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
