// Sistema de gestión de clases
import type { User } from "./auth"

export type Class = {
  id: string
  title: string
  section: string
  subject: string
  description?: string
  teacherId: string
  teacherName: string
  color: string
  code: string
  students: number
  createdAt: string
  archived?: boolean
}

export type ClassEnrollment = {
  id: string
  classId: string
  studentId: string
  joinedAt: string
}

export type Assignment = {
  id: string
  classId: string
  title: string
  description: string
  dueDate: string
  dueTime?: string
  points: string
  createdAt: string
  materials?: AssignmentMaterial[]
}

export type AssignmentMaterial = {
  id: string
  name: string
  type: string
  url?: string
  size?: number
}

export type Submission = {
  id: string
  assignmentId: string
  studentId: string
  status: "submitted" | "late" | "missing" | "graded"
  submittedAt: string
  files: SubmissionFile[]
  grade?: string
  feedback?: string
}

export type SubmissionFile = {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
}

export type Comment = {
  id: string
  type: "assignment" | "announcement"
  referenceId: string // ID de la tarea o anuncio
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
}

export type Announcement = {
  id: string
  classId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
  materials?: AssignmentMaterial[]
}

// Funciones para gestionar clases
export function getClasses(): Class[] {
  if (typeof window === "undefined") return []

  const savedClasses = localStorage.getItem("diclass_classes")
  return savedClasses ? JSON.parse(savedClasses) : []
}

export function getClassById(id: string): Class | null {
  const classes = getClasses()
  return classes.find((c) => c.id === id) || null
}

export function getClassByCode(code: string): Class | null {
  const classes = getClasses()
  return classes.find((c) => c.code === code) || null
}

export function createClass(classData: Omit<Class, "id" | "students" | "createdAt">): Class {
  const newClass: Class = {
    ...classData,
    id: Date.now().toString(),
    students: 0,
    createdAt: new Date().toISOString(),
  }

  const classes = getClasses()
  const updatedClasses = [...classes, newClass]

  localStorage.setItem("diclass_classes", JSON.stringify(updatedClasses))
  return newClass
}

export function updateClass(id: string, classData: Partial<Class>): Class | null {
  const classes = getClasses()
  const classIndex = classes.findIndex((c) => c.id === id)

  if (classIndex === -1) return null

  const updatedClass = { ...classes[classIndex], ...classData }
  classes[classIndex] = updatedClass

  localStorage.setItem("diclass_classes", JSON.stringify(classes))
  return updatedClass
}

export function deleteClass(id: string): boolean {
  const classes = getClasses()
  const filteredClasses = classes.filter((c) => c.id !== id)

  if (filteredClasses.length === classes.length) return false

  localStorage.setItem("diclass_classes", JSON.stringify(filteredClasses))
  return true
}

export function archiveClass(id: string): Class | null {
  return updateClass(id, { archived: true })
}

// Funciones para gestionar inscripciones
export function getEnrollments(): ClassEnrollment[] {
  if (typeof window === "undefined") return []

  const savedEnrollments = localStorage.getItem("diclass_enrollments")
  return savedEnrollments ? JSON.parse(savedEnrollments) : []
}

export function getEnrollmentsByClassId(classId: string): ClassEnrollment[] {
  const enrollments = getEnrollments()
  return enrollments.filter((e) => e.classId === classId)
}

export function getEnrollmentsByStudentId(studentId: string): ClassEnrollment[] {
  const enrollments = getEnrollments()
  return enrollments.filter((e) => e.studentId === studentId)
}

export function enrollStudentInClass(classId: string, studentId: string): ClassEnrollment | null {
  // Verificar si la clase existe
  const classObj = getClassById(classId)
  if (!classObj) return null

  // Verificar si el estudiante ya está inscrito
  const enrollments = getEnrollments()
  if (enrollments.some((e) => e.classId === classId && e.studentId === studentId)) {
    return null
  }

  // Crear nueva inscripción
  const newEnrollment: ClassEnrollment = {
    id: Date.now().toString(),
    classId,
    studentId,
    joinedAt: new Date().toISOString(),
  }

  // Actualizar inscripciones
  const updatedEnrollments = [...enrollments, newEnrollment]
  localStorage.setItem("diclass_enrollments", JSON.stringify(updatedEnrollments))

  // Actualizar contador de estudiantes en la clase
  updateClass(classId, { students: (classObj.students || 0) + 1 })

  return newEnrollment
}

export function unenrollStudentFromClass(classId: string, studentId: string): boolean {
  const enrollments = getEnrollments()
  const filteredEnrollments = enrollments.filter((e) => !(e.classId === classId && e.studentId === studentId))

  if (filteredEnrollments.length === enrollments.length) return false

  localStorage.setItem("diclass_enrollments", JSON.stringify(filteredEnrollments))

  // Actualizar contador de estudiantes en la clase
  const classObj = getClassById(classId)
  if (classObj && classObj.students > 0) {
    updateClass(classId, { students: classObj.students - 1 })
  }

  return true
}

// Funciones para gestionar tareas
export function getAssignments(): Assignment[] {
  if (typeof window === "undefined") return []

  const savedAssignments = localStorage.getItem("diclass_assignments")
  return savedAssignments ? JSON.parse(savedAssignments) : []
}

export function getAssignmentsByClassId(classId: string): Assignment[] {
  const assignments = getAssignments()
  return assignments.filter((a) => a.classId === classId)
}

export function getAssignmentById(id: string): Assignment | null {
  const assignments = getAssignments()
  return assignments.find((a) => a.id === id) || null
}

