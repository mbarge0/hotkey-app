'use client'

import { useState, useEffect } from 'react'
import { ScheduledPost, UnscheduledPost, Platform, findNextAvailableSlot } from './types'

export default function QueuePage() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [unscheduledPosts, setUnscheduledPosts] = useState<UnscheduledPost[]>([])
  const [draggedPost, setDraggedPost] = useState<UnscheduledPost | null>(null)
  const [viewPlatform, setViewPlatform] = useState<Platform | 'all'>('all')

  // Generate next 4 days
  const days = Array.from({ length: 4 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    date.setHours(0, 0, 0, 0)
    return date
  })

  useEffect(() => {
    loadQueue()
  }, [])

  async function loadQueue() {
    try {
      // Load from batch.json
      const res = await fetch('/review/batch.json')
      if (!res.ok) throw new Error('Failed to load batch')
      
      const data = await res.json()
      const allUnscheduled: UnscheduledPost[] = []
      
      // Extract all unapproved formats from all batches
      data.batches.forEach((batch: any) => {
        batch.formats.forEach((format: any) => {
          if (!format.checked) {
            allUnscheduled.push({
              id: `${batch.id}-${format.id}`,
              storyId: batch.id,
              platform: format.id as Platform,
              title: batch.story.title,
              content: format.content,
              approved: false
            })
          }
        })
      })
      
      // Sort by creation time (oldest first)
      allUnscheduled.sort((a, b) => {
        return a.storyId.localeCompare(b.storyId)
      })
      
      setUnscheduledPosts(allUnscheduled)
    } catch (err) {
      console.error('Error loading queue:', err)
    }
  }

  function handleDragStart(post: UnscheduledPost) {
    setDraggedPost(post)
  }

  function handleDrop(date: Date, hour: number) {
    if (!draggedPost) return

    const scheduledTime = new Date(date)
    scheduledTime.setHours(hour, 0, 0, 0)

    const newPost: ScheduledPost = {
      id: `sched-${Date.now()}`,
      storyId: draggedPost.storyId,
      platform: draggedPost.platform,
      title: draggedPost.title,
      content: draggedPost.content,
      scheduledTime,
      status: 'scheduled'
    }

    setScheduledPosts([...scheduledPosts, newPost])
    setUnscheduledPosts(unscheduledPosts.filter(p => p.id !== draggedPost.id))
    setDraggedPost(null)
  }

  function autoSchedulePost(post: UnscheduledPost) {
    const nextSlot = findNextAvailableSlot(post.platform, scheduledPosts)
    
    const newPost: ScheduledPost = {
      id: `sched-${Date.now()}`,
      storyId: post.storyId,
      platform: post.platform,
      title: post.title,
      content: post.content,
      scheduledTime: nextSlot,
      status: 'scheduled'
    }

    setScheduledPosts([...scheduledPosts, newPost])
    setUnscheduledPosts(unscheduledPosts.filter(p => p.id !== post.id))
  }

  function removeScheduledPost(postId: string) {
    const post = scheduledPosts.find(p => p.id === postId)
    if (!post) return

    const unscheduled: UnscheduledPost = {
      id: `unsch-${Date.now()}`,
      storyId: post.storyId,
      platform: post.platform,
      title: post.title,
      content: post.content,
      approved: true
    }

    setUnscheduledPosts([...unscheduledPosts, unscheduled])
    setScheduledPosts(scheduledPosts.filter(p => p.id !== postId))
  }

  const platformPosts = viewPlatform === 'all' 
    ? scheduledPosts 
    : scheduledPosts.filter(p => p.platform === viewPlatform)
  
  // Show all unscheduled posts (no filtering)
  const displayedUnscheduled = unscheduledPosts

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/review"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Review
              </a>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HotKey Queue
              </h1>
            </div>

            {/* View Filters */}
            <div className="flex gap-2">
              {(['all', 'twitter', 'linkedin', 'instagram'] as const).map(view => (
                <button
                  key={view}
                  onClick={() => setViewPlatform(view)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    viewPlatform === view
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {view === 'all' ? 'All Platforms' : view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Queue Grid */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4">
          {/* Day Columns */}
          {days.map((day, dayIndex) => (
            <DayColumn
              key={day.toISOString()}
              date={day}
              label={dayIndex === 0 ? 'Today' : dayIndex === 1 ? 'Tomorrow' : day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              posts={platformPosts.filter(p => {
                const postDate = new Date(p.scheduledTime)
                return (
                  postDate.getFullYear() === day.getFullYear() &&
                  postDate.getMonth() === day.getMonth() &&
                  postDate.getDate() === day.getDate()
                )
              })}
              onDrop={handleDrop}
              onRemovePost={removeScheduledPost}
            />
          ))}

          {/* Unscheduled Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Unscheduled ({displayedUnscheduled.length})
              </h3>

              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {displayedUnscheduled.map(post => (
                  <div
                    key={post.id}
                    draggable
                    onDragStart={() => handleDragStart(post)}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-move hover:border-blue-500 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        post.platform === 'twitter' ? 'bg-blue-100 text-blue-800' :
                        post.platform === 'linkedin' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-pink-100 text-pink-800'
                      }`}>
                        {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                      </span>
                      <span className="font-medium text-sm text-gray-900 truncate">
                        {post.title}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {post.content}
                    </div>
                    <button
                      onClick={() => autoSchedulePost(post)}
                      className="mt-2 w-full px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200"
                    >
                      Auto-schedule
                    </button>
                  </div>
                ))}

                {displayedUnscheduled.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-8">
                    All posts are scheduled!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DayColumnProps {
  date: Date
  label: string
  posts: ScheduledPost[]
  onDrop: (date: Date, hour: number) => void
  onRemovePost: (postId: string) => void
}

function DayColumn({ date, label, posts, onDrop, onRemovePost }: DayColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 font-semibold text-center">
        {label}
      </div>

      {/* Timeline */}
      <div className="relative" style={{ height: '600px', overflowY: 'auto' }}>
        {hours.map(hour => {
          const hourPosts = posts.filter(p => new Date(p.scheduledTime).getHours() === hour)
          
          return (
            <div
              key={hour}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(date, hour)}
              className="border-b border-gray-100 px-2 py-2 hover:bg-blue-50 transition-colors relative"
              style={{ height: '25px' }}
            >
              <div className="text-xs text-gray-400 absolute left-2 top-1">
                {hour.toString().padStart(2, '0')}:00
              </div>

              {hourPosts.map(post => (
                <div
                  key={post.id}
                  className={`absolute left-14 right-2 top-0 border rounded px-2 py-1 text-xs font-medium cursor-pointer hover:opacity-90 group ${
                    post.platform === 'twitter' ? 'bg-blue-100 border-blue-300 text-blue-900' :
                    post.platform === 'linkedin' ? 'bg-indigo-100 border-indigo-300 text-indigo-900' :
                    'bg-pink-100 border-pink-300 text-pink-900'
                  }`}
                  style={{ zIndex: 10 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 truncate">
                      <span className="font-semibold text-[10px] uppercase">
                        {post.platform === 'twitter' ? 'X' : post.platform === 'linkedin' ? 'Li' : 'IG'}
                      </span>
                      <span className="truncate">{post.title}</span>
                    </div>
                    <button
                      onClick={() => onRemovePost(post.id)}
                      className="ml-2 hover:text-red-600 opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
