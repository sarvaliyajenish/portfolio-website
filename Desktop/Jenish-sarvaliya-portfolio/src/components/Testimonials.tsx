import { useRef, useState, useMemo } from 'react'
import { motion, useInView } from 'motion/react'
import { ChevronLeft, ChevronRight, Star, Quote, Edit3, Save, X, Plus, Trash2, Upload } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { ImageUpload } from './ImageUpload'
import { portfolioConfig } from '../config/portfolio'

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    testimonials: [...portfolioConfig.testimonials],
    title: 'What People Say',
    description: 'Building relationships and delivering results. Here\'s what clients and colleagues have to say about working together.'
  })
  
  const testimonials = useMemo(() => 
    isEditing ? editedData.testimonials : portfolioConfig.testimonials,
    [isEditing, editedData.testimonials]
  )

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
  }

  const handleSave = () => {
    // Update the config (in a real app, this would persist to backend)
    portfolioConfig.testimonials = editedData.testimonials
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData({
      testimonials: [...portfolioConfig.testimonials],
      title: 'What People Say',
      description: 'Building relationships and delivering results. Here\'s what clients and colleagues have to say about working together.'
    })
    setIsEditing(false)
  }

  const updateTestimonial = (index: number, field: string, value: string | number) => {
    setEditedData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial, i) => 
        i === index ? { ...testimonial, [field]: value } : testimonial
      )
    }))
  }

  const addTestimonial = () => {
    const newId = Math.max(...editedData.testimonials.map(t => t.id)) + 1
    const newTestimonial = {
      id: newId,
      name: "New Client",
      role: "Position",
      company: "Company Name",
      avatar: "/api/placeholder/64/64",
      rating: 5,
      content: "Your testimonial content goes here...",
      project: "Project Name"
    }
    
    setEditedData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, newTestimonial]
    }))
  }

  const removeTestimonial = (index: number) => {
    if (editedData.testimonials.length <= 1) return // Keep at least one testimonial
    
    setEditedData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }))
    
    // Adjust current index if needed
    if (currentIndex >= editedData.testimonials.length - 1) {
      setCurrentIndex(Math.max(0, editedData.testimonials.length - 2))
    }
  }

  const handleImageUpload = (index: number, imageUrl: string) => {
    updateTestimonial(index, 'avatar', imageUrl)
  }

  const renderStarRating = (testimonial: any, index: number) => {
    if (!isEditing) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mb-6"
        >
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
            >
              <Star className="h-5 w-5 fill-[var(--neon-green)] text-[var(--neon-green)] mx-0.5" />
            </motion.div>
          ))}
        </motion.div>
      )
    }

    return (
      <div className="flex justify-center mb-6 space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => updateTestimonial(index, 'rating', star)}
            className="p-1"
          >
            <Star 
              className={`h-5 w-5 transition-colors ${
                star <= testimonial.rating 
                  ? 'fill-[var(--neon-green)] text-[var(--neon-green)]' 
                  : 'text-muted-foreground'
              }`} 
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <section id="testimonials" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Edit Controls */}
      {!isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end mb-4"
        >
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Testimonials</span>
          </Button>
        </motion.div>
      )}

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end space-x-2 mb-4"
        >
          <Button
            onClick={handleCancel}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="flex items-center space-x-2 bg-[var(--neon-green)] hover:bg-[var(--neon-green)]/80 text-black"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={editedData.title}
              onChange={(e) => setEditedData(prev => ({ ...prev, title: e.target.value }))}
              className="text-4xl md:text-6xl font-bold text-center bg-transparent border-dashed"
              placeholder="Section title"
            />
            <Textarea
              value={editedData.description}
              onChange={(e) => setEditedData(prev => ({ ...prev, description: e.target.value }))}
              className="text-xl text-center bg-transparent border-dashed resize-none"
              placeholder="Section description"
              rows={3}
            />
          </div>
        ) : (
          <>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              What People <span className="gradient-text">Say</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Building relationships and delivering results. Here's what clients and colleagues 
              have to say about working together.
            </p>
          </>
        )}
      </motion.div>

      <div className="relative">
        {/* Main Testimonial Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative overflow-hidden"
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="w-full flex-shrink-0">
                <Card className="max-w-4xl mx-auto p-8 md:p-12 relative">
                  {/* Edit/Delete Controls for individual testimonials */}
                  {isEditing && (
                    <div className="absolute top-4 right-4 flex space-x-2">
                      {editedData.testimonials.length > 1 && (
                        <Button
                          onClick={() => removeTestimonial(index)}
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Quote Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute top-6 left-6 w-12 h-12 bg-gradient-to-br from-[var(--neon-green)] to-[var(--electric-blue)] rounded-full flex items-center justify-center"
                  >
                    <Quote className="h-6 w-6 text-white" />
                  </motion.div>

                  <div className="pt-8">
                    {/* Stars */}
                    {renderStarRating(testimonial, index)}

                    {/* Content */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="mb-8"
                    >
                      {isEditing ? (
                        <Textarea
                          value={testimonial.content}
                          onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                          className="text-lg md:text-xl text-center leading-relaxed italic bg-transparent border-dashed resize-none"
                          placeholder="Testimonial content"
                          rows={4}
                        />
                      ) : (
                        <blockquote className="text-lg md:text-xl text-center leading-relaxed italic">
                          "{testimonial.content}"
                        </blockquote>
                      )}
                    </motion.div>

                    {/* Author Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Avatar with Upload */}
                        <div className="relative">
                          <Avatar className="w-16 h-16 border-2 border-[var(--electric-blue)]">
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback className="bg-gradient-to-br from-[var(--neon-green)] to-[var(--electric-blue)] text-white font-bold">
                              {testimonial.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {isEditing && (
                            <div className="absolute -bottom-2 -right-2">
                              <ImageUpload
                                onImageUpload={(url) => handleImageUpload(index, url)}
                                className="w-6 h-6 rounded-full bg-[var(--electric-blue)] text-white p-1"
                              >
                                <Upload className="h-3 w-3" />
                              </ImageUpload>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-center md:text-left space-y-1">
                          {isEditing ? (
                            <>
                              <Input
                                value={testimonial.name}
                                onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                className="font-bold text-lg bg-transparent border-dashed text-center md:text-left"
                                placeholder="Client name"
                              />
                              <Input
                                value={testimonial.role}
                                onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                                className="text-[var(--electric-blue)] font-medium bg-transparent border-dashed text-center md:text-left"
                                placeholder="Role/Position"
                              />
                              <Input
                                value={testimonial.company}
                                onChange={(e) => updateTestimonial(index, 'company', e.target.value)}
                                className="text-muted-foreground bg-transparent border-dashed text-center md:text-left"
                                placeholder="Company"
                              />
                            </>
                          ) : (
                            <>
                              <div className="font-bold text-lg">{testimonial.name}</div>
                              <div className="text-[var(--electric-blue)] font-medium">{testimonial.role}</div>
                              <div className="text-muted-foreground">{testimonial.company}</div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="hidden md:block w-px h-12 bg-border" />
                      
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Project</div>
                        {isEditing ? (
                          <Input
                            value={testimonial.project}
                            onChange={(e) => updateTestimonial(index, 'project', e.target.value)}
                            className="font-medium text-[var(--coral)] bg-transparent border-dashed text-center"
                            placeholder="Project name"
                          />
                        ) : (
                          <div className="font-medium text-[var(--coral)]">{testimonial.project}</div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Add New Testimonial Button */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-6"
          >
            <Button
              onClick={addTestimonial}
              variant="outline"
              className="flex items-center space-x-2 border-dashed border-2 hover:bg-[var(--neon-green)]/10 hover:border-[var(--neon-green)]"
            >
              <Plus className="h-4 w-4" />
              <span>Add Testimonial</span>
            </Button>
          </motion.div>
        )}

        {/* Navigation Controls */}
        {testimonials.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-center mt-8 space-x-4"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="w-10 h-10 p-0 rounded-full hover:bg-[var(--electric-blue)] hover:text-white hover:border-[var(--electric-blue)]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-[var(--electric-blue)] scale-110'
                      : 'bg-muted hover:bg-[var(--electric-blue)]/50'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="w-10 h-10 p-0 rounded-full hover:bg-[var(--electric-blue)] hover:text-white hover:border-[var(--electric-blue)]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-[var(--neon-green)] rounded-full opacity-5 blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-[var(--electric-blue)] rounded-full opacity-5 blur-3xl"
        />
      </div>
    </section>
  )
}