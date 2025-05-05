"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText, X, Upload, LinkIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export type FileItem = {
  id: string
  name: string
  type: string
  size?: number
  url?: string
  isLink?: boolean
}

interface FileUploadProps {
  onFilesChange: (files: FileItem[]) => void
  currentFiles?: FileItem[]
  maxFiles?: number
  acceptedTypes?: string
}

export function FileUpload({ onFilesChange, currentFiles = [], maxFiles = 10, acceptedTypes = "*" }: FileUploadProps) {
  const [files, setFiles] = useState<FileItem[]>(currentFiles)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkName, setLinkName] = useState("")
  const [showLinkForm, setShowLinkForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const newFiles: FileItem[] = []

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i]
      if (files.length + newFiles.length >= maxFiles) break

      newFiles.push({
        id: Date.now().toString() + i,
        name: file.name,
        type: file.type,
        size: file.size,
      })
    }

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)

    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleAddLink = () => {
    if (!linkUrl.trim() || !linkName.trim()) return

    const newLink: FileItem = {
      id: Date.now().toString(),
      name: linkName,
      type: "link",
      url: linkUrl,
      isLink: true,
    }

    const updatedFiles = [...files, newLink]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)

    // Reset form
    setLinkUrl("")
    setLinkName("")
    setShowLinkForm(false)
  }

  const handleRemoveFile = (id: string) => {
    const updatedFiles = files.filter((file) => file.id !== id)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {files.map((file) => (
          <div key={file.id} className="flex items-center p-2 border rounded-lg bg-background">
            {file.isLink ? (
              <LinkIcon className="h-4 w-4 mr-2 text-blue-500" />
            ) : (
              <FileText className="h-4 w-4 mr-2 text-gray-500" />
            )}
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            <button
              onClick={() => handleRemoveFile(file.id)}
              className="ml-2 text-gray-500 hover:text-red-500"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedTypes}
          className="hidden"
          multiple={maxFiles > 1}
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectFile}
            disabled={files.length >= maxFiles}
          >
            <Upload className="h-4 w-4 mr-2" />
            Subir archivo
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setShowLinkForm(!showLinkForm)}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Añadir enlace
          </Button>
        </div>

        {showLinkForm && (
          <div className="flex flex-col gap-2 p-3 border rounded-lg mt-2">
            <Input placeholder="Nombre del enlace" value={linkName} onChange={(e) => setLinkName(e.target.value)} />
            <Input placeholder="URL (https://...)" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowLinkForm(false)}>
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleAddLink}
                disabled={!linkUrl.trim() || !linkName.trim()}
                className="bg-rose-600 hover:bg-rose-700"
              >
                Añadir
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
