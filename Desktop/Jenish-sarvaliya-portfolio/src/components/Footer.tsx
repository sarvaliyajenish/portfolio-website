import { motion } from 'motion/react'
import { Heart, ArrowUp } from 'lucide-react'
import { Button } from './ui/button'
import { portfolioConfig } from '../config/portfolio'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-12 px-4 sm:px-6 lg:px-8 mt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/50 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Back to top button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <Button
            onClick={scrollToTop}
            variant="outline"
            size="sm"
            className="rounded-full hover:bg-[var(--electric-blue)] hover:text-white hover:border-[var(--electric-blue)] transition-all group"
          >
            <ArrowUp className="h-4 w-4 mr-2 group-hover:-translate-y-1 transition-transform" />
            Back to top
          </Button>
        </motion.div>

        {/* Main footer content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 text-center md:text-left"
        >
          {/* Logo and tagline */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text">{portfolioConfig.personal.name}</h3>
            <p className="text-muted-foreground">
              {portfolioConfig.footer.tagline}
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="font-bold">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {portfolioConfig.footer.quickLinks.map((link) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  whileHover={{ x: 5 }}
                  className="text-muted-foreground hover:text-[var(--electric-blue)] transition-colors"
                >
                  {link}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h4 className="font-bold">Let's Connect</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>{portfolioConfig.personal.email}</p>
              <p>{portfolioConfig.personal.location}</p>
              <div className="flex justify-center md:justify-start space-x-4 pt-2">
                {Object.entries(portfolioConfig.social).slice(0, 3).map(([platform, url]) => (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="text-muted-foreground hover:text-[var(--electric-blue)] transition-colors capitalize"
                  >
                    {platform}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="my-8 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-muted-foreground"
        >
          <p className="flex items-center justify-center">
            © {currentYear} {portfolioConfig.personal.name}. {portfolioConfig.footer.copyright.split('❤️')[0]}
            <motion.span
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="mx-1"
            >
              <Heart className="h-4 w-4 text-[var(--coral)] fill-current" />
            </motion.span>
            {portfolioConfig.footer.copyright.split('❤️')[1]}
          </p>
        </motion.div>

        {/* Floating elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-8 left-1/4 w-2 h-2 bg-[var(--neon-green)] rounded-full"
          />
          <motion.div
            animate={{
              y: [0, 15, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-8 right-1/3 w-3 h-3 bg-[var(--electric-blue)] rounded-full"
          />
        </div>
      </div>
    </footer>
  )
}