import { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  onImageRemove?: () => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

export function ImageUpload({ 
  currentImage, 
  onImageChange, 
  onImageRemove, 
  className = '', 
  placeholder = 'Upload image or enter URL',
  disabled = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a JPEG, PNG, WebP, or GIF image.')
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB.')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-654b3b0b/upload-image`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: formData,
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Upload failed')
      }

      const result = await response.json()
      onImageChange(result.url)
    } catch (error) {
      console.error('Image upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUrlSubmit = () => {
    if (urlValue.trim()) {
      onImageChange(urlValue.trim())
      setUrlValue('')
      setShowUrlInput(false)
    }
  }

  const handleRemove = () => {
    if (onImageRemove) {
      onImageRemove()
    } else {
      onImageChange('')
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Current Image Preview */}
      {currentImage && (
        <div className="relative">
          <ImageWithFallback
            src={currentImage}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border"
          />
          <Button
            onClick={handleRemove}
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 h-6 w-6 rounded-full p-0"
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Options */}
      {!currentImage && (
        <div className="space-y-2">
          {/* File Upload */}
          <div className="flex space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileUpload}
              className="hidden"
              disabled={disabled || isUploading}
            />

            

          </div>

          {/* URL Input */}
          {showUrlInput && (
            <div className="flex space-x-2">
              <Input
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="Enter image URL"
                className="flex-1"
                disabled={disabled}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlSubmit()
                  }
                }}
              />
              <Button
                onClick={handleUrlSubmit}
                size="sm"
                disabled={disabled || !urlValue.trim()}
              >
                Add
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <p className="text-sm text-destructive">{uploadError}</p>
      )}

      {/* Help Text */}
      {!currentImage && !showUrlInput && (
        <p className="text-xs text-muted-foreground">
          Supports JPEG, PNG, WebP, GIF up to 10MB
        </p>
      )}
    </div>
  )
}