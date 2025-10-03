import { useState } from 'react'
import { Save, XCircle, Plus, Trash2, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Slider } from './ui/slider'
import { Card } from './ui/card'
import { portfolioConfig } from '../config/portfolio'

const iconOptions = [
  { value: 'Palette', label: 'Palette' },
  { value: 'Code', label: 'Code' },
  { value: 'Users', label: 'Users' },
  { value: 'Search', label: 'Search' },
  { value: 'Lightbulb', label: 'Lightbulb' },
  { value: 'Zap', label: 'Zap' },
  { value: 'BookOpen', label: 'BookOpen' },
  { value: 'Star', label: 'Star' },
  { value: 'Calendar', label: 'Calendar' }
]

interface SkillsEditorProps {
  onClose: () => void
}

export default function SkillsEditor({ onClose }: SkillsEditorProps) {
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

  const handleSave = () => {
    console.log('Saving skills data:', editedData)
    onClose()
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
    <div className="space-y-8 mb-16">
      {/* Save/Discard Controls */}
      <div className="flex justify-center space-x-2 mb-8">
        <Button
          onClick={handleSave}
          size="sm"
          className="flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <XCircle className="h-4 w-4" />
          <span>Discard</span>
        </Button>
      </div>

      {/* Header Editing */}
      <div className="text-center mb-16 space-y-4">
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

      {/* Technical Skills Editing */}
      <div className="space-y-8">
        <h3 className="text-xl font-bold">Technical Skills Categories</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {editedData.categories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="p-6 border-2 border-dashed border-muted">
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
              
              <div className="space-y-4 mb-6">
                <Input
                  value={category.title}
                  onChange={(e) => updateCategory(categoryIndex, 'title', e.target.value)}
                  className="font-bold"
                  placeholder="Category title"
                />
                <Select
                  value={category.icon}
                  onValueChange={(value) => updateCategory(categoryIndex, 'icon', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2 p-3 border rounded">
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
                    
                    <div className="flex items-center space-x-2">
                      <Input
                        value={skill.name}
                        onChange={(e) => updateSkill(categoryIndex, skillIndex, 'name', e.target.value)}
                        className="flex-1"
                        placeholder="Skill name"
                      />
                      <span className="text-sm text-muted-foreground min-w-[3rem]">
                        {skill.level}%
                      </span>
                    </div>
                    
                    <Slider
                      value={[skill.level]}
                      onValueChange={(value) => updateSkill(categoryIndex, skillIndex, 'level', value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                ))}
                
                <Button
                  onClick={() => addSkill(categoryIndex)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
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
      </div>

      {/* Soft Skills Editing */}
      <div className="space-y-8">
        <h3 className="text-xl font-bold">Soft Skills</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {editedData.softSkills.map((skill, index) => (
            <Card key={index} className="p-6 border-2 border-dashed border-muted">
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
              
              <div className="space-y-3">
                <Input
                  value={skill.name}
                  onChange={(e) => updateSoftSkill(index, 'name', e.target.value)}
                  className="font-bold text-center"
                  placeholder="Skill name"
                />
                <Select
                  value={skill.icon}
                  onValueChange={(value) => updateSoftSkill(index, 'icon', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  value={skill.description}
                  onChange={(e) => updateSoftSkill(index, 'description', e.target.value)}
                  className="text-sm"
                  placeholder="Skill description"
                  rows={3}
                />
              </div>
            </Card>
          ))}
        </div>
        
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
      </div>

      {/* Constellation Editing */}
      <div className="space-y-8">
        <h3 className="text-xl font-bold">Skills Constellation</h3>
        <Card className="p-6 border-2 border-dashed border-muted">
          <div className="space-y-4 mb-6">
            <Input
              value={editedData.constellation.title}
              onChange={(e) => setEditedData(prev => ({
                ...prev,
                constellation: { ...prev.constellation, title: e.target.value }
              }))}
              className="text-3xl font-bold text-center"
              placeholder="Constellation title"
            />
            <Input
              value={editedData.constellation.subtitle}
              onChange={(e) => setEditedData(prev => ({
                ...prev,
                constellation: { ...prev.constellation, subtitle: e.target.value }
              }))}
              className="text-lg text-center"
              placeholder="Constellation subtitle"
            />
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Constellation Skills</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {editedData.constellation.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={skill}
                    onChange={(e) => updateConstellationSkill(index, e.target.value)}
                    className="flex-1"
                    placeholder="Skill"
                  />
                  <Button
                    onClick={() => removeConstellationSkill(index)}
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 rounded-full p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button
              onClick={addConstellationSkill}
              size="sm"
              variant="outline"
              className="w-full mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Constellation Skill
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}