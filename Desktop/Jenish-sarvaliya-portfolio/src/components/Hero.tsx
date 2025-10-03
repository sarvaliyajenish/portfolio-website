import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ChevronDown, Download, ExternalLink } from 'lucide-react'
import { Button } from './ui/button'
import { portfolioConfig } from '../config/portfolio'
import { projectId, publicAnonKey } from '../utils/supabase/info'

const roles = portfolioConfig.personal.roles

export function Hero() {
  const [currentRole, setCurrentRole] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [resumeUrl, setResumeUrl] = useState('')

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100
    const role = roles[currentRole]

    if (!isDeleting && displayText === role) {
      setTimeout(() => setIsDeleting(true), 2000)
      return
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setCurrentRole((prev) => (prev + 1) % roles.length)
      return
    }

    const timeout = setTimeout(() => {
      setDisplayText((prev) => {
        if (isDeleting) {
          return role.substring(0, prev.length - 1)
        } else {
          return role.substring(0, prev.length + 1)
        }
      })
    }, typeSpeed)

    return () => clearTimeout(timeout)
  }, [currentRole, displayText, isDeleting])

  // Check if resume exists on component mount
  useEffect(() => {
    const checkResumeExists = async () => {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-654b3b0b/resume-info`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        })
        const data = await response.json()
        if (data.hasResume) {
          setResumeUrl(data.url)
        }
      } catch (error) {
        console.error('Error checking resume:', error)
      }
    }
    checkResumeExists()
  }, [])

  const scrollToNext = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-[var(--neon-green)] rounded-full opacity-10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--electric-blue)] rounded-full opacity-10 blur-3xl"
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-muted-foreground"
          >
            Hello, I'm
          </motion.p>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight"
          >
            <span className="gradient-text">{portfolioConfig.personal.name}</span>
          </motion.h1>

          {/* Dynamic Role */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-2xl md:text-4xl lg:text-5xl min-h-[1.2em]"
          >
            <span className="text-muted-foreground">I'm a </span>
            <span className="gradient-text-secondary font-bold">
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-[var(--coral)]"
              >
                |
              </motion.span>
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {portfolioConfig.personal.tagline} {portfolioConfig.personal.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-[var(--neon-green)] to-[var(--electric-blue)] text-white hover:opacity-90 transition-opacity group"
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
              <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {resumeUrl ? (
              <Button
                variant="outline"
                size="lg"
                className="border-[var(--electric-blue)] text-[var(--electric-blue)] hover:bg-[var(--electric-blue)] hover:text-white transition-all group"
                onClick={() => window.open(resumeUrl, '_blank')}
              >
                Download Resume
                <Download className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="border-[var(--coral)] text-[var(--coral)] hover:bg-[var(--coral)] hover:text-white transition-all group"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Upload Resume
                <Download className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </Button>
            )}
          </motion.div>

          {/* Floating Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="flex justify-center space-x-6 pt-12"
          >
            {Object.entries(portfolioConfig.social).slice(0, 3).map(([platform, url], index) => (
              <motion.a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="text-muted-foreground hover:text-[var(--electric-blue)] transition-colors capitalize"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {platform}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          onClick={scrollToNext}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-2 text-muted-foreground hover:text-[var(--neon-green)] transition-colors"
          >
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  )
}