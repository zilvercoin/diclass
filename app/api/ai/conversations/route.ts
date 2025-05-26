import { NextResponse } from "next/server"
import { getConversationsByUserId } from "@/lib/ai-storage"

export async function GET(req: Request) {
  try {
    // En una implementación real, obtendríamos el ID del usuario de la sesión
    const userId = "user-id"

    const conversations = getConversationsByUserId(userId)

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
