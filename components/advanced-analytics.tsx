"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react"

export function AdvancedAnalytics() {
  const performanceData = [
    { metric: "Velocidad Promedio", value: 24.5, unit: "km/h", trend: "up", change: "+2.1%" },
    { metric: "Distancia Recorrida", value: 8.2, unit: "km", trend: "up", change: "+5.3%" },
    { metric: "Precisión de Pases", value: 87, unit: "%", trend: "down", change: "-1.2%" },
    { metric: "Duelos Ganados", value: 73, unit: "%", trend: "up", change: "+8.7%" },
  ]

  const weeklyProgress = [
    { day: "Lun", technical: 85, physical: 78, tactical: 92 },
    { day: "Mar", technical: 87, physical: 80, tactical: 89 },
    { day: "Mié", technical: 83, physical: 82, tactical: 94 },
    { day: "Jue", technical: 89, physical: 79, tactical: 91 },
    { day: "Vie", technical: 91, physical: 85, tactical: 96 },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Análisis de Rendimiento con IA
          </CardTitle>
          <CardDescription>Métricas avanzadas y predicciones de rendimiento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceData.map((data, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{data.metric}</span>
                  {data.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="text-2xl font-bold">
                  {data.value} {data.unit}
                </div>
                <div className={`text-sm ${data.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {data.change} vs semana anterior
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progreso Semanal Detallado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-semibold">{day.day}</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Técnico</span>
                      <span>{day.technical}%</span>
                    </div>
                    <Progress value={day.technical} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Físico</span>
                      <span>{day.physical}%</span>
                    </div>
                    <Progress value={day.physical} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Táctico</span>
                      <span>{day.tactical}%</span>
                    </div>
                    <Progress value={day.tactical} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Predicciones IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Predicción de Rendimiento</h4>
              <p className="text-sm text-blue-700">
                Basado en tu progreso actual, se predice una mejora del 12% en tu rendimiento general en las próximas 4 semanas.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Recomendación de Entrenamiento</h4>
              <p className="text-sm text-green-700">
                Enfócate en ejercicios de precisión de pases. Tu velocidad está excelente, pero puedes mejorar un 5% en precisión.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className\
