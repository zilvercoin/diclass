"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download, ExternalLink, FileText, ImageIcon, File } from "lucide-react"
import type { FileItem } from "./file-upload"

interface FileViewerProps {
  file: FileItem | null
  onClose: () => void
}

export function FileViewer({ file, onClose }: FileViewerProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(!!file)
  }, [file])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  if (!file) return null

  const isImage = file.type?.startsWith("image/") || file.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  const isPDF = file.type === "application/pdf" || file.name?.endsWith(".pdf")
  const isLink = file.isLink && file.url

  const getFileIcon = () => {
    if (isImage) return <ImageIcon className="h-16 w-16 text-gray-400" />
    if (isPDF) return <FileText className="h-16 w-16 text-gray-400" />
    return <File className="h-16 w-16 text-gray-400" />
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{file.name}</span>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-4">
          {isLink ? (
            <div className="flex flex-col items-center gap-4">
              <ExternalLink className="h-16 w-16 text-blue-500" />
              <p>Este es un enlace externo</p>
              <Button asChild>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Abrir enlace
                </a>
              </Button>
            </div>
          ) : isImage && file.url ? (
            <img
              src={file.url || "/placeholder.svg"}
              alt={file.name}
              className="max-w-full max-h-[70vh] object-contain"
            />
          ) : isPDF && file.url ? (
            <iframe src={file.url} title={file.name} className="w-full h-[70vh] border-0" />
          ) : (
            <div className="flex flex-col items-center gap-4">
              {getFileIcon()}
              <p>No se puede previsualizar este tipo de archivo</p>
              {file.url && (
                <Button asChild>
                  <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" /> Descargar archivo
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
