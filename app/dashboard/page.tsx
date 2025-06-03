"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Trophy,
  Users,
  Calendar,
  CreditCard,
  LogOut,
  Target,
  CheckCircle,
  XCircle,
  DollarSign,
  User,
  Star,
} from "lucide-react"

interface Player {
  id: number
  name: string
  number: number
  position: string
  goals: number
  assists: number
  attendance: number
}

interface Payment {
  id: number
  month: string
  amount: number
  status: string
  dueDate: string
}

interface Training {
  id: number
  date: string
  time: string
  type: string
  attendance: boolean
}

export default function UserDashboard() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")

  const players: Player[] = [
    { id: 1, name: "Elvis Rivas", number: 10, position: "Mediocampista", goals: 15, assists: 8, attendance: 95 },
    { id: 2, name: "Juan Pintado", number: 7, position: "Extremo", goals: 12, assists: 10, attendance: 88 },
    { id: 3, name: "Kevin Muñoz", number: 8, position: "Mediocampista", goals: 8, assists: 12, attendance: 92 },
    { id: 4, name: "Mateo Ortega", number: 1, position: "Portero", goals: 0, assists: 2, attendance: 98 },
    { id: 5, name: "Estiven Toledo", number: 9, position: "Delantero", goals: 20, assists: 5, attendance: 90 },
    { id: 6, name: "Mantis", number: 5, position: "Defensa", goals: 3, assists: 4, attendance: 85 },
    { id: 7, name: "Chino", number: 4, position: "Defensa", goals: 2, assists: 6, attendance: 93 },
  ]

  const payments: Payment[] = [
    { id: 1, month: "Diciembre 2024", amount: 50000, status: "Pagado", dueDate: "2024-12-05" },
    { id: 2, month: "Noviembre 2024", amount: 50000, status: "Pagado", dueDate: "2024-11-05" },
    { id: 3, month: "Octubre 2024", amount: 50000, status: "Pagado", dueDate: "2024-10-05" },
    { id: 4, month: "Enero 2025", amount: 50000, status: "Pendiente", dueDate: "2025-01-05" },
  ]

  const trainings: Training[] = [
    { id: 1, date: "2024-12-01", time: "16:00", type: "Entrenamiento Técnico", attendance: true },
    { id: 2, date: "2024-12-03", time: "16:00", type: "Entrenamiento Físico", attendance: true },
    { id: 3, date: "2024-12-05", time: "16:00", type: "Partido Amistoso", attendance: false },
    { id: 4, date: "2024-12-08", time: "16:00", type: "Entrenamiento Táctico", attendance: true },
    { id: 5, date: "2024-12-10", time: "16:00", type: "Entrenamiento Técnico", attendance: true },
  ]

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    const email = localStorage.getItem("userEmail")
    if (userType !== "user") {
      router.push("/")
    }
    if (email) {
      setUserEmail(email)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const attendanceRate = (trainings.filter((t) => t.attendance).length / trainings.length) * 100
  const pendingPayments = payments.filter((p) => p.status === "Pendiente").length
  const totalGoals = players.reduce((sum, player) => sum + player.goals, 0)
  const totalAssists = players.reduce((sum, player) => sum + player.assists, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-xl font-bold">Academia de Fútbol Elite</h1>
                <p className="text-sm text-green-100">Bienvenido, {userEmail}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-green-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Asistencia</p>
                  <p className="text-2xl font-bold">{attendanceRate.toFixed(0)}%</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Goles Totales</p>
                  <p className="text-2xl font-bold">{totalGoals}</p>
                </div>
                <Target className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Asistencias</p>
                  <p className="text-2xl font-bold">{totalAssists}</p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Pagos Pendientes</p>
                  <p className="text-2xl font-bold">{pendingPayments}</p>
                </div>
                <CreditCard className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="players">Jugadores</TabsTrigger>
            <TabsTrigger value="training">Entrenamientos</TabsTrigger>
            <TabsTrigger value="matches">Partidos</TabsTrigger>
            <TabsTrigger value="health">Salud</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="store">Tienda</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Eventos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Entrenamiento Técnico</p>
                        <p className="text-sm text-gray-600">Hoy 16:00 - Campo Principal</p>
                      </div>
                      <Badge>Hoy</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Partido vs Deportivo Cali</p>
                        <p className="text-sm text-gray-600">Sábado 15:00 - Estadio</p>
                      </div>
                      <Badge variant="secondary">Sábado</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Evaluación Médica</p>
                        <p className="text-sm text-gray-600">Lunes 10:00 - Consultorio</p>
                      </div>
                      <Badge variant="outline">Lunes</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logros Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Trophy className="h-8 w-8 text-yellow-600" />
                      <div>
                        <p className="font-semibold">¡Goleador del Mes!</p>
                        <p className="text-sm text-gray-600">15 goles en Noviembre</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-semibold">Asistencia Perfecta</p>
                        <p className="text-sm text-gray-600">100% en entrenamientos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Target className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-semibold">Mejor Jugador</p>
                        <p className="text-sm text-gray-600">Partido vs Millonarios</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Players Tab - Enhanced */}
          <TabsContent value="players">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Plantilla de Jugadores
                  </CardTitle>
                  <CardDescription>Estadísticas completas y comparativas de rendimiento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {players.map((player) => (
                      <Card key={player.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {player.number}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{player.name}</h3>
                                <p className="text-sm text-gray-600">{player.position}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Goles:</span>
                              <span className="font-semibold">{player.goals}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Asistencias:</span>
                              <span className="font-semibold">{player.assists}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Velocidad:</span>
                              <span className="font-semibold">{Math.floor(Math.random() * 20) + 80} km/h</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Asistencia:</span>
                                <span className="font-semibold">{player.attendance}%</span>
                              </div>
                              <Progress value={player.attendance} className="h-2" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Forma Física:</span>
                                <span className="font-semibold">{Math.floor(Math.random() * 30) + 70}%</span>
                              </div>
                              <Progress value={Math.floor(Math.random() * 30) + 70} className="h-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ranking de Jugadores</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Posición</TableHead>
                        <TableHead>Jugador</TableHead>
                        <TableHead>Goles</TableHead>
                        <TableHead>Asistencias</TableHead>
                        <TableHead>Puntuación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {players
                        .sort((a, b) => b.goals + b.assists - (a.goals + a.assists))
                        .map((player, index) => (
                          <TableRow key={player.id}>
                            <TableCell>
                              <Badge variant={index < 3 ? "default" : "secondary"}>#{index + 1}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{player.name}</TableCell>
                            <TableCell>{player.goals}</TableCell>
                            <TableCell>{player.assists}</TableCell>
                            <TableCell>
                              {((player.goals * 2 + player.assists + player.attendance) / 10).toFixed(1)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Calendar className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Entrenamientos Esta Semana</p>
                        <p className="text-2xl font-bold text-gray-900">5</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Target className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Horas Entrenadas</p>
                        <p className="text-2xl font-bold text-gray-900">12.5</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Trophy className="h-8 w-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Nivel de Intensidad</p>
                        <p className="text-2xl font-bold text-gray-900">Alta</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Calendario de Entrenamientos</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Entrenador</TableHead>
                        <TableHead>Intensidad</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          date: "2024-12-15",
                          time: "16:00",
                          type: "Técnico",
                          coach: "Carlos Pérez",
                          intensity: "Media",
                          status: "Programado",
                        },
                        {
                          date: "2024-12-17",
                          time: "16:00",
                          type: "Físico",
                          coach: "Ana García",
                          intensity: "Alta",
                          status: "Programado",
                        },
                        {
                          date: "2024-12-19",
                          time: "16:00",
                          type: "Táctico",
                          coach: "Luis Rodríguez",
                          intensity: "Media",
                          status: "Programado",
                        },
                        {
                          date: "2024-12-21",
                          time: "10:00",
                          type: "Partido Práctica",
                          coach: "Carlos Pérez",
                          intensity: "Alta",
                          status: "Programado",
                        },
                      ].map((training, index) => (
                        <TableRow key={index}>
                          <TableCell>{training.date}</TableCell>
                          <TableCell>{training.time}</TableCell>
                          <TableCell>{training.type}</TableCell>
                          <TableCell>{training.coach}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                training.intensity === "Alta"
                                  ? "destructive"
                                  : training.intensity === "Media"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {training.intensity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{training.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan de Entrenamiento Personalizado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Objetivos de la Semana</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Mejorar precisión en pases largos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Aumentar velocidad de sprint</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">Perfeccionar tiros libres</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">Mejorar juego aéreo</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Progreso Semanal</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Resistencia</span>
                            <span>85%</span>
                          </div>
                          <Progress value={85} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Técnica</span>
                            <span>78%</span>
                          </div>
                          <Progress value={78} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Táctica</span>
                            <span>92%</span>
                          </div>
                          <Progress value={92} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Partidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        opponent: "Deportivo Cali",
                        date: "2024-12-21",
                        time: "15:00",
                        venue: "Estadio Deportivo Cali",
                        type: "Liga",
                      },
                      {
                        opponent: "Atlético Nacional",
                        date: "2024-12-28",
                        time: "17:00",
                        venue: "Estadio Atanasio Girardot",
                        type: "Copa",
                      },
                      {
                        opponent: "Millonarios FC",
                        date: "2025-01-05",
                        time: "19:00",
                        venue: "Estadio El Campín",
                        type: "Liga",
                      },
                    ].map((match, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">vs {match.opponent}</h4>
                            <p className="text-sm text-gray-600">{match.venue}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{match.date}</p>
                          <p className="text-sm text-gray-600">{match.time}</p>
                          <Badge variant="outline">{match.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resultados Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Rival</TableHead>
                        <TableHead>Resultado</TableHead>
                        <TableHead>Goleadores</TableHead>
                        <TableHead>Competición</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          date: "2024-12-08",
                          opponent: "Junior FC",
                          result: "3-1",
                          scorers: "Elvis (2), Estiven",
                          competition: "Liga",
                        },
                        {
                          date: "2024-12-01",
                          opponent: "América de Cali",
                          result: "2-2",
                          scorers: "Juan, Kevin",
                          competition: "Liga",
                        },
                        {
                          date: "2024-11-24",
                          opponent: "Santa Fe",
                          result: "1-0",
                          scorers: "Estiven",
                          competition: "Copa",
                        },
                      ].map((match, index) => (
                        <TableRow key={index}>
                          <TableCell>{match.date}</TableCell>
                          <TableCell>{match.opponent}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                match.result.split("-")[0] > match.result.split("-")[1] ? "default" : "secondary"
                              }
                            >
                              {match.result}
                            </Badge>
                          </TableCell>
                          <TableCell>{match.scorers}</TableCell>
                          <TableCell>{match.competition}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tabla de Posiciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pos</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead>PJ</TableHead>
                        <TableHead>G</TableHead>
                        <TableHead>E</TableHead>
                        <TableHead>P</TableHead>
                        <TableHead>Pts</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { pos: 1, team: "Millonarios FC", pj: 15, g: 12, e: 2, p: 1, pts: 38 },
                        { pos: 2, team: "Academia Elite", pj: 15, g: 11, e: 3, p: 1, pts: 36 },
                        { pos: 3, team: "Atlético Nacional", pj: 15, g: 10, e: 4, p: 1, pts: 34 },
                        { pos: 4, team: "Deportivo Cali", pj: 15, g: 9, e: 3, p: 3, pts: 30 },
                      ].map((team, index) => (
                        <TableRow key={index} className={team.team === "Academia Elite" ? "bg-green-50" : ""}>
                          <TableCell>
                            <Badge variant={team.pos <= 3 ? "default" : "secondary"}>{team.pos}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{team.team}</TableCell>
                          <TableCell>{team.pj}</TableCell>
                          <TableCell>{team.g}</TableCell>
                          <TableCell>{team.e}</TableCell>
                          <TableCell>{team.p}</TableCell>
                          <TableCell className="font-bold">{team.pts}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-bold">♥</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Frecuencia Cardíaca</p>
                        <p className="text-2xl font-bold text-gray-900">72 bpm</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">⚖</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Peso</p>
                        <p className="text-2xl font-bold text-gray-900">68 kg</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">📏</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Altura</p>
                        <p className="text-2xl font-bold text-gray-900">175 cm</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 font-bold">💪</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">IMC</p>
                        <p className="text-2xl font-bold text-gray-900">22.2</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ficha Médica</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">✅ Exámenes al Día</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Examen médico general (Nov 2024)</li>
                          <li>• Electrocardiograma (Nov 2024)</li>
                          <li>• Análisis de sangre (Oct 2024)</li>
                          <li>• Examen oftalmológico (Sep 2024)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">⚠️ Pendientes</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Examen dental (Vence: Ene 2025)</li>
                          <li>• Vacuna antitetánica (Vence: Mar 2025)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2">🩺 Alergias</h4>
                        <p className="text-sm">Ninguna alergia conocida</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Plan Nutricional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Objetivos Nutricionales</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Calorías diarias:</span>
                            <span className="font-semibold">2,800 kcal</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Proteínas:</span>
                            <span className="font-semibold">140g (20%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Carbohidratos:</span>
                            <span className="font-semibold">420g (60%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Grasas:</span>
                            <span className="font-semibold">62g (20%)</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Suplementos</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Proteína Whey (post-entrenamiento)</li>
                          <li>• Multivitamínico (desayuno)</li>
                          <li>• Omega-3 (almuerzo)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Historial de Lesiones</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Lesión</TableHead>
                        <TableHead>Gravedad</TableHead>
                        <TableHead>Tiempo Recuperación</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2024-08-15</TableCell>
                        <TableCell>Esguince tobillo izquierdo</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Leve</Badge>
                        </TableCell>
                        <TableCell>2 semanas</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Recuperado</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2024-03-22</TableCell>
                        <TableCell>Contractura gemelo</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Leve</Badge>
                        </TableCell>
                        <TableCell>1 semana</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Recuperado</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Anuncios Importantes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-semibold text-blue-800">Torneo Navideño 2024</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Se acerca nuestro tradicional torneo navideño. Inscripciones abiertas hasta el 20 de
                          diciembre.
                        </p>
                        <p className="text-xs text-blue-600 mt-2">Hace 2 horas</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-semibold text-green-800">Nueva Cancha Sintética</h4>
                        <p className="text-sm text-green-700 mt-1">
                          ¡Ya está lista nuestra nueva cancha sintética! Disponible para entrenamientos desde mañana.
                        </p>
                        <p className="text-xs text-green-600 mt-2">Hace 1 día</p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                        <h4 className="font-semibold text-yellow-800">Cambio de Horario</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          El entrenamiento del viernes se adelanta a las 15:00 por motivos climáticos.
                        </p>
                        <p className="text-xs text-yellow-600 mt-2">Hace 3 días</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Eventos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                        <Calendar className="h-8 w-8 text-purple-600" />
                        <div>
                          <h4 className="font-semibold">Cena de Fin de Año</h4>
                          <p className="text-sm text-gray-600">30 de Diciembre - 19:00</p>
                          <p className="text-xs text-purple-600">Club Social</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">Reunión de Padres</h4>
                          <p className="text-sm text-gray-600">15 de Enero - 18:00</p>
                          <p className="text-xs text-blue-600">Salón Principal</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                        <Trophy className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-semibold">Premiación 2024</h4>
                          <p className="text-sm text-gray-600">20 de Enero - 16:00</p>
                          <p className="text-xs text-green-600">Auditorio</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Chat del Equipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        E
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Elvis Rivas</p>
                        <p className="text-sm text-gray-600">¿Alguien sabe si hay entrenamiento mañana?</p>
                        <p className="text-xs text-gray-400">Hace 10 min</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        J
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Juan Pintado</p>
                        <p className="text-sm text-gray-600">Sí, a las 16:00 como siempre 👍</p>
                        <p className="text-xs text-gray-400">Hace 8 min</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        C
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Coach Carlos</p>
                        <p className="text-sm text-gray-600">Recuerden traer conos para el entrenamiento técnico ⚽</p>
                        <p className="text-xs text-gray-400">Hace 5 min</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Input placeholder="Escribe un mensaje..." className="flex-1" />
                    <Button>Enviar</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cumpleaños del Mes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                      <div className="text-2xl">🎂</div>
                      <div>
                        <p className="font-semibold">Kevin Muñoz</p>
                        <p className="text-sm text-gray-600">22 de Diciembre</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                      <div className="text-2xl">🎉</div>
                      <div>
                        <p className="font-semibold">Coach Ana García</p>
                        <p className="text-sm text-gray-600">28 de Diciembre</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Store Tab */}
          <TabsContent value="store">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tienda de la Academia</CardTitle>
                  <CardDescription>Equipamiento oficial y productos exclusivos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { name: "Camiseta Oficial 2024", price: 45000, image: "👕", category: "Uniformes" },
                      { name: "Pantaloneta de Entrenamiento", price: 25000, image: "🩳", category: "Uniformes" },
                      { name: "Medias Oficiales", price: 12000, image: "🧦", category: "Uniformes" },
                      { name: "Balón de Entrenamiento", price: 35000, image: "⚽", category: "Equipamiento" },
                      { name: "Botella de Agua", price: 15000, image: "🍼", category: "Accesorios" },
                      { name: "Mochila Academia", price: 55000, image: "🎒", category: "Accesorios" },
                    ].map((product, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="text-center mb-4">
                            <div className="text-6xl mb-2">{product.image}</div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <Badge variant="outline" className="mt-1">
                              {product.category}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">${product.price.toLocaleString()}</span>
                            <Button size="sm">
                              <DollarSign className="h-4 w-4 mr-1" />
                              Comprar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Marketplace - Intercambio</CardTitle>
                  <CardDescription>Compra y vende equipamiento usado entre jugadores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        seller: "Elvis Rivas",
                        item: "Guayos Nike Mercurial",
                        price: 80000,
                        condition: "Muy bueno",
                        size: "42",
                      },
                      {
                        seller: "Juan Pintado",
                        item: "Espinilleras Adidas",
                        price: 25000,
                        condition: "Bueno",
                        size: "M",
                      },
                      {
                        seller: "Mateo Ortega",
                        item: "Guantes de Portero",
                        price: 45000,
                        condition: "Excelente",
                        size: "L",
                      },
                    ].map((listing, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{listing.item}</h4>
                            <p className="text-sm text-gray-600">Vendido por: {listing.seller}</p>
                          </div>
                          <span className="text-lg font-bold text-green-600">${listing.price.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                          <Badge variant="outline">Talla {listing.size}</Badge>
                          <Badge variant="secondary">{listing.condition}</Badge>
                        </div>
                        <Button size="sm" className="w-full">
                          Contactar Vendedor
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mis Compras</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Camiseta Oficial 2024</TableCell>
                        <TableCell>2024-11-15</TableCell>
                        <TableCell>$45,000</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Entregado</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Balón de Entrenamiento</TableCell>
                        <TableCell>2024-12-01</TableCell>
                        <TableCell>$35,000</TableCell>
                        <TableCell>
                          <Badge variant="outline">En tránsito</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Profile Tab */}
          <TabsContent value="profile">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Información Personal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                          {userEmail.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-xl font-semibold">{localStorage.getItem("userName") || "Usuario"}</h3>
                        <p className="text-gray-600">{userEmail}</p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Posición Preferida:</label>
                          <p className="text-lg">Mediocampista</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Fecha de Ingreso:</label>
                          <p className="text-lg">15 de Enero, 2024</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Categoría:</label>
                          <p className="text-lg">Juvenil A</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Estado:</label>
                          <Badge className="ml-2 bg-green-100 text-green-800">Activo</Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Número de Camiseta:</label>
                          <p className="text-lg">#11</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Estadísticas de la Temporada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">8</div>
                          <div className="text-sm text-gray-600">Goles</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">12</div>
                          <div className="text-sm text-gray-600">Asistencias</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">15</div>
                          <div className="text-sm text-gray-600">Partidos</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">92%</div>
                          <div className="text-sm text-gray-600">Asistencia</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Nivel Técnico</span>
                            <span>85%</span>
                          </div>
                          <Progress value={85} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Condición Física</span>
                            <span>78%</span>
                          </div>
                          <Progress value={78} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Conocimiento Táctico</span>
                            <span>92%</span>
                          </div>
                          <Progress value={92} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Liderazgo</span>
                            <span>70%</span>
                          </div>
                          <Progress value={70} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Logros y Certificaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-8 w-8 text-yellow-600" />
                        <div>
                          <h4 className="font-semibold">Goleador del Mes</h4>
                          <p className="text-sm text-gray-600">Noviembre 2024</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">Asistencia Perfecta</h4>
                          <p className="text-sm text-gray-600">Octubre 2024</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <Star className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-semibold">Mejor Jugador</h4>
                          <p className="text-sm text-gray-600">vs Millonarios</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-purple-600" />
                        <div>
                          <h4 className="font-semibold">Capitán del Equipo</h4>
                          <p className="text-sm text-gray-600">Temporada 2024</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-3">
                        <Target className="h-8 w-8 text-red-600" />
                        <div>
                          <h4 className="font-semibold">Fair Play</h4>
                          <p className="text-sm text-gray-600">Sin tarjetas</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                          ?
                        </div>
                        <div>
                          <h4 className="font-semibold">Próximo Logro</h4>
                          <p className="text-sm text-gray-600">¡Sigue entrenando!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metas y Objetivos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Objetivos de la Temporada</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span>Marcar 10 goles</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Completado</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-5 w-5 border-2 border-blue-600 rounded-full"></div>
                            <span>Dar 15 asistencias</span>
                          </div>
                          <Badge variant="outline">12/15</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-5 w-5 border-2 border-yellow-600 rounded-full"></div>
                            <span>Mantener 95% asistencia</span>
                          </div>
                          <Badge variant="outline">92%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-5 w-5 border-2 border-purple-600 rounded-full"></div>
                            <span>Ser convocado a selección</span>
                          </div>
                          <Badge variant="outline">En progreso</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
