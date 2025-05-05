"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X } from "lucide-react"

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageDataUrl: string) => void
  className?: string
  size?: "sm" | "md" | "lg"
}

export function ImageUpload({ currentImage, onImageChange, className, size = "md" }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen válido.")
      return
    }

    // Crear URL de vista previa
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreviewUrl(result)
      onImageChange(result)
    }
    reader.readAsDataURL(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    onImageChange("")
  }

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={previewUrl || currentImage || "/placeholder.svg?height=96&width=96"} alt="Foto de perfil" />
          <AvatarFallback className="text-2xl">?</AvatarFallback>
        </Avatar>
        {(previewUrl || currentImage) && (
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Subir imagen"
      />
      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleButtonClick}>
        <Upload className="h-4 w-4 mr-2" />
        Cambiar foto
      </Button>
    </div>
  )
}
