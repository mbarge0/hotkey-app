'use client'

import { useState, useEffect, useMemo } from 'react'
import { ScheduledPost, UnscheduledPost, Platform, findNextAvailableSlot } from './types'

export default function QueuePage() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [unscheduledPosts, setUnscheduledPosts] = useState<UnscheduledPost[]>([])
  const [draggedPost, setDraggedPost] = useState<UnscheduledPost | null>(null)
  const [viewPlatform, setViewPlatform] = useState<Platform | 'all'>('all')
  const [unscheduledFilter, setUnscheduledFilter] = useState<Platform | 'all'>('all')
  const [showDismissed, setShowDismissed] = useState(false)
  const [selectedPost, setSelectedPost] = useState<UnscheduledPost | null>(null)
  const [editedContent, setEditedContent] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [postStatus, setPostStatus] = useState<Record<string, { status: string, timestamp: string }>>({})

  // Generate next 4 days
  const days = Array.from({ length: 4 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    date.setHours(0, 0, 0, 0)
    return date
  })

  useEffect(() => {
    loadQueue()
    loadPostStatus()
  }, [])

  async function loadQueue() {
    try {
      // Load from batch.json
      const res = await fetch('/review/batch.json')
      if (!res.ok) throw new Error('Failed to load batch')
      
      const data = await res.json()
      const allPosts: UnscheduledPost[] = []
      
      // Extract ALL formats from all batches
      data.batches.forEach((batch: any, batchIndex: number) => {
        batch.formats.forEach((format: any, formatIndex: number) => {
          allPosts.push({
            id: `${batch.id}-${format.id}`,
            storyId: batch.id,
            platform: format.id as Platform,
            title: batch.story.title,
            content: format.content,
            status: 'unscheduled',
            createdAt: batch.createdAt || new Date().toISOString()
          })
        })
      })
      
      // Sort by creation time (oldest first, newest at bottom)
      allPosts.sort((a, b) => {
        return a.createdAt.localeCompare(b.createdAt)
      })
      
      setUnscheduledPosts(allPosts)
    } catch (err) {
      console.error('Error loading queue:', err)
    }
  }

  async function loadPostStatus() {
    try {
      const res = await fetch('/review/post-status.json')
      if (res.ok) {
        const data = await res.json()
        setPostStatus(data.posts || {})
        
        // Apply loaded status to unscheduled posts
        setUnscheduledPosts(prev => prev.map(p => ({
          ...p,
          status: (data.posts[p.id]?.status as any) || p.status
        })))
      }
    } catch (err) {
      console.log('No post status file yet')
    }
  }

  async function savePostStatus(postId: string, status: string) {
    const updated = {
      ...postStatus,
      [postId]: {
        status,
        timestamp: new Date().toISOString()
      }
    }
    
    setPostStatus(updated)
    
    // Save to file (client-side, will need server endpoint for real persistence)
    console.log('Post status updated:', { postId, status })
    // TODO: Implement server endpoint to save post-status.json
  }

  function handleDragStart(post: UnscheduledPost) {
    setDraggedPost(post)
  }

  function handleDrop(date: Date, hour: number) {
    if (!draggedPost) return

    const scheduledTime = new Date(date)
    scheduledTime.setHours(hour, 0, 0, 0)

    const newPost: ScheduledPost = {
      id: draggedPost.id,
      storyId: draggedPost.storyId,
      platform: draggedPost.platform,
      title: draggedPost.title,
      content: draggedPost.content,
      scheduledTime,
      status: 'scheduled'
    }

    setScheduledPosts([...scheduledPosts, newPost])
    setUnscheduledPosts(unscheduledPosts.map(p => 
      p.id === draggedPost.id ? { ...p, status: 'scheduled' } : p
    ))
    setDraggedPost(null)
  }

  function autoSchedulePost(post: UnscheduledPost) {
    const nextSlot = findNextAvailableSlot(post.platform, scheduledPosts)
    
    const newPost: ScheduledPost = {
      id: post.id,
      storyId: post.storyId,
      platform: post.platform,
      title: post.title,
      content: post.content,
      scheduledTime: nextSlot,
      status: 'scheduled'
    }

    setScheduledPosts([...scheduledPosts, newPost])
    setUnscheduledPosts(unscheduledPosts.map(p => 
      p.id === post.id ? { ...p, status: 'scheduled' } : p
    ))
  }

  function dismissPost(post: UnscheduledPost) {
    setUnscheduledPosts(unscheduledPosts.map(p => 
      p.id === post.id ? { ...p, status: 'dismissed' } : p
    ))
    savePostStatus(post.id, 'dismissed')
  }

  function undismissPost(post: UnscheduledPost) {
    setUnscheduledPosts(unscheduledPosts.map(p => 
      p.id === post.id ? { ...p, status: 'unscheduled' } : p
    ))
    savePostStatus(post.id, 'unscheduled')
  }

  function markAsPosted(post: UnscheduledPost) {
    setUnscheduledPosts(unscheduledPosts.map(p => 
      p.id === post.id ? { ...p, status: 'posted' } : p
    ))
    savePostStatus(post.id, 'posted')
  }

  function removeScheduledPost(postId: string) {
    setScheduledPosts(scheduledPosts.filter(p => p.id !== postId))
    setUnscheduledPosts(unscheduledPosts.map(p => 
      p.id === postId ? { ...p, status: 'unscheduled' } : p
    ))
  }

  const platformPosts = viewPlatform === 'all' 
    ? scheduledPosts 
    : scheduledPosts.filter(p => p.platform === viewPlatform)
  
  // Filter by status (useMemo to ensure proper re-rendering)
  const activeUnscheduled = useMemo(
    () => unscheduledPosts.filter(p => p.status === 'unscheduled'),
    [unscheduledPosts]
  )
  const dismissedPosts = useMemo(
    () => unscheduledPosts.filter(p => p.status === 'dismissed'),
    [unscheduledPosts]
  )
  const postedPosts = useMemo(
    () => unscheduledPosts.filter(p => p.status === 'posted'),
    [unscheduledPosts]
  )
  
  // Apply platform filter to unscheduled sidebar (useMemo with proper dependencies)
  const displayedUnscheduled = useMemo(() => {
    const baseList = showDismissed ? dismissedPosts : activeUnscheduled
    
    console.log('Filter recalculating:', {
      unscheduledFilter,
      showDismissed,
      baseListLength: baseList.length,
      baseListPlatforms: baseList.map(p => p.platform)
    })
    
    if (unscheduledFilter === 'all') {
      console.log('Returning all posts:', baseList.length)
      return baseList
    }
    
    const filtered = baseList.filter(p => {
      const match = p.platform === unscheduledFilter
      console.log(`Post ${p.id}: platform=${p.platform}, filter=${unscheduledFilter}, match=${match}`)
      return match
    })
    
    console.log('Filtered result:', filtered.length, 'posts')
    return filtered
  }, [showDismissed, dismissedPosts, activeUnscheduled, unscheduledFilter])

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
                HotKey Schedule
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
            <div 
              className="bg-white rounded-lg shadow-md p-4 sticky top-8"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const scheduledPostId = e.dataTransfer.getData('scheduledPostId')
                if (scheduledPostId) {
                  removeScheduledPost(scheduledPostId)
                }
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {showDismissed ? 'Dismissed' : 'Unscheduled'} ({displayedUnscheduled.length})
                </h3>
                <button
                  onClick={() => setShowDismissed(!showDismissed)}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-medium"
                >
                  {showDismissed ? `← Unscheduled (${activeUnscheduled.length})` : `Dismissed (${dismissedPosts.length})`}
                </button>
              </div>

              {/* Platform filter buttons */}
              <div className="flex gap-1 mb-3">
                {(['all', 'twitter', 'linkedin', 'instagram'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => {
                      console.log('Filter button clicked:', filter)
                      setUnscheduledFilter(filter)
                    }}
                    className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      unscheduledFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto" key={`filter-${unscheduledFilter}-${showDismissed}`}>
                {displayedUnscheduled.map(post => (
                  <div
                    key={`${post.id}-${unscheduledFilter}`}
                    draggable={!showDismissed}
                    onDragStart={() => !showDismissed && handleDragStart(post)}
                    onClick={() => setSelectedPost(post)}
                    className={`bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all ${
                      showDismissed ? 'cursor-pointer' : 'cursor-move hover:border-blue-500'
                    }`}
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
                    <div className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {post.content}
                    </div>
                    <div className="flex gap-2">
                      {showDismissed ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            undismissPost(post)
                          }}
                          className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200"
                        >
                          Restore
                        </button>
                      ) : post.status === 'posted' ? (
                        <div className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium text-center">
                          ✓ Posted
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              autoSchedulePost(post)
                            }}
                            className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200"
                          >
                            Auto-schedule
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsPosted(post)
                            }}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200"
                            title="Mark as Posted"
                          >
                            ✓
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              dismissPost(post)
                            }}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300"
                            title="Dismiss"
                          >
                            ×
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {displayedUnscheduled.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-8">
                    {showDismissed ? 'No dismissed posts' : 'All posts are scheduled!'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setSelectedPost(null)
            setIsEditing(false)
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedPost.platform.charAt(0).toUpperCase() + selectedPost.platform.slice(1)} - {selectedPost.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    selectedPost.platform === 'twitter' ? 'bg-blue-100 text-blue-800' :
                    selectedPost.platform === 'linkedin' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-pink-100 text-pink-800'
                  }`}>
                    {selectedPost.platform.charAt(0).toUpperCase() + selectedPost.platform.slice(1)}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    selectedPost.status === 'unscheduled' ? 'bg-gray-100 text-gray-800' :
                    selectedPost.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedPost.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPost(null)
                  setIsEditing(false)
                }}
                className="text-gray-400 hover:text-gray-600 text-3xl font-light"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 300px)' }}>
              {isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-64 text-sm text-gray-800 font-mono bg-gray-50 p-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  style={{ minHeight: '400px' }}
                />
              ) : (
                <pre 
                  className="whitespace-pre-wrap text-sm text-gray-800 font-mono bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setIsEditing(true)
                    setEditedContent(selectedPost.content)
                  }}
                >
                  {selectedPost.content}
                </pre>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              {/* Action Buttons */}
              <div className="flex justify-between gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(isEditing ? editedContent : selectedPost.content)
                    alert('Copied to clipboard!')
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
                >
                  Copy Content
                </button>
                <div className="flex gap-3">
                  {isEditing && (
                    <button
                      onClick={() => {
                        setUnscheduledPosts(unscheduledPosts.map(p => 
                          p.id === selectedPost.id ? { ...p, content: editedContent } : p
                        ))
                        setSelectedPost({ ...selectedPost, content: editedContent })
                        setIsEditing(false)
                        alert('Changes saved!')
                      }}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Save Changes
                    </button>
                  )}
                  <button
                    onClick={() => {
                      // Post Now - will implement with Publer
                      alert('Post Now - Coming soon with Publer integration!')
                    }}
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Post Now
                  </button>
                  <button
                    onClick={() => {
                      autoSchedulePost(selectedPost)
                      setSelectedPost(null)
                      setIsEditing(false)
                    }}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Auto-Schedule
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPost(null)
                      setIsEditing(false)
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('scheduledPostId', post.id)
                  }}
                  className={`absolute left-14 right-2 top-0 border rounded px-2 py-1 text-xs font-medium cursor-move hover:opacity-90 group ${
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
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemovePost(post.id)
                      }}
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
