# 🎨 Portfolio Customization Guide

Welcome! This guide will help you customize the portfolio website with your own information in just a few simple steps.

## 📁 Main Configuration File

All your personal data is stored in `/config/portfolio.ts`. This is the **only file you need to edit** to make the portfolio your own!

## 🚀 Quick Setup (5 minutes)

### 1. Personal Information
```typescript
personal: {
  name: "Your Full Name",                    // Your name (appears in header, hero, footer)
  roles: ["Your Role", "Another Role"],      // Rotating roles in hero section
  tagline: "Your professional tagline",     // Main tagline
  description: "Detailed description...",   // Hero description
  location: "Your City, Country",           // Current location
  email: "your.email@domain.com",          // Contact email
  avatar: "/path/to/your/photo.jpg",       // Your profile photo
  resumeUrl: "/path/to/resume.pdf",         // Link to your resume
}
```

### 2. Social Links
```typescript
social: {
  dribbble: "https://dribbble.com/username",
  behance: "https://behance.net/username", 
  linkedin: "https://linkedin.com/in/username",
  twitter: "https://twitter.com/username",
  github: "https://github.com/username",
  instagram: "https://instagram.com/username",
}
```

### 3. About Section
Update your career timeline:
```typescript
timeline: [
  {
    year: "2024",
    title: "Your Current Role",
    company: "Current Company",
    description: "What you do in this role...",
    icon: "🚀" // Any emoji
  },
  // Add more timeline entries...
]
```

Update your stats:
```typescript
stats: {
  projects: "10+",     // Number of projects
  experience: "3",     // Years of experience  
  clients: "15+"       // Number of clients
}
```

### 4. Portfolio Projects
Add your projects:
```typescript
projects: [
  {
    id: 1,
    title: "Project Name",
    category: "Project Type", // e.g., "Mobile Design", "Web Design"
    description: "Brief project description",
    image: "path/to/project/image.jpg",
    tags: ["React", "UI/UX", "Mobile"],
    liveUrl: "https://project-live-url.com",
    githubUrl: "https://github.com/username/project",
    details: {
      challenge: "What problem did this project solve?",
      solution: "How did you solve it?", 
      result: "What was the outcome/impact?",
      timeline: "3 months",
      role: "Your role in the project",
      images: [
        "path/to/image1.jpg",
        "path/to/image2.jpg"
      ]
    }
  }
]
```

### 5. Skills
Update your skills and proficiency levels:
```typescript
categories: [
  {
    title: "Design Tools",
    icon: "Palette", // Icon name from Lucide
    skills: [
      { name: "Figma", level: 95 },      // Level from 0-100
      { name: "Photoshop", level: 80 },
    ]
  }
]
```

### 6. Testimonials
Add client testimonials:
```typescript
testimonials: [
  {
    name: "Client Name",
    role: "Their Role", 
    company: "Their Company",
    rating: 5,                          // 1-5 stars
    content: "The testimonial text...",
    project: "Project they're referring to"
  }
]
```

## 🖼️ Adding Your Images

### Option 1: Local Images
1. Add your images to the `public` folder
2. Reference them like: `"/images/your-photo.jpg"`

### Option 2: External Images  
Use any image URL from:
- Your Google Drive (make public)
- Imgur, Cloudinary, etc.
- Social media profile photos

### Option 3: Keep Placeholder Images
The template uses Unsplash images by default - you can keep these while building!

## 🎨 Customizing Colors (Optional)

The template uses these accent colors:
- **Neon Green**: `#00ff88` 
- **Electric Blue**: `#0066ff`
- **Coral**: `#ff6b6b` 
- **Neon Purple**: `#b794f6`

To change them, update the `theme` section:
```typescript
theme: {
  colors: {
    neonGreen: "#your-color",
    electricBlue: "#your-color", 
    coral: "#your-color",
    neonPurple: "#your-color"
  }
}
```

## 📝 Content Writing Tips

### Hero Section
- **Name**: Use your professional name
- **Roles**: 2-4 roles that describe what you do
- **Tagline**: One sentence about your mission/approach
- **Description**: 2-3 sentences about your experience and philosophy

### About Section  
- **Description**: Personal story about your journey into design/development
- **Timeline**: Focus on major career milestones, not every job
- **Stats**: Be honest but impressive (freelance projects count!)

### Projects
- **Quality over quantity**: Show 3-5 of your best projects
- **Tell stories**: Focus on the problem-solution-impact narrative
- **Use real metrics**: "Increased engagement by 150%" is better than "Users loved it"

### Skills
- **Be honest**: Don't claim 95% in tools you barely use
- **Categories**: Group skills logically (Design, Development, Research, etc.)
- **Soft skills**: Include collaboration, communication, problem-solving

### Testimonials
- **Get permission**: Always ask before using someone's testimonial
- **Be specific**: "Great designer" is less valuable than specific outcomes
- **Variety**: Mix different types of clients/projects

## 🚀 Going Live

Once you've customized everything:

1. **Test locally**: Make sure all links work and images load
2. **Deploy**: Push to GitHub and deploy on Vercel/Netlify  
3. **Custom domain**: Add your own domain for professionalism
4. **SEO**: Update the page title and meta description
5. **Analytics**: Add Google Analytics to track visitors

## 💡 Pro Tips

1. **Keep it updated**: Review and update quarterly
2. **Mobile first**: Test on your phone - most visitors will be mobile
3. **Fast loading**: Optimize images and keep them under 1MB
4. **Real content**: Replace ALL placeholder content with your own
5. **Proofread**: Typos hurt credibility - have someone else review
6. **Personal touch**: Add personality - this template is a starting point!

## 🔧 Advanced Customization

### Adding New Sections
You can add new sections by:
1. Creating a new component in `/components/`
2. Adding it to `App.tsx`
3. Adding navigation links in the config

### Modifying Animations
All animations use Framer Motion. You can:
- Adjust timing in `transition` props
- Change animation types (`spring`, `tween`, etc.)
- Add new hover effects

### Changing Layout
The template uses Tailwind CSS classes for layout. Common changes:
- Grid layouts: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Spacing: `p-4`, `m-8`, `space-y-6`
- Colors: `text-blue-500`, `bg-green-100`

## 🆘 Need Help?

- Check the main `README.md` for technical setup
- Review the components to understand the structure
- Use browser dev tools to inspect and modify styles
- The configuration file has examples for every field

---

**Remember**: This is YOUR portfolio. Make it represent who you are! ✨