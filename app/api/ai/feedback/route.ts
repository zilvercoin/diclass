import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messageId, isPositive, conversationId } = await req.json()

    // En una implementación real, guardaríamos este feedback en la base de datos
    console.log("Feedback recibido:", { messageId, isPositive, conversationId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving feedback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