export function createAssignment(assignmentData: Omit<Assignment, "id" | "createdAt">): Assignment {
  const newAssignment: Assignment = {
    ...assignmentData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  const assignments = getAssignments()
  const updatedAssignments = [...assignments, newAssignment]

  localStorage.setItem("diclass_assignments", JSON.stringify(updatedAssignments))
  return newAssignment
}

export function updateAssignment(id: string, assignmentData: Partial<Assignment>): Assignment | null {
  const assignments = getAssignments()
  const assignmentIndex = assignments.findIndex((a) => a.id === id)

  if (assignmentIndex === -1) return null

  const updatedAssignment = { ...assignments[assignmentIndex], ...assignmentData }
  assignments[assignmentIndex] = updatedAssignment

  localStorage.setItem("diclass_assignments", JSON.stringify(assignments))
  return updatedAssignment
}

export function deleteAssignment(id: string): boolean {
  const assignments = getAssignments()
  const filteredAssignments = assignments.filter((a) => a.id !== id)

  if (filteredAssignments.length === assignments.length) return false

  localStorage.setItem("diclass_assignments", JSON.stringify(filteredAssignments))
  return true
}

// Funciones para gestionar entregas
export function getSubmissions(): Submission[] {
  if (typeof window === "undefined") return []

  const savedSubmissions = localStorage.getItem("diclass_submissions")
  return savedSubmissions ? JSON.parse(savedSubmissions) : []
}

export function getSubmissionsByAssignmentId(assignmentId: string): Submission[] {
  const submissions = getSubmissions()
  return submissions.filter((s) => s.assignmentId === assignmentId)
}

export function getSubmissionsByStudentId(studentId: string): Submission[] {
  const submissions = getSubmissions()
  return submissions.filter((s) => s.studentId === studentId)
}

export function getSubmissionByAssignmentAndStudent(assignmentId: string, studentId: string): Submission | null {
  const submissions = getSubmissions()
  return submissions.find((s) => s.assignmentId === assignmentId && s.studentId === studentId) || null
}

export function createSubmission(submissionData: Omit<Submission, "id">): Submission {
  const newSubmission: Submission = {
    ...submissionData,
    id: Date.now().toString(),
  }

  const submissions = getSubmissions()
  const updatedSubmissions = [...submissions, newSubmission]

  localStorage.setItem("diclass_submissions", JSON.stringify(updatedSubmissions))
  return newSubmission
}

export function updateSubmission(id: string, submissionData: Partial<Submission>): Submission | null {
  const submissions = getSubmissions()
  const submissionIndex = submissions.findIndex((s) => s.id === id)

  if (submissionIndex === -1) return null

  const updatedSubmission = { ...submissions[submissionIndex], ...submissionData }
  submissions[submissionIndex] = updatedSubmission

  localStorage.setItem("diclass_submissions", JSON.stringify(submissions))
  return updatedSubmission
}

// Funciones para gestionar comentarios
export function getComments(): Comment[] {
  if (typeof window === "undefined") return []

  const savedComments = localStorage.getItem("diclass_comments")
  return savedComments ? JSON.parse(savedComments) : []
}

export function getCommentsByReference(type: "assignment" | "announcement", referenceId: string): Comment[] {
  const comments = getComments()
  return comments.filter((c) => c.type === type && c.referenceId === referenceId)
}

export function createComment(commentData: Omit<Comment, "id" | "createdAt">): Comment {
  const newComment: Comment = {
    ...commentData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  const comments = getComments()
  const updatedComments = [...comments, newComment]

  localStorage.setItem("diclass_comments", JSON.stringify(updatedComments))
  return newComment
}

// Funciones para gestionar anuncios
export function getAnnouncements(): Announcement[] {
  if (typeof window === "undefined") return []

  const savedAnnouncements = localStorage.getItem("diclass_announcements")
  return savedAnnouncements ? JSON.parse(savedAnnouncements) : []
}

export function getAnnouncementsByClassId(classId: string): Announcement[] {
  const announcements = getAnnouncements()
  return announcements.filter((a) => a.classId === classId)
}

export function createAnnouncement(announcementData: Omit<Announcement, "id" | "createdAt">): Announcement {
  const newAnnouncement: Announcement = {
    ...announcementData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  const announcements = getAnnouncements()
  const updatedAnnouncements = [...announcements, newAnnouncement]

  localStorage.setItem("diclass_announcements", JSON.stringify(updatedAnnouncements))
  return newAnnouncement
}

// Función para obtener las clases de un estudiante
export function getStudentClasses(studentId: string): Class[] {
  const enrollments = getEnrollmentsByStudentId(studentId)
  const classes = getClasses()

  return enrollments
    .map((enrollment) => classes.find((c) => c.id === enrollment.classId))
    .filter((c): c is Class => c !== undefined)
}

// Función para obtener las clases de un profesor
export function getTeacherClasses(teacherId: string): Class[] {
  const classes = getClasses()
  return classes.filter((c) => c.teacherId === teacherId)
}

// Función para obtener los estudiantes de una clase
export function getClassStudents(classId: string): User[] {
  const enrollments = getEnrollmentsByClassId(classId)
  const users = getAllUsers()

  return enrollments
    .map((enrollment) => users.find((u) => u.id === enrollment.studentId))
    .filter((u): u is User => u !== undefined && u.role === "student")
}

// Importar función de getAllUsers desde auth
import { getAllUsers } from "./auth"
