import { useState, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { ExternalLink, Github, X, ChevronLeft, ChevronRight, Edit, Save, XCircle, Plus, Trash2 } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Dialog, DialogContent } from './ui/dialog'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { ImageUpload } from './ImageUpload'
import { MultiImageUpload } from './MultiImageUpload'
import { portfolioConfig } from '../config/portfolio'

const projects = portfolioConfig.projects

const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))]

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    title: 'Featured Work',
    description: 'A collection of projects that showcase my approach to solving complex design challenges through user-centered thinking and creative problem-solving.',
    projects: [...portfolioConfig.projects],
    customCategories: [...Array.from(new Set(projects.map(p => p.category)))]
  })

  // Current data for display (either original or edited)
  const currentData = isEditing ? editedData : {
    title: 'Featured Work',
    description: 'A collection of projects that showcase my approach to solving complex design challenges through user-centered thinking and creative problem-solving.',
    projects: portfolioConfig.projects,
    customCategories: Array.from(new Set(projects.map(p => p.category)))
  }

  const currentCategories = ['All', ...currentData.customCategories]
  const filteredProjects = selectedCategory === 'All' 
    ? currentData.projects 
    : currentData.projects.filter(project => project.category === selectedCategory)

  // Helper functions for editing
  const handleSave = () => {
    // In a real app, this would save to a backend/database
    console.log('Saving portfolio data:', editedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData({
      title: 'Featured Work',
      description: 'A collection of projects that showcase my approach to solving complex design challenges through user-centered thinking and creative problem-solving.',
      projects: [...portfolioConfig.projects],
      customCategories: [...Array.from(new Set(projects.map(p => p.category)))]
    })
    setIsEditing(false)
  }

  const addProject = () => {
    const defaultImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
    const newProject = {
      id: Date.now(),
      title: 'New Project',
      category: currentData.customCategories[0] || 'Web Design',
      description: 'Project description goes here...',
      image: defaultImage,
      tags: ['New Tag'],
      liveUrl: '',
      githubUrl: '',
      details: {
        challenge: 'Describe the challenge you solved...',
        solution: 'Explain your solution approach...',
        result: 'Share the results and impact...',
        timeline: '2 months',
        role: 'Designer',
        images: [defaultImage]
      }
    }
    setEditedData({
      ...editedData,
      projects: [...editedData.projects, newProject]
    })
  }

  const removeProject = (projectId: number) => {
    setEditedData({
      ...editedData,
      projects: editedData.projects.filter(p => p.id !== projectId)
    })
  }

  const updateProject = (projectId: number, field: string, value: any) => {
    setEditedData({
      ...editedData,
      projects: editedData.projects.map(project =>
        project.id === projectId ? { ...project, [field]: value } : project
      )
    })
    
    // Update selected project if it's currently open
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({
        ...selectedProject,
        [field]: value
      })
    }
  }

  const updateProjectDetail = (projectId: number, field: string, value: any) => {
    setEditedData({
      ...editedData,
      projects: editedData.projects.map(project => {
        if (project.id === projectId) {
          const updatedProject = { ...project, details: { ...project.details, [field]: value } }
          
          // If updating images array, also update the main project image to be the first image
          if (field === 'images' && Array.isArray(value) && value.length > 0) {
            updatedProject.image = value[0]
          }
          
          return updatedProject
        }
        return project
      })
    })
    
    // Update selected project if it's currently open
    if (selectedProject && selectedProject.id === projectId) {
      const updatedDetails = { ...selectedProject.details, [field]: value }
      let updatedSelectedProject = {
        ...selectedProject,
        details: updatedDetails
      }
      
      // If updating images array, also update the main project image
      if (field === 'images' && Array.isArray(value) && value.length > 0) {
        updatedSelectedProject.image = value[0]
      }
      
      setSelectedProject(updatedSelectedProject)
    }
  }

  const addCategory = () => {
    const newCategory = `Category ${editedData.customCategories.length + 1}`
    setEditedData({
      ...editedData,
      customCategories: [...editedData.customCategories, newCategory]
    })
  }

  const removeCategory = (categoryToRemove: string) => {
    setEditedData({
      ...editedData,
      customCategories: editedData.customCategories.filter(cat => cat !== categoryToRemove),
      projects: editedData.projects.map(project =>
        project.category === categoryToRemove 
          ? { ...project, category: editedData.customCategories[0] || 'Web Design' }
          : project
      )
    })
  }

  const updateCategory = (oldCategory: string, newCategory: string) => {
    setEditedData({
      ...editedData,
      customCategories: editedData.customCategories.map(cat => 
        cat === oldCategory ? newCategory : cat
      ),
      projects: editedData.projects.map(project =>
        project.category === oldCategory 
          ? { ...project, category: newCategory }
          : project
      )
    })
  }

  const addTag = (projectId: number, tag: string) => {
    if (!tag.trim()) return
    setEditedData({
      ...editedData,
      projects: editedData.projects.map(project =>
        project.id === projectId 
          ? { ...project, tags: [...project.tags, tag.trim()] }
          : project
      )
    })
  }

  const removeTag = (projectId: number, tagToRemove: string) => {
    setEditedData({
      ...editedData,
      projects: editedData.projects.map(project =>
        project.id === projectId 
          ? { ...project, tags: project.tags.filter(tag => tag !== tagToRemove) }
          : project
      )
    })
  }

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => 
        prev === selectedProject.details.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProject.details.images.length - 1 : prev - 1
      )
    }
  }

  return (
    <section id="portfolio" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Edit Controls */}
      <div className="flex justify-end mb-4">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Portfolio
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        {!isEditing ? (
          <>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              {currentData.title.split(' ')[0]} <span className="gradient-text">{currentData.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {currentData.description}
            </p>
          </>
        ) : (
          <>
            <Input
              value={editedData.title}
              onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
              className="text-4xl md:text-6xl font-bold mb-6 text-center bg-transparent border-muted text-center"
              placeholder="Portfolio section title"
            />
            <Textarea
              value={editedData.description}
              onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
              className="text-xl text-muted-foreground max-w-3xl mx-auto bg-transparent border-muted text-center resize-none"
              rows={3}
              placeholder="Portfolio section description"
            />
          </>
        )}
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4 mb-12"
      >
        {currentCategories.map((category) => (
          <div key={category} className="relative">
            {!isEditing ? (
              <Button
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[var(--neon-green)] to-[var(--electric-blue)] text-white'
                    : 'hover:border-[var(--electric-blue)] hover:text-[var(--electric-blue)]'
                }`}
              >
                {category}
              </Button>
            ) : category === 'All' ? (
              <Button
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[var(--neon-green)] to-[var(--electric-blue)] text-white'
                    : 'hover:border-[var(--electric-blue)] hover:text-[var(--electric-blue)]'
                }`}
              >
                All
              </Button>
            ) : (
              <div className="flex items-center space-x-1">
                <Input
                  value={category}
                  onChange={(e) => updateCategory(category, e.target.value)}
                  className="px-3 py-1 text-sm h-8 w-24 text-center"
                  placeholder="Category"
                />
                <Button
                  onClick={() => removeCategory(category)}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
        {isEditing && (
          <Button onClick={addCategory} size="sm" variant="outline">
            <Plus className="mr-1 h-3 w-3" />
            Add Category
          </Button>
        )}
      </motion.div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            whileHover={{ y: -10 }}
            className={`group ${!isEditing ? 'cursor-pointer' : ''} relative`}
            onClick={!isEditing ? () => {
              setSelectedProject(project)
              setCurrentImageIndex(0)
            } : undefined}
          >
            {isEditing && (
              <Button
                onClick={() => removeProject(project.id)}
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 z-10"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
            <Card className={`overflow-hidden border-0 shadow-lg transition-all duration-300 ${
              !isEditing ? 'group-hover:shadow-2xl' : 'border-2 border-dashed border-muted-foreground/20'
            }`}>
              <div className="relative overflow-hidden">
                {!isEditing ? (
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-64 p-4 flex items-center justify-center bg-muted/50">
                    <ImageUpload
                      currentImage={project.image}
                      onImageChange={(imageUrl) => updateProject(project.id, 'image', imageUrl)}
                      className="w-full"
                      placeholder="Upload project image"
                    />
                  </div>
                )}
                {!isEditing && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge variant="secondary" className="mb-2">{project.category}</Badge>
                      <p className="text-sm">Click to view case study</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-6 space-y-3">
                {!isEditing ? (
                  <>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--electric-blue)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                  </>
                ) : (
                  <>
                    <Input
                      value={project.title}
                      onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                      className="text-xl font-bold bg-transparent border-muted"
                      placeholder="Project title"
                    />
                    <select
                      value={project.category}
                      onChange={(e) => updateProject(project.id, 'category', e.target.value)}
                      className="w-full p-2 border border-muted rounded bg-background"
                    >
                      {currentData.customCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                      className="text-muted-foreground bg-transparent border-muted resize-none"
                      rows={2}
                      placeholder="Project description"
                    />
                  </>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag, tagIndex) => (
                    <div key={tag} className="relative">
                      {!isEditing ? (
                        <Badge variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ) : (
                        <div className="flex items-center">
                          <Badge variant="outline" className="text-xs pr-6">
                            {tag}
                          </Badge>
                          <Button
                            onClick={() => removeTag(project.id, tag)}
                            size="sm"
                            variant="ghost"
                            className="absolute right-0 h-4 w-4 p-0 text-destructive hover:text-destructive"
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {!isEditing && project.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                  {isEditing && (
                    <Input
                      placeholder="Add tag"
                      className="w-20 h-6 text-xs"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTag(project.id, e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.4 + filteredProjects.length * 0.1 }}
            className="flex items-center justify-center"
          >
            <Card className="overflow-hidden border-2 border-dashed border-muted-foreground/30 hover:border-[var(--electric-blue)] transition-colors cursor-pointer h-full min-h-[400px]">
              <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                <Button onClick={addProject} variant="outline" size="lg">
                  <Plus className="mr-2 h-6 w-6" />
                  Add New Project
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Click to add a new project to your portfolio
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-4">
                  {!isEditing ? (
                    <>
                      <h3 className="text-2xl font-bold mb-2">{selectedProject.title}</h3>
                      <Badge className="mb-4">{selectedProject.category}</Badge>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        value={selectedProject.title}
                        onChange={(e) => updateProject(selectedProject.id, 'title', e.target.value)}
                        className="text-2xl font-bold bg-transparent border-muted"
                        placeholder="Project title"
                      />
                      <select
                        value={selectedProject.category}
                        onChange={(e) => updateProject(selectedProject.id, 'category', e.target.value)}
                        className="p-2 border border-muted rounded bg-background"
                      >
                        {currentData.customCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Image Carousel */}
              <div className="space-y-4">
                {!isEditing ? (
                  <div className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={selectedProject.details.images[currentImageIndex]}
                        alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {selectedProject.details.images.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex justify-center space-x-2 mt-4">
                          {selectedProject.details.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex ? 'bg-[var(--electric-blue)]' : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div>
                    <h4 className="font-bold mb-3">Project Images</h4>
                    <MultiImageUpload
                      images={selectedProject.details.images}
                      onImagesChange={(images) => updateProjectDetail(selectedProject.id, 'images', images)}
                      maxImages={5}
                    />
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-[var(--electric-blue)] mb-2">Challenge</h4>
                    {!isEditing ? (
                      <p className="text-muted-foreground">{selectedProject.details.challenge}</p>
                    ) : (
                      <Textarea
                        value={selectedProject.details.challenge}
                        onChange={(e) => updateProjectDetail(selectedProject.id, 'challenge', e.target.value)}
                        className="text-muted-foreground bg-transparent border-muted resize-none"
                        rows={3}
                        placeholder="Describe the challenge..."
                      />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-[var(--neon-green)] mb-2">Solution</h4>
                    {!isEditing ? (
                      <p className="text-muted-foreground">{selectedProject.details.solution}</p>
                    ) : (
                      <Textarea
                        value={selectedProject.details.solution}
                        onChange={(e) => updateProjectDetail(selectedProject.id, 'solution', e.target.value)}
                        className="text-muted-foreground bg-transparent border-muted resize-none"
                        rows={3}
                        placeholder="Explain your solution..."
                      />
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-[var(--coral)] mb-2">Result</h4>
                    {!isEditing ? (
                      <p className="text-muted-foreground">{selectedProject.details.result}</p>
                    ) : (
                      <Textarea
                        value={selectedProject.details.result}
                        onChange={(e) => updateProjectDetail(selectedProject.id, 'result', e.target.value)}
                        className="text-muted-foreground bg-transparent border-muted resize-none"
                        rows={3}
                        placeholder="Share the results..."
                      />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold mb-1">Timeline</h4>
                      {!isEditing ? (
                        <p className="text-muted-foreground">{selectedProject.details.timeline}</p>
                      ) : (
                        <Input
                          value={selectedProject.details.timeline}
                          onChange={(e) => updateProjectDetail(selectedProject.id, 'timeline', e.target.value)}
                          className="text-muted-foreground bg-transparent border-muted"
                          placeholder="e.g., 2 months"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Role</h4>
                      {!isEditing ? (
                        <p className="text-muted-foreground">{selectedProject.details.role}</p>
                      ) : (
                        <Input
                          value={selectedProject.details.role}
                          onChange={(e) => updateProjectDetail(selectedProject.id, 'role', e.target.value)}
                          className="text-muted-foreground bg-transparent border-muted"
                          placeholder="e.g., UI/UX Designer"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="font-bold mb-3">Technologies & Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                {isEditing && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Live Project URL</label>
                      <Input
                        value={selectedProject.liveUrl}
                        onChange={(e) => updateProject(selectedProject.id, 'liveUrl', e.target.value)}
                        placeholder="https://example.com"
                        className="bg-transparent border-muted"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">GitHub URL</label>
                      <Input
                        value={selectedProject.githubUrl}
                        onChange={(e) => updateProject(selectedProject.id, 'githubUrl', e.target.value)}
                        placeholder="https://github.com/username/repo"
                        className="bg-transparent border-muted"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <Button 
                    className="bg-gradient-to-r from-[var(--neon-green)] to-[var(--electric-blue)] text-white"
                    onClick={() => window.open(selectedProject.liveUrl, '_blank')}
                    disabled={!selectedProject.liveUrl || selectedProject.liveUrl === '#'}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Live Project
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open(selectedProject.githubUrl, '_blank')}
                    disabled={!selectedProject.githubUrl || selectedProject.githubUrl === '#'}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View Code
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}