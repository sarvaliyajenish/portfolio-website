import { useRef, useState, useEffect, lazy, Suspense } from 'react'
import { motion, useInView } from 'motion/react'
import { Palette, Code, Users, Search, Lightbulb, Zap, BookOpen, Star, Calendar, Edit } from 'lucide-react'
import { Card } from './ui/card'
import { Progress } from './ui/progress'
import { Button } from './ui/button'
import { portfolioConfig } from '../config/portfolio'

// Lazy load the editing component
const SkillsEditor = lazy(() => import('./SkillsEditor'))

// Pre-process icons for better performance
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

// Process skills data once
const processSkillsData = () => {
  const categories = portfolioConfig.skills.categories.map((category, index) => ({
    ...category,
    icon: iconMap[category.icon as keyof typeof iconMap] || Code,
    color: colors[index % colors.length]
  }))

  const softSkills = portfolioConfig.skills.softSkills.map(skill => ({
    ...skill,
    icon: iconMap[skill.icon as keyof typeof iconMap] || Lightbulb
  }))

  return { categories, softSkills }
}

const SkillBar = ({ skill, color, delay }: { skill: any, color: string, delay: number }) => {
  const [animatedLevel, setAnimatedLevel] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setAnimatedLevel(skill.level), 100 + delay)
      return () => clearTimeout(timer)
    }
  }, [isInView, skill.level, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: delay * 0.05 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{skill.name}</span>
        <span className="text-sm text-muted-foreground">{animatedLevel}%</span>
      </div>
      <div className="relative">
        <Progress value={animatedLevel} className="h-2" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${skill.level}%` : 0 }}
          transition={{ duration: 1, delay: 0.2 + delay * 0.05 }}
          className="absolute top-0 left-0 h-2 rounded-full"
          style={{ 
            background: `linear-gradient(90deg, ${color}, ${color}80)` 
          }}
        />
      </div>
    </motion.div>
  )
}

const SoftSkillCard = ({ skill, index, isInView }: { skill: any, index: number, isInView: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={isInView ? { opacity: 1, scale: 1 } : {}}
    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
    whileHover={{ scale: 1.02 }}
    className="group"
  >
    <Card className="p-6 text-center h-full transition-all duration-300 hover:shadow-md cursor-pointer border-2 border-transparent hover:border-[var(--electric-blue)]/20">
      <motion.div
        whileHover={{ rotate: 10 }}
        className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--neon-green)]/20 to-[var(--electric-blue)]/20 flex items-center justify-center"
      >
        <skill.icon className="h-8 w-8 text-[var(--electric-blue)]" />
      </motion.div>
      <h4 className="font-bold mb-2 group-hover:text-[var(--electric-blue)] transition-colors">
        {skill.name}
      </h4>
      <p className="text-sm text-muted-foreground">{skill.description}</p>
    </Card>
  </motion.div>
)

const ConstellationBubble = ({ skill, index, isInView }: { skill: string, index: number, isInView: boolean }) => (
  <motion.div
    key={`constellation-${index}`}
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: [0.3, 0.7, 0.3],
      y: [0, -15, 0],
      x: [0, Math.sin(index) * 8, 0]
    }}
    transition={{
      duration: 3 + index * 0.5,
      repeat: Infinity,
      delay: index * 0.3
    }}
    className="absolute w-16 h-16 rounded-full glass flex items-center justify-center text-sm font-medium"
    style={{
      left: `${15 + index * 12}%`,
      top: `${20 + (index % 3) * 25}%`
    }}
  >
    {skill}
  </motion.div>
)

export function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [isEditing, setIsEditing] = useState(false)
  
  // Process data once and cache it
  const { categories, softSkills } = processSkillsData()
  
  const sectionData = {
    title: "My Skills",
    subtitle: "A versatile toolkit spanning design, development, and user research. I believe in continuous learning and staying current with industry best practices.",
    constellation: {
      title: "Designing the Future",
      subtitle: "Where creativity meets functionality",
      skills: ['UX', 'UI', 'Research', 'Strategy', 'Prototype', 'Test']
    }
  }

  return (
    <section id="skills" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Edit Controls */}
      <div className="flex justify-end mb-8">
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>{isEditing ? 'View Mode' : 'Edit Skills'}</span>
        </Button>
      </div>

      {/* Conditionally render editor */}
      {isEditing && (
        <Suspense fallback={
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--electric-blue)]"></div>
          </div>
        }>
          <SkillsEditor onClose={() => setIsEditing(false)} />
        </Suspense>
      )}

      {/* Main content - only show when not editing */}
      {!isEditing && (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">{sectionData.title}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {sectionData.subtitle}
            </p>
          </motion.div>

          {/* Technical Skills Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {categories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              >
                <Card className="p-6 h-full">
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
                    <h3 className="text-xl font-bold">{category.title}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <SkillBar
                        key={skillIndex}
                        skill={skill}
                        color={category.color}
                        delay={categoryIndex * 2 + skillIndex}
                      />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Soft Skills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold text-center">Core Competencies</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {softSkills.map((skill, index) => (
                <SoftSkillCard
                  key={index}
                  skill={skill}
                  index={index}
                  isInView={isInView}
                />
              ))}
            </div>
          </motion.div>

          {/* Skills Constellation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 relative h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--neon-green)]/10 to-[var(--electric-blue)]/10"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.h3
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-3xl font-bold mb-4 bg-gradient-to-r from-[var(--neon-green)] via-[var(--electric-blue)] to-[var(--coral)] bg-[length:200%_auto] bg-clip-text text-transparent"
                >
                  {sectionData.constellation.title}
                </motion.h3>
                <p className="text-lg text-muted-foreground">
                  {sectionData.constellation.subtitle}
                </p>
              </div>
            </div>
            
            {/* Floating skill bubbles */}
            {sectionData.constellation.skills.map((skill, index) => (
              <ConstellationBubble
                key={index}
                skill={skill}
                index={index}
                isInView={isInView}
              />
            ))}
          </motion.div>
        </>
      )}
    </section>
  )
}