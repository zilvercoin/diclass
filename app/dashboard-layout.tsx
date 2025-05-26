"use client"

import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { AIAssistantButton } from "@/components/ai-assistant/ai-assistant-button"
import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
  }, [router])

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>{children}</DashboardShell>
      <AIAssistantButton />
    </div>
  )
}
