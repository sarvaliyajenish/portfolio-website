import { useState, useRef } from 'react'
import { motion } from 'motion/react'
import { Upload, FileText, Download, X, Check } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { toast } from 'sonner'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface ResumeUploadProps {
  onResumeUploaded?: (url: string) => void;
  currentResumeUrl?: string;
}

export function ResumeUpload({ onResumeUploaded, currentResumeUrl }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState(currentResumeUrl || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-654b3b0b/upload-resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setUploadedResumeUrl(data.url)
        onResumeUploaded?.(data.url)
        toast.success("Resume uploaded successfully!")
      } else {
        const error = await response.text()
        toast.error(`Upload failed: ${error}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error("Failed to upload resume. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveResume = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-654b3b0b/remove-resume`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setUploadedResumeUrl("")
        onResumeUploaded?.("")
        toast.success("Resume removed successfully!")
      } else {
        toast.error("Failed to remove resume")
      }
    } catch (error) {
      console.error('Remove error:', error)
      toast.error("Failed to remove resume")
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg mb-2">Resume Management</h3>
          <p className="text-muted-foreground text-sm">
            Upload your resume to make it available for download
          </p>
        </div>

        {!uploadedResumeUrl ? (
          <motion.div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="space-y-4">
              <motion.div
                animate={{ rotate: isUploading ? 360 : 0 }}
                transition={{ duration: 1, repeat: isUploading ? Infinity : 0 }}
              >
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              </motion.div>
              
              <div>
                <p className="text-lg mb-2">
                  {isUploading ? 'Uploading...' : 'Drop your resume here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports PDF, DOC, DOCX (max 5MB)
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 border border-primary/20 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm">Resume uploaded successfully</p>
                  <p className="text-xs text-muted-foreground">Ready for download</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(uploadedResumeUrl, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRemoveResume}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {uploadedResumeUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Button
              variant="outline"
              onClick={triggerFileInput}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New Resume
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </motion.div>
        )}
      </div>
    </Card>
  )
}