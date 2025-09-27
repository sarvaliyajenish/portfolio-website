import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useInView } from 'motion/react'
import { Palette, Code, Users, Search, Lightbulb, Zap, BookOpen, Star, Calendar, Edit, Save, XCircle, Plus, Trash2, X } from 'lucide-react'
import { Card } from './ui/card'
import { Progress } from './ui/progress'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Slider } from './ui/slider'
import { portfolioConfig } from '../config/portfolio'

// Icon mapping for dynamic icons
const iconMap = {
  Palette,
  Code,
  Users,
  Search,
  Lightbulb,
  Zap,
  BookOpen,
  Star,
  Calendar
} as const

const colors = ['var(--neon-green)', 'var(--electric-blue)', 'var(--coral)', 'var(--neon-purple)']

const iconOptions = [
  { value: 'Palette', label: 'Palette', icon: Palette },
  { value: 'Code', label: 'Code', icon: Code },
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'Search', label: 'Search', icon: Search },
  { value: 'Lightbulb', label: 'Lightbulb', icon: Lightbulb },
  { value: 'Zap', label: 'Zap', icon: Zap },
  { value: 'BookOpen', label: 'BookOpen', icon: BookOpen },
  { value: 'Star', label: 'Star', icon: Star },
  { value: 'Calendar', label: 'Calendar', icon: Calendar }
]

