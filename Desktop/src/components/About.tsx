import { motion } from 'motion/react'
import { useInView } from 'motion/react'
import { useRef, useState } from 'react'
import { Calendar, MapPin, Coffee, Gamepad2, Camera, Music, Palette, BookOpen, Lightbulb, Edit3, Save, X } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { portfolioConfig } from '../config/portfolio'

// Icon mapping for dynamic icons
const iconMap = {
  Camera,
  Gamepad2,
  Coffee,
  Music,
  Calendar,
  Palette,
  BookOpen,
  Lightbulb
} as const

const timeline = portfolioConfig.about.timeline

// This will be moved inside the component to use currentData

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    currentLocation: portfolioConfig.about.currentLocation,
    originLocation: portfolioConfig.about.originLocation,
    stats: { ...portfolioConfig.about.stats },
    hobbies: [...portfolioConfig.about.hobbies],
    quote: { ...portfolioConfig.about.quote },
    timeline: [...portfolioConfig.about.timeline]
  })

  const handleSave = () => {
    // Update the config (in a real app, this would persist to backend)
    Object.assign(portfolioConfig.about, editedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData({
      currentLocation: portfolioConfig.about.currentLocation,
      originLocation: portfolioConfig.about.originLocation,
      stats: { ...portfolioConfig.about.stats },
      hobbies: [...portfolioConfig.about.hobbies],
      quote: { ...portfolioConfig.about.quote },
      timeline: [...portfolioConfig.about.timeline]
    })
    setIsEditing(false)
  }

  const updateHobby = (index: number, field: string, value: string) => {
    const newHobbies = [...editedData.hobbies]
    newHobbies[index] = { ...newHobbies[index], [field]: value }
    setEditedData({ ...editedData, hobbies: newHobbies })
  }

  const addHobby = () => {
    setEditedData({
      ...editedData,
      hobbies: [...editedData.hobbies, { name: 'New Hobby', icon: 'Coffee' }]
    })
  }

  const removeHobby = (index: number) => {
    setEditedData({
      ...editedData,
      hobbies: editedData.hobbies.filter((_, i) => i !== index)
    })
  }

  const addTimelineItem = () => {
    setEditedData({
      ...editedData,
      timeline: [...editedData.timeline, {
        year: new Date().getFullYear().toString(),
        title: 'New Experience',
        company: 'Company Name',
        description: 'Description of role or achievement',
        icon: '💼'
      }]
    })
  }

  const currentData = isEditing ? editedData : portfolioConfig.about

  return (
    <section id="about" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          About <span className="gradient-text">Me</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {portfolioConfig.about.description}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold flex items-center">
              <Calendar className="mr-3 h-6 w-6 text-[var(--electric-blue)]" />
              My Journey
            </h3>
            {isEditing && (
              <Button onClick={addTimelineItem} size="sm" variant="outline">
                Add Experience
              </Button>
            )}
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[var(--neon-green)] to-[var(--electric-blue)]" />
            
            <div className="space-y-8">
              {currentData.timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="relative flex items-start space-x-4"
                >
                  {/* Timeline dot */}
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="relative z-10 flex-shrink-0 w-16 h-16 bg-background border-4 border-[var(--electric-blue)] rounded-full flex items-center justify-center text-2xl"
                  >
                    {item.icon}
                  </motion.div>
                  
                  <Card className={`flex-1 p-6 transition-shadow relative ${
                    !isEditing ? 'hover:shadow-lg' : 'border-2 border-dashed border-muted-foreground/20'
                  }`}>
                    {isEditing && (
                      <Button
                        onClick={() => {
                          const newTimeline = editedData.timeline.filter((_, i) => i !== index)
                          setEditedData({ ...editedData, timeline: newTimeline })
                        }}
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 z-10"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      {!isEditing ? (
                        <h4 className="text-lg font-bold">{item.title}</h4>
                      ) : (
                        <Input
                          value={editedData.timeline[index]?.title || ''}
                          onChange={(e) => {
                            const newTimeline = [...editedData.timeline]
                            newTimeline[index] = { ...newTimeline[index], title: e.target.value }
                            setEditedData({ ...editedData, timeline: newTimeline })
                          }}
                          className="text-lg font-bold bg-transparent border-none p-0 h-7"
                          placeholder="Job title or milestone"
                        />
                      )}
                      {!isEditing ? (
                        <span className="text-sm text-[var(--electric-blue)] font-medium">{item.year}</span>
                      ) : (
                        <Input
                          value={editedData.timeline[index]?.year || ''}
                          onChange={(e) => {
                            const newTimeline = [...editedData.timeline]
                            newTimeline[index] = { ...newTimeline[index], year: e.target.value }
                            setEditedData({ ...editedData, timeline: newTimeline })
                          }}
                          className="text-sm text-[var(--electric-blue)] font-medium bg-transparent border-none p-0 h-6 w-24 text-right"
                          placeholder="Year"
                        />
                      )}
                    </div>
                    {!isEditing ? (
                      <p className="text-[var(--coral)] font-medium mb-2">{item.company}</p>
                    ) : (
                      <Input
                        value={editedData.timeline[index]?.company || ''}
                        onChange={(e) => {
                          const newTimeline = [...editedData.timeline]
                          newTimeline[index] = { ...newTimeline[index], company: e.target.value }
                          setEditedData({ ...editedData, timeline: newTimeline })
                        }}
                        className="text-[var(--coral)] font-medium mb-2 bg-transparent border-none p-0 h-6"
                        placeholder="Company or organization"
                      />
                    )}
                    {!isEditing ? (
                      <p className="text-muted-foreground">{item.description}</p>
                    ) : (
                      <Textarea
                        value={editedData.timeline[index]?.description || ''}
                        onChange={(e) => {
                          const newTimeline = [...editedData.timeline]
                          newTimeline[index] = { ...newTimeline[index], description: e.target.value }
                          setEditedData({ ...editedData, timeline: newTimeline })
                        }}
                        className="text-muted-foreground bg-transparent border-muted"
                        rows={2}
                        placeholder="Description of role or achievement"
                      />
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Personal Info & Hobbies */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8"
        >
          {/* Edit Toggle */}
          <div className="flex justify-end">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Info
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Location & Stats */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <MapPin className="mr-3 h-5 w-5 text-[var(--neon-green)]" />
              Based in {!isEditing ? (
                currentData.currentLocation
              ) : (
                <Input
                  value={editedData.currentLocation}
                  onChange={(e) => setEditedData({ ...editedData, currentLocation: e.target.value })}
                  className="ml-2 h-6 text-xl font-bold bg-transparent border-none p-0"
                />
              )}
            </h3>
            {!isEditing ? (
              <p className="text-muted-foreground mb-6">
                {currentData.originLocation}
              </p>
            ) : (
              <Textarea
                value={editedData.originLocation}
                onChange={(e) => setEditedData({ ...editedData, originLocation: e.target.value })}
                className="mb-6 text-muted-foreground"
                rows={3}
              />
            )}
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold gradient-text">
                  {!isEditing ? (
                    currentData.stats.projects
                  ) : (
                    <Input
                      value={editedData.stats.projects}
                      onChange={(e) => setEditedData({ 
                        ...editedData, 
                        stats: { ...editedData.stats, projects: e.target.value }
                      })}
                      className="text-center text-2xl font-bold bg-transparent border-none p-0 h-8"
                    />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text">
                  {!isEditing ? (
                    currentData.stats.experience
                  ) : (
                    <Input
                      value={editedData.stats.experience}
                      onChange={(e) => setEditedData({ 
                        ...editedData, 
                        stats: { ...editedData.stats, experience: e.target.value }
                      })}
                      className="text-center text-2xl font-bold bg-transparent border-none p-0 h-8"
                    />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Years</div>
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text">
                  {!isEditing ? (
                    currentData.stats.clients
                  ) : (
                    <Input
                      value={editedData.stats.clients}
                      onChange={(e) => setEditedData({ 
                        ...editedData, 
                        stats: { ...editedData.stats, clients: e.target.value }
                      })}
                      className="text-center text-2xl font-bold bg-transparent border-none p-0 h-8"
                    />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Clients</div>
              </div>
            </div>
          </Card>

          {/* Hobbies */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">When I'm Not Designing</h3>
              {isEditing && (
                <Button onClick={addHobby} size="sm" variant="outline">
                  Add Hobby
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {currentData.hobbies.map((hobby, index) => {
                const IconComponent = iconMap[hobby.icon as keyof typeof iconMap] || Coffee
                return (
                  <motion.div
                    key={`${hobby.name}-${index}`}
                    whileHover={!isEditing ? { scale: 1.05, rotate: 5 } : {}}
                    whileTap={!isEditing ? { scale: 0.95 } : {}}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className={`flex flex-col items-center p-4 rounded-lg ${
                      !isEditing 
                        ? 'bg-muted/50 hover:bg-muted transition-colors cursor-pointer' 
                        : 'bg-muted/30 border-2 border-dashed border-muted-foreground/20'
                    } relative`}
                  >
                    {isEditing && (
                      <Button
                        onClick={() => removeHobby(index)}
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    <IconComponent 
                      className="h-8 w-8 mb-2" 
                      style={{ color: 'var(--electric-blue)' }}
                    />
                    {!isEditing ? (
                      <span className="text-sm font-medium">{hobby.name}</span>
                    ) : (
                      <Input
                        value={editedData.hobbies[index]?.name || ''}
                        onChange={(e) => updateHobby(index, 'name', e.target.value)}
                        className="text-center text-sm font-medium bg-transparent border-none p-0 h-6"
                        placeholder="Hobby name"
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </Card>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative"
          >
            <Card className="p-8 text-center bg-gradient-to-br from-[var(--neon-green)]/10 to-[var(--electric-blue)]/10 border-none">
              <div className="text-6xl text-[var(--electric-blue)] mb-4 opacity-50">"</div>
              {!isEditing ? (
                <p className="text-lg italic mb-4">
                  {currentData.quote.text}
                </p>
              ) : (
                <Textarea
                  value={editedData.quote.text}
                  onChange={(e) => setEditedData({ 
                    ...editedData, 
                    quote: { ...editedData.quote, text: e.target.value }
                  })}
                  className="text-lg italic mb-4 bg-transparent border-muted text-center"
                  rows={3}
                  placeholder="Enter your quote..."
                />
              )}
              {!isEditing ? (
                <p className="text-sm text-muted-foreground">— {currentData.quote.author}</p>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-muted-foreground">—</span>
                  <Input
                    value={editedData.quote.author}
                    onChange={(e) => setEditedData({ 
                      ...editedData, 
                      quote: { ...editedData.quote, author: e.target.value }
                    })}
                    className="text-sm text-muted-foreground bg-transparent border-none p-0 h-6 w-auto text-center"
                    placeholder="Author name"
                  />
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}