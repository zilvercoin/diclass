"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { AIChat } from "@/components/ai-assistant/ai-chat"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Bot, BookOpen, Clock } from "lucide-react"
import { initializeAIData } from "@/lib/ai-storage"

export default function AIAssistantPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [faqs, setFaqs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    // Solo los profesores pueden acceder a esta página
    if (currentUser.role !== "teacher") {
      router.push("/dashboard")
      return
    }

    setUser(currentUser)

    // Inicializar datos de IA
    initializeAIData()

    // Cargar conversaciones y FAQs
    const loadData = async () => {
      try {
        const [conversationsRes, faqsRes] = await Promise.all([fetch("/api/ai/conversations"), fetch("/api/ai/faqs")])

        if (conversationsRes.ok && faqsRes.ok) {
          const [conversationsData, faqsData] = await Promise.all([conversationsRes.json(), faqsRes.json()])

          setConversations(conversationsData.conversations || [])
          setFaqs(faqsData.faqs || [])
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  if (!user || user.role !== "teacher") return null

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-rose-600" />
                    Asistente IA Avanzado
                  </CardTitle>
                  <CardDescription>
                    Tu asistente personalizado para ayudarte con estrategias de enseñanza, evaluación y uso avanzado de
                    DiClass
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AIChat />
                </CardContent>
              </Card>
            </div>

            <div className="md:w-1/3">
              <Tabs defaultValue="faqs">
                <TabsList className="w-full">
                  <TabsTrigger value="faqs" className="flex-1">
                    <BookOpen className="h-4 w-4 mr-2" /> FAQs
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex-1">
                    <Clock className="h-4 w-4 mr-2" /> Historial
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="faqs" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Preguntas Frecuentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-pulse space-y-3 w-full">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
                            ))}
                          </div>
                        </div>
                      ) : faqs.length > 0 ? (
                        <div className="space-y-3">
                          {faqs.map((faq) => (
                            <div
                              key={faq.id}
                              className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                            >
                              <h4 className="font-medium">{faq.question}</h4>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">No hay preguntas frecuentes disponibles</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Historial de Conversaciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-pulse space-y-3 w-full">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
                            ))}
                          </div>
                        </div>
                      ) : conversations.length > 0 ? (
                        <div className="space-y-3">
                          {conversations.map((conversation) => (
                            <div
                              key={conversation.id}
                              className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium truncate">{conversation.title || "Conversación"}</h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(conversation.updated_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">No hay conversaciones recientes</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DashboardShell>
    </div>
  )
}