export function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [animatedSkills, setAnimatedSkills] = useState<{ [key: string]: number }>({})
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(() => ({
    title: "My Skills",
    subtitle: "A versatile toolkit spanning design, development, and user research. I believe in continuous learning and staying current with industry best practices.",
    categories: [...portfolioConfig.skills.categories],
    softSkills: [...portfolioConfig.skills.softSkills],
    constellation: {
      title: "Designing the Future",
      subtitle: "Where creativity meets functionality",
      skills: ['UX', 'UI', 'Research', 'Strategy', 'Prototype', 'Test']
    }
  }))

  // Memoize current data to prevent unnecessary re-renders
  const currentData = useMemo(() => {
    if (isEditing) {
      return editedData
    }
    return {
      title: "My Skills",
      subtitle: "A versatile toolkit spanning design, development, and user research. I believe in continuous learning and staying current with industry best practices.",
      categories: portfolioConfig.skills.categories,
      softSkills: portfolioConfig.skills.softSkills,
      constellation: {
        title: "Designing the Future", 
        subtitle: "Where creativity meets functionality",
        skills: ['UX', 'UI', 'Research', 'Strategy', 'Prototype', 'Test']
      }
    }
  }, [isEditing, editedData])

  // Memoize processed categories to prevent infinite loops
  const skillCategories = useMemo(() => {
    return currentData.categories.map((category, index) => ({
      ...category,
      icon: iconMap[category.icon as keyof typeof iconMap] || Code,
      color: colors[index % colors.length]
    }))
  }, [currentData.categories])

  // Memoize processed soft skills
  const softSkills = useMemo(() => {
    return currentData.softSkills.map(skill => ({
      ...skill,
      icon: iconMap[skill.icon as keyof typeof iconMap] || Lightbulb
    }))
  }, [currentData.softSkills])

  // Simplified useEffect with proper dependencies
  useEffect(() => {
    if (isInView && skillCategories.length > 0) {
      const timer = setTimeout(() => {
        const animated: { [key: string]: number } = {}
        skillCategories.forEach(category => {
          category.skills.forEach(skill => {
            animated[skill.name] = skill.level
          })
        })
        setAnimatedSkills(animated)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isInView]) // Removed skillCategories dependency

  const handleEdit = () => {
    setIsEditing(true)
    setEditedData({
      title: "My Skills",
      subtitle: "A versatile toolkit spanning design, development, and user research. I believe in continuous learning and staying current with industry best practices.",
      categories: [...portfolioConfig.skills.categories],
      softSkills: [...portfolioConfig.skills.softSkills],
      constellation: {
        title: "Designing the Future",
        subtitle: "Where creativity meets functionality", 
        skills: ['UX', 'UI', 'Research', 'Strategy', 'Prototype', 'Test']
      }
    })
  }

  const handleSave = () => {
    console.log('Saving skills data:', editedData)
    setIsEditing(false)
  }

  const handleDiscard = () => {
    setIsEditing(false)
  }

  // Category management functions
  const updateCategory = (index: number, field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === index ? { ...cat, [field]: value } : cat
      )
    }))
  }

  const addCategory = () => {
    const newCategory = {
      title: 'New Category',
      icon: 'Code',
      skills: [{ name: 'New Skill', level: 50 }]
    }
    setEditedData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }))
  }

  const removeCategory = (index: number) => {
    setEditedData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }))
  }

  const updateSkill = (categoryIndex: number, skillIndex: number, field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, catI) => 
        catI === categoryIndex ? {
          ...cat,
          skills: cat.skills.map((skill, skillI) => 
            skillI === skillIndex ? { ...skill, [field]: value } : skill
          )
        } : cat
      )
    }))
  }

  const addSkill = (categoryIndex: number) => {
    const newSkill = { name: 'New Skill', level: 50 }
    setEditedData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === categoryIndex ? { ...cat, skills: [...cat.skills, newSkill] } : cat
      )
    }))
  }

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    setEditedData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === categoryIndex ? {
          ...cat,
          skills: cat.skills.filter((_, j) => j !== skillIndex)
        } : cat
      )
    }))
  }

  const updateSoftSkill = (index: number, field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      softSkills: prev.softSkills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }))
  }

  const addSoftSkill = () => {
    const newSoftSkill = {
      name: 'New Skill',
      icon: 'Lightbulb',
      description: 'Description of the skill...'
    }
    setEditedData(prev => ({
      ...prev,
      softSkills: [...prev.softSkills, newSoftSkill]
    }))
  }

  const removeSoftSkill = (index: number) => {
    setEditedData(prev => ({
      ...prev,
      softSkills: prev.softSkills.filter((_, i) => i !== index)
    }))
  }

  const updateConstellationSkill = (index: number, value: string) => {
    setEditedData(prev => ({
      ...prev,
      constellation: {
        ...prev.constellation,
        skills: prev.constellation.skills.map((skill, i) => 
          i === index ? value : skill
        )
      }
    }))
  }

  const addConstellationSkill = () => {
    setEditedData(prev => ({
      ...prev,
      constellation: {
        ...prev.constellation,
        skills: [...prev.constellation.skills, 'New']
      }
    }))
  }

  const removeConstellationSkill = (index: number) => {
    setEditedData(prev => ({
      ...prev,
      constellation: {
        ...prev.constellation,
        skills: prev.constellation.skills.filter((_, i) => i !== index)
      }
    }))
  }

  return (
    <section id="skills" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Edit Controls */}
      <div className="flex justify-end mb-8">
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Skills</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
            <Button
              onClick={handleDiscard}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <XCircle className="h-4 w-4" />
              <span>Discard</span>
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
              <span className="gradient-text">{currentData.title}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {currentData.subtitle}
            </p>
          </>
        ) : (
          <div className="space-y-4">
            <Input
              value={editedData.title}
              onChange={(e) => setEditedData(prev => ({ ...prev, title: e.target.value }))}
              className="text-4xl md:text-6xl font-bold text-center"
              placeholder="Skills section title"
            />
            <Textarea
              value={editedData.subtitle}
              onChange={(e) => setEditedData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="text-xl text-center max-w-3xl mx-auto"
              placeholder="Skills section description"
              rows={3}
            />
          </div>
        )}
      </motion.div>

      {/* Technical Skills Grid */}
      <div className="space-y-8 mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={`category-${categoryIndex}`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.2 + categoryIndex * 0.1 }}
            >
              <Card className={`p-6 h-full ${isEditing ? 'border-2 border-dashed border-muted' : ''}`}>
                {isEditing && (
                  <div className="flex justify-end mb-2">
                    <Button
                      onClick={() => removeCategory(categoryIndex)}
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 rounded-full p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center mb-6">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <category.icon 
                      className="h-6 w-6" 
                      style={{ color: category.color }}
                    />
                  </div>
                  {!isEditing ? (
                    <h3 className="text-xl font-bold">{category.title}</h3>
                  ) : (
                    <div className="flex-1 space-y-2">
                      <Input
                        value={editedData.categories[categoryIndex]?.title || ''}
                        onChange={(e) => updateCategory(categoryIndex, 'title', e.target.value)}
                        className="font-bold"
                        placeholder="Category title"
                      />
                      <Select
                        value={editedData.categories[categoryIndex]?.icon || 'Code'}
                        onValueChange={(value) => updateCategory(categoryIndex, 'icon', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-2">
                                <option.icon className="h-4 w-4" />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={`skill-${categoryIndex}-${skillIndex}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, delay: 0.4 + categoryIndex * 0.1 + skillIndex * 0.05 }}
                      className="space-y-2"
                    >
                      {isEditing && (
                        <div className="flex justify-end">
                          <Button
                            onClick={() => removeSkill(categoryIndex, skillIndex)}
                            size="sm"
                            variant="destructive"
                            className="h-5 w-5 rounded-full p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        {!isEditing ? (
                          <span className="font-medium">{skill.name}</span>
                        ) : (
                          <Input
                            value={editedData.categories[categoryIndex]?.skills[skillIndex]?.name || ''}
                            onChange={(e) => updateSkill(categoryIndex, skillIndex, 'name', e.target.value)}
                            className="font-medium flex-1 mr-2"
                            placeholder="Skill name"
                          />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {isEditing ? editedData.categories[categoryIndex]?.skills[skillIndex]?.level || 0 : (animatedSkills[skill.name] || 0)}%
                        </span>
                      </div>
                      
                      {isEditing ? (
                        <div className="space-y-2">
                          <Slider
                            value={[editedData.categories[categoryIndex]?.skills[skillIndex]?.level || 0]}
                            onValueChange={(value) => updateSkill(categoryIndex, skillIndex, 'level', value[0])}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <Progress 
                            value={animatedSkills[skill.name] || 0} 
                            className="h-2"
                          />
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: isInView ? `${skill.level}%` : 0 }}
                            transition={{ duration: 1.5, delay: 0.6 + categoryIndex * 0.1 + skillIndex * 0.1 }}
                            className="absolute top-0 left-0 h-2 rounded-full"
                            style={{ 
                              background: `linear-gradient(90deg, ${category.color}, ${category.color}80)` 
                            }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isEditing && (
                    <Button
                      onClick={() => addSkill(categoryIndex)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {isEditing && (
          <div className="flex justify-center">
            <Button
              onClick={addCategory}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </Button>
          </div>
        )}
      </div>

      {/* Soft Skills */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="space-y-8"
      >
        <h3 className="text-2xl font-bold text-center">Core Competencies</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {softSkills.map((skill, index) => (
            <motion.div
              key={`soft-skill-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: isEditing ? 1 : 1.05, rotate: isEditing ? 0 : 2 }}
              className="group"
            >
              <Card className={`p-6 text-center h-full transition-all duration-300 ${
                isEditing 
                  ? 'border-2 border-dashed border-muted cursor-default' 
                  : 'hover:shadow-lg cursor-pointer border-2 border-transparent hover:border-[var(--electric-blue)]/20'
              }`}>
                {isEditing && (
                  <div className="flex justify-end mb-2">
                    <Button
                      onClick={() => removeSoftSkill(index)}
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 rounded-full p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <motion.div
                  whileHover={{ rotate: isEditing ? 0 : 15 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--neon-green)]/20 to-[var(--electric-blue)]/20 flex items-center justify-center"
                >
                  <skill.icon className="h-8 w-8 text-[var(--electric-blue)]" />
                </motion.div>
                
                {!isEditing ? (
                  <>
                    <h4 className="font-bold mb-2 group-hover:text-[var(--electric-blue)] transition-colors">
                      {skill.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Input
                      value={editedData.softSkills[index]?.name || ''}
                      onChange={(e) => updateSoftSkill(index, 'name', e.target.value)}
                      className="font-bold text-center"
                      placeholder="Skill name"
                    />
                    <Select
                      value={editedData.softSkills[index]?.icon || 'Lightbulb'}
                      onValueChange={(value) => updateSoftSkill(index, 'icon', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-2">
                              <option.icon className="h-4 w-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      value={editedData.softSkills[index]?.description || ''}
                      onChange={(e) => updateSoftSkill(index, 'description', e.target.value)}
                      className="text-sm"
                      placeholder="Skill description"
                      rows={3}
                    />
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
        
        {isEditing && (
          <div className="flex justify-center">
            <Button
              onClick={addSoftSkill}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Soft Skill</span>
            </Button>
          </div>
        )}
      </motion.div>

      {/* Skills Constellation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className={`mt-16 relative h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--neon-green)]/10 to-[var(--electric-blue)]/10 ${
          isEditing ? 'border-2 border-dashed border-muted' : ''
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {!isEditing ? (
              <>
                <motion.h3
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-3xl font-bold mb-4 bg-gradient-to-r from-[var(--neon-green)] via-[var(--electric-blue)] to-[var(--coral)] bg-[length:200%_auto] bg-clip-text text-transparent"
                >
                  {currentData.constellation.title}
                </motion.h3>
                <p className="text-lg text-muted-foreground">
                  {currentData.constellation.subtitle}
                </p>
              </>
            ) : (
              <div className="space-y-4 p-4">
                <Input
                  value={editedData.constellation.title}
                  onChange={(e) => setEditedData(prev => ({
                    ...prev,
                    constellation: { ...prev.constellation, title: e.target.value }
                  }))}
                  className="text-3xl font-bold text-center bg-transparent border-none"
                  placeholder="Constellation title"
                />
                <Input
                  value={editedData.constellation.subtitle}
                  onChange={(e) => setEditedData(prev => ({
                    ...prev,
                    constellation: { ...prev.constellation, subtitle: e.target.value }
                  }))}
                  className="text-lg text-center bg-transparent border-none"
                  placeholder="Constellation subtitle"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Floating skill bubbles */}
        {currentData.constellation.skills.map((skill, index) => (
          <motion.div
            key={`constellation-${index}`}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isEditing ? [0.5, 0.5, 0.5] : [0.3, 0.7, 0.3],
              y: isEditing ? [0, 0, 0] : [0, -20, 0],
              x: isEditing ? [0, 0, 0] : [0, Math.sin(index) * 10, 0]
            }}
            transition={{
              duration: isEditing ? 0 : 4 + index * 0.5,
              repeat: isEditing ? 0 : Infinity,
              delay: isEditing ? 0 : index * 0.5
            }}
            className={`absolute w-16 h-16 rounded-full glass flex items-center justify-center text-sm font-medium ${
              isEditing ? 'cursor-pointer hover:bg-muted/20' : ''
            }`}
            style={{
              left: `${15 + index * 12}%`,
              top: `${20 + (index % 3) * 25}%`
            }}
          >
            {!isEditing ? (
              skill
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <Input
                  value={editedData.constellation.skills[index] || ''}
                  onChange={(e) => updateConstellationSkill(index, e.target.value)}
                  className="w-12 h-8 text-xs text-center bg-transparent border-none p-0"
                  placeholder="Skill"
                />
                <Button
                  onClick={() => removeConstellationSkill(index)}
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0"
                >
                  <X className="h-2 w-2" />
                </Button>
              </div>
            )}
          </motion.div>
        ))}
        
        {isEditing && (
          <div className="absolute bottom-4 right-4">
            <Button
              onClick={addConstellationSkill}
              size="sm"
              variant="outline"
              className="rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </motion.div>
    </section>
  )
}