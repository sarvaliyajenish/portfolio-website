import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'motion/react'
import { Send, Mail, MapPin, Coffee, Calendar, Heart } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { toast } from 'sonner@2.0.3'
import { portfolioConfig } from '../config/portfolio'
import { ResumeUpload } from './ResumeUpload'
import { projectId, publicAnonKey } from '../utils/supabase/info'

// Icon mapping
const iconMap = {
  Mail,
  MapPin,
  Coffee
} as const

const contactInfo = portfolioConfig.contact.info.map((info, index) => ({
  ...info,
  icon: iconMap[info.icon as keyof typeof iconMap] || Mail,
  color: ['var(--neon-green)', 'var(--electric-blue)', 'var(--coral)'][index] || 'var(--electric-blue)'
}))

const colors = ['var(--coral)', 'var(--electric-blue)', 'var(--neon-green)', 'var(--neon-purple)']
const socialLinks = Object.entries(portfolioConfig.social).slice(0, 4).map(([name, url], index) => ({
  name: name.charAt(0).toUpperCase() + name.slice(1),
  url,
  color: colors[index]
}))

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resumeUrl, setResumeUrl] = useState('')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success("Message sent successfully! I'll get back to you soon.")
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsSubmitting(false)
  }

  const handleResumeUploaded = (url: string) => {
    setResumeUrl(url)
  }

  return (
    <section id="contact" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          {portfolioConfig.contact.title.split(' ').map((word, index) => 
            index === portfolioConfig.contact.title.split(' ').length - 1 ? (
              <span key={index} className="gradient-text">{word}</span>
            ) : (
              <span key={index}>{word} </span>
            )
          )}
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {portfolioConfig.contact.description}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="p-8">
            <div className="flex items-center mb-6">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="w-12 h-12 bg-gradient-to-br from-[var(--neon-green)] to-[var(--electric-blue)] rounded-lg flex items-center justify-center mr-4"
              >
                <Send className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold">Send me a message</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                    className="focus:border-[var(--electric-blue)] transition-colors"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    className="focus:border-[var(--electric-blue)] transition-colors"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  required
                  className="focus:border-[var(--electric-blue)] transition-colors"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your project or just say hello!"
                  rows={6}
                  required
                  className="focus:border-[var(--electric-blue)] transition-colors resize-none"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[var(--neon-green)] to-[var(--electric-blue)] text-white hover:opacity-90 transition-opacity group"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Calendar className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>

        {/* Contact Info & Social */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8"
        >
          {/* Contact Information */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Get in touch</h3>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => info.href && info.href !== '#' && window.open(info.href, '_blank')}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${info.color}20` }}
                  >
                    <info.icon 
                      className="h-6 w-6" 
                      style={{ color: info.color }}
                    />
                  </div>
                  <div>
                    <div className="font-medium">{info.label}</div>
                    <div className="text-muted-foreground">{info.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Resume Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.7 }}
          >
            <ResumeUpload 
              onResumeUploaded={handleResumeUploaded}
              currentResumeUrl={resumeUrl}
            />
          </motion.div>

          {/* Social Links */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Follow my work</h3>
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 rounded-lg text-center hover:bg-muted/50 transition-all border-2 border-transparent hover:border-current"
                  style={{ color: social.color }}
                >
                  <div className="font-medium">{social.name}</div>
                </motion.a>
              ))}
            </div>
          </Card>

          {/* Fun Fact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <Card className="p-8 text-center bg-gradient-to-br from-[var(--neon-green)]/10 to-[var(--electric-blue)]/10 border-none">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--coral)] to-[var(--neon-purple)] rounded-full flex items-center justify-center"
              >
                <Heart className="h-8 w-8 text-white fill-current" />
              </motion.div>
              <h4 className="font-bold mb-2">{portfolioConfig.contact.funFact.title}</h4>
              <p className="text-muted-foreground">
                {portfolioConfig.contact.funFact.description}
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/6 w-4 h-4 bg-[var(--neon-green)] rounded-full opacity-20"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 right-1/5 w-6 h-6 bg-[var(--electric-blue)] rounded-full opacity-20"
        />
      </div>
    </section>
  )
}