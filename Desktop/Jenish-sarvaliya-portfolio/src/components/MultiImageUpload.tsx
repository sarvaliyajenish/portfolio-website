import { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface MultiImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  className?: string
  disabled?: boolean
  maxImages?: number
}

export function MultiImageUpload({ 
  images, 
  onImagesChange, 
  className = '', 
  disabled = false,
  maxImages = 10
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      setUploadError(`Cannot upload more than ${maxImages} images total.`)
      return
    }

    // Validate file types and sizes
    for (const file of files) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Please upload only JPEG, PNG, WebP, or GIF images.')
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Each file must be less than 10MB.')
        return
      }
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const uploadPromises = files.map(async (file) => {
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
          throw new Error(`${file.name}: ${errorText}`)
        }

        const result = await response.json()
        return result.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      onImagesChange([...images, ...uploadedUrls])
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
      if (images.length >= maxImages) {
        setUploadError(`Cannot add more than ${maxImages} images.`)
        return
      }
      onImagesChange([...images, urlValue.trim()])
      setUrlValue('')
      setShowUrlInput(false)
      setUploadError(null)
    }
  }

  const removeImage = (indexToRemove: number) => {
    onImagesChange(images.filter((_, index) => index !== indexToRemove))
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <ImageWithFallback
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-1">
                {index > 0 && (
                  <Button
                    onClick={() => moveImage(index, index - 1)}
                    size="sm"
                    variant="secondary"
                    className="h-6 w-6 rounded-full p-0"
                    disabled={disabled}
                  >
                    ←
                  </Button>
                )}
                <Button
                  onClick={() => removeImage(index)}
                  size="sm"
                  variant="destructive"
                  className="h-6 w-6 rounded-full p-0"
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
                {index < images.length - 1 && (
                  <Button
                    onClick={() => moveImage(index, index + 1)}
                    size="sm"
                    variant="secondary"
                    className="h-6 w-6 rounded-full p-0"
                    disabled={disabled}
                  >
                    →
                  </Button>
                )}
              </div>
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Images */}
      {images.length < maxImages && (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={disabled || isUploading}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              disabled={disabled || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Images
                </>
              )}
            </Button>
            
            <Button
              onClick={() => setShowUrlInput(!showUrlInput)}
              variant="outline"
              size="sm"
              disabled={disabled}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
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
      <div className="text-xs text-muted-foreground space-y-1">
        <p>Upload multiple images or add URLs. First image will be the main image.</p>
        <p>Supports JPEG, PNG, WebP, GIF up to 10MB each. Maximum {maxImages} images.</p>
        {images.length > 0 && (
          <p>Use arrow buttons to reorder images. The first image is used as the main project image.</p>
        )}
      </div>
    </div>
  )
}