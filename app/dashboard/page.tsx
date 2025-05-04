"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Clock, Users } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function DashboardPage() {
  const [open, setOpen] = useState(false)
  const [className, setClassName] = useState("")
  const [section, setSection] = useState("")
  const [subject, setSubject] = useState("")

  const handleCreateClass = () => {
    // Simulación de creación de clase
    setOpen(false)
    // Aquí iría la lógica para crear una nueva clase
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <DashboardShell>
        <Tabs defaultValue="enrolled" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="enrolled">Mis Clases</TabsTrigger>
              <TabsTrigger value="teaching">Impartiendo</TabsTrigger>
              <TabsTrigger value="archived">Archivadas</TabsTrigger>
            </TabsList>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-rose-600 hover:bg-rose-700">
                  <Plus className="mr-2 h-4 w-4" /> Crear Clase
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear una nueva clase</DialogTitle>
                  <DialogDescription>Completa los detalles para crear una nueva clase.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre de la clase</Label>
                    <Input
                      id="name"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="Ej. Matemáticas Avanzadas"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="section">Sección</Label>
                    <Input
                      id="section"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      placeholder="Ej. Periodo 3"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Asignatura</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Ej. Matemáticas"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleCreateClass}>
                    Crear
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <TabsContent value="enrolled" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ClassCard
                title="Matemáticas Avanzadas"
                teacher="Prof. García"
                image="/placeholder.svg?height=200&width=400"
                color="bg-blue-100"
                href="/class/1"
              />
              <ClassCard
                title="Historia Contemporánea"
                teacher="Prof. Rodríguez"
                image="/placeholder.svg?height=200&width=400"
                color="bg-green-100"
                href="/class/2"
              />
              <ClassCard
                title="Física Cuántica"
                teacher="Prof. Martínez"
                image="/placeholder.svg?height=200&width=400"
                color="bg-purple-100"
                href="/class/3"
              />
              <ClassCard
                title="Literatura Universal"
                teacher="Prof. López"
                image="/placeholder.svg?height=200&width=400"
                color="bg-yellow-100"
                href="/class/4"
              />
            </div>
          </TabsContent>
          <TabsContent value="teaching" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ClassCard
                title="Programación Avanzada"
                teacher="Tú"
                image="/placeholder.svg?height=200&width=400"
                color="bg-rose-100"
                href="/class/5"
              />
              <ClassCard
                title="Diseño Web"
                teacher="Tú"
                image="/placeholder.svg?height=200&width=400"
                color="bg-indigo-100"
                href="/class/6"
              />
            </div>
          </TabsContent>
          <TabsContent value="archived" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ClassCard
                title="Álgebra Lineal"
                teacher="Prof. Sánchez"
                image="/placeholder.svg?height=200&width=400"
                color="bg-gray-100"
                href="/class/7"
              />
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Próximas Entregas</h2>
          <div className="space-y-4">
            <AssignmentCard
              title="Ensayo sobre la Segunda Guerra Mundial"
              className="Historia Contemporánea"
              dueDate="15 de mayo, 2024"
              href="/assignment/1"
            />
            <AssignmentCard
              title="Problemas de Ecuaciones Diferenciales"
              className="Matemáticas Avanzadas"
              dueDate="18 de mayo, 2024"
              href="/assignment/2"
            />
            <AssignmentCard
              title="Proyecto Final de Programación"
              className="Programación Avanzada"
              dueDate="25 de mayo, 2024"
              href="/assignment/3"
            />
          </div>
        </div>
      </DashboardShell>
    </div>
  )
}

function ClassCard({
  title,
  teacher,
  image,
  color,
  href,
}: { title: string; teacher: string; image: string; color: string; href: string }) {
  return (
    <Link href={href}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className={`h-24 ${color}`} />
        <CardHeader className="pb-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{teacher}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="mr-1 h-4 w-4" /> 24 estudiantes
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="text-rose-600">
            Ver clase
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

function AssignmentCard({
  title,
  className,
  dueDate,
  href,
}: { title: string; className: string; dueDate: string; href: string }) {
  return (
    <Link href={href}>
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{className}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-1 h-4 w-4" /> Fecha de entrega: {dueDate}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
