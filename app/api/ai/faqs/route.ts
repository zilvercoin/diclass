import { NextResponse } from "next/server"
import { getFAQsByRole } from "@/lib/ai-storage"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userRole = searchParams.get("role") || "both"

    const faqs = getFAQsByRole(userRole)

    return NextResponse.json({ faqs })
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
