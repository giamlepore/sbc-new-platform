'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Menu, Home, BookOpen, Award, Settings, ChevronRight, Flame, Moon, Sun, CheckSquare } from 'lucide-react'
import Confetti from 'react-confetti'
import { useTheme } from "next-themes"

const modules = [
  {
    title: 'Getting Started with React',
    lessons: [
      { title: 'Introduction to React', video: 'https://player.vimeo.com/video/336265026' },
      { title: 'Setting up Your Development Environment', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    ],
    tasks: [
      { title: 'Install Node.js', completed: false },
      { title: 'Create a new React project', completed: false },
    ]
  },
  {
    title: 'React Fundamentals',
    lessons: [
      { title: 'Components and Props', video: 'https://player.vimeo.com/video/336265026' },
      { title: 'State and Lifecycle', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
      { title: 'Handling Events', video: 'https://player.vimeo.com/video/336265026' },
    ],
    tasks: [
      { title: 'Create a functional component', completed: false },
      { title: 'Implement state in a class component', completed: false },
      { title: 'Add event handlers to a component', completed: false },
    ]
  },
]

export function CoursePlatform() {
  const [currentModule, setCurrentModule] = useState(0)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<{[key: number]: number[]}>({})
  // const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeTab, setActiveTab] = useState('Home')
  const [dailyStreak, setDailyStreak] = useState(1)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false)
        if (currentLesson < modules[currentModule].lessons.length - 1) {
          setCurrentLesson(currentLesson + 1)
        } else if (currentModule < modules.length - 1) {
          setCurrentModule(currentModule + 1)
          setCurrentLesson(0)
        }
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti, currentLesson, currentModule])

  const handleComplete = () => {
    // setIsCompleted(true)
    setCompletedLessons(prev => ({
      ...prev,
      [currentModule]: [...(prev[currentModule] || []), currentLesson]
    }))
    setShowConfetti(true)
    setDailyStreak(dailyStreak + 1)
  }

  const toggleTask = (moduleIndex: number, taskIndex: number) => {
    const newModules = [...modules]
    newModules[moduleIndex].tasks[taskIndex].completed = !newModules[moduleIndex].tasks[taskIndex].completed
    // In a real application, you would update this state and possibly send it to a backend
  }

  const progress = Object.values(completedLessons).flat().length / modules.reduce((acc, module) => acc + module.lessons.length, 0) * 100

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const renderVideoPlayer = (videoUrl: string) => {
    if (videoUrl.includes('vimeo')) {
      return (
        <iframe
          src={videoUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      )
    } else {
      return (
        <video
          className="w-full h-full"
          src={videoUrl}
          controls
        />
      )
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {showConfetti && <Confetti />}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}>
        <div className="p-4">
          <h2 className="text-2xl font-bold text-primary">EduStream</h2>
        </div>
        <nav className="mt-4">
          {['Home', 'Courses', 'Achievements', 'Tasks', 'Settings'].map((item, index) => (
            <Button 
              key={item} 
              variant="ghost" 
              className={`w-full justify-start ${activeTab === item ? 'bg-accent' : ''}`}
              onClick={() => {
                setActiveTab(item)
                setMenuOpen(false)
              }}
            >
              {index === 0 && <Home className="mr-2 h-4 w-4" />}
              {index === 1 && <BookOpen className="mr-2 h-4 w-4" />}
              {index === 2 && <Award className="mr-2 h-4 w-4 text-primary" />}
              {index === 3 && <CheckSquare className="mr-2 h-4 w-4" />}
              {index === 4 && <Settings className="mr-2 h-4 w-4" />}
              {item}
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-background border-b">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                <Menu className="h-6 w-6" />
              </Button>
              <div className="ml-4 relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-8" placeholder="Search courses..." />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Course Content */}
        <main className="p-4 max-w-7xl mx-auto">
          {activeTab === 'Achievements' ? (
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Your Achievements</h2>
              <div className="flex items-center mb-4">
                <Award className="h-8 w-8 mr-2 text-primary" />
                <span className="text-xl font-semibold">{Object.values(completedLessons).flat().length} Lessons Completed</span>
              </div>
              <div className="flex items-center">
                <Flame className="h-8 w-8 mr-2 text-primary" />
                <span className="text-xl font-semibold">{dailyStreak} Day Streak</span>
              </div>
            </div>
          ) : activeTab === 'Tasks' ? (
            <div className="space-y-6">
              {modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="bg-card p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold mb-4">{module.title}</h2>
                  <ul className="space-y-2">
                    {module.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-center">
                        <Checkbox
                          id={`task-${moduleIndex}-${taskIndex}`}
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(moduleIndex, taskIndex)}
                        />
                        <label htmlFor={`task-${moduleIndex}-${taskIndex}`} className="ml-2">
                          {task.title}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : activeTab === 'Courses' ? (
            <div className="space-y-6">
              {modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="bg-card p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold mb-4">{module.title}</h2>
                  <ul className="space-y-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li 
                        key={lessonIndex} 
                        className="flex items-center p-3 bg-background rounded-lg shadow-sm cursor-pointer hover:bg-accent"
                        onClick={() => {
                          setCurrentModule(moduleIndex)
                          setCurrentLesson(lessonIndex)
                          setActiveTab('Home')
                        }}
                      >
                        <Checkbox 
                          id={`course-lesson-${moduleIndex}-${lessonIndex}`} 
                          checked={completedLessons[moduleIndex]?.includes(lessonIndex)}
                          className="border-input"
                        />
                        <label htmlFor={`course-lesson-${moduleIndex}-${lessonIndex}`} className="ml-2 flex-1">{lesson.title}</label>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{modules[currentModule].title}</h1>
                <p className="text-muted-foreground">Module {currentModule + 1} of {modules.length}</p>
              </div>

              {/* Video Player */}
              <div className="aspect-video bg-black mb-6 rounded-lg overflow-hidden">
                {renderVideoPlayer(modules[currentModule].lessons[currentLesson].video)}
              </div>

              {/* Progress and Completion */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>

              {/* Mark as Completed Button */}
              <Button
                onClick={handleComplete}
                disabled={completedLessons[currentModule]?.includes(currentLesson)}
                className={`w-full ${completedLessons[currentModule]?.includes(currentLesson) ? 'bg-primary hover:bg-primary/90' : ''}`}
              >
                {completedLessons[currentModule]?.includes(currentLesson) ? 'Completed!' : 'Mark as Completed'}
              </Button>

              {/* Modules and Lessons */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                {modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                    <ul className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <li 
                          key={lessonIndex} 
                          className={`flex items-center p-3 bg-card rounded-lg shadow-sm ${currentModule === moduleIndex && currentLesson === lessonIndex ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => {
                            setCurrentModule(moduleIndex)
                            setCurrentLesson(lessonIndex)
                          }}
                        >
                          <Checkbox 
                            id={`lesson-${moduleIndex}-${lessonIndex}`} 
                            checked={completedLessons[moduleIndex]?.includes(lessonIndex)}
                            className="border-input"
                          />
                          <label htmlFor={`lesson-${moduleIndex}-${lessonIndex}`} className="ml-2 flex-1">{lesson.title}</label>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}