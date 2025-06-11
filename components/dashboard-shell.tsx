import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="container grid flex-1 items-start gap-4 py-6">
      <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}
