'use client'

import { useState, useEffect } from 'react'
import TwitterPreview from './components/TwitterPreview'
import LinkedInPreview from './components/LinkedInPreview'
import InstagramPreview from './components/InstagramPreview'
import { profileConfig } from './config/profile'
import { generateStoryContext } from './utils/storyContext'
import { loadPostStatus, getPostStatus, savePostStatus } from './utils/postStatus'

interface Format {
  id: string
  name: string
  platform: string
  content: string
  score: number
  publishType: 'auto' | 'manual' | 'design' | 'video'
  scheduleOptions: string[]
  checked: boolean
  scheduleTime: string
  media?: string
}

interface Batch {
  id: string
  story: {
    title: string
    rawTitle?: string
    description: string
    pillar: string
    score: number
    timestamp?: string
  }
  formats: Format[]
  createdAt: string
}

interface BatchData {
  batches: Batch[]
  currentIndex: number
  total: number
}

export default function HotKey() {
  const [batchData, setBatchData] = useState<BatchData | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null)
  const [filter, setFilter] = useState<'all' | 'auto' | 'manual' | 'design' | 'video'>('all')
  const [editedContent, setEditedContent] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [formatStatuses, setFormatStatuses] = useState<Record<string, string>>({})
  
  // Filter batches based on completion status
  const filteredBatches = batchData?.batches.filter(batch => {
    const hasUnscheduled = batch.formats.some(format => {
      const postId = `${batch.id}-${format.id}`
      const status = getPostStatus(postId)
      return !status || status === 'unscheduled'
    })
    
    return showCompleted ? !hasUnscheduled : hasUnscheduled
  })
  
  const batch = filteredBatches?.[currentIndex] || null
  const totalActive = batchData?.batches.filter(b => {
    return b.formats.some(f => {
      const status = getPostStatus(`${b.id}-${f.id}`)
      return !status || status === 'unscheduled'
    })
  }).length || 0
  const totalCompleted = (batchData?.batches.length || 0) - totalActive

  useEffect(() => {
    loadBatch()
    loadStatuses()
  }, [])
  
  function loadStatuses() {
    const data = loadPostStatus()
    const statusMap: Record<string, string> = {}
    Object.entries(data.posts).forEach(([id, info]) => {
      statusMap[id] = info.status
    })
    setFormatStatuses(statusMap)
  }
  
  function updateFormatStatus(formatId: string, status: string) {
    const postId = batch ? `${batch.id}-${formatId}` : formatId
    savePostStatus(postId, status as any)
    setFormatStatuses(prev => ({ ...prev, [postId]: status }))
  }
  
  function getFormatStatus(formatId: string): string | null {
    const postId = batch ? `${batch.id}-${formatId}` : formatId
    return formatStatuses[postId] || getPostStatus(postId) || null
  }

  async function loadBatch() {
    try {
      // Fetch from /review/ subdirectory when deployed together
      const res = await fetch('/review/batch.json')
      if (!res.ok) {
        throw new Error('Failed to load batch')
      }
      const data = await res.json()
      
      // Handle both old (single batch) and new (multi-batch) format
      if (data.batches) {
        setBatchData(data)
        setCurrentIndex(data.currentIndex || 0)
      } else {
        // Convert old format to new
        setBatchData({
          batches: [data],
          currentIndex: 0,
          total: 1
        })
      }
      setLoading(false)
    } catch (err) {
      console.error('Error loading batch:', err)
      // Fallback to mock data
      loadMockBatch()
      setLoading(false)
    }
  }

  function loadMockBatch() {
    const mockBatch: Batch = {
      id: 'batch-2026-02-21',
      story: {
        title: 'App Store Defense System',
        description: 'Built 5-script defense system after 5 rejections',
        pillar: 'ai',
        score: 78
      },
      formats: [
        {
          id: 'twitter',
          name: 'Twitter',
          platform: 'Twitter',
          content: 'Mock content...',
          score: 92,
          publishType: 'auto',
          scheduleOptions: ['Now'],
          checked: true,
          scheduleTime: 'Now'
        }
      ],
      createdAt: new Date().toISOString()
    }
    
    setBatchData({
      batches: [mockBatch],
      currentIndex: 0,
      total: 1
    })
  }

  function toggleFormat(id: string) {
    if (!batch || !batchData) return
    const updatedBatches = [...batchData.batches]
    updatedBatches[currentIndex] = {
      ...batch,
      formats: batch.formats.map(f => 
        f.id === id ? { ...f, checked: !f.checked } : f
      )
    }
    setBatchData({ ...batchData, batches: updatedBatches })
  }

  function approveFormat(id: string) {
    if (!batch || !batchData) return
    const updatedBatches = [...batchData.batches]
    updatedBatches[currentIndex] = {
      ...batch,
      formats: batch.formats.map(f => 
        f.id === id ? { ...f, checked: true } : f
      )
    }
    setBatchData({ ...batchData, batches: updatedBatches })
    alert(`Approved: ${batch.formats.find(f => f.id === id)?.name}`)
  }

  function updateScheduleTime(id: string, time: string) {
    if (!batch || !batchData) return
    const updatedBatches = [...batchData.batches]
    updatedBatches[currentIndex] = {
      ...batch,
      formats: batch.formats.map(f => 
        f.id === id ? { ...f, scheduleTime: time } : f
      )
    }
    setBatchData({ ...batchData, batches: updatedBatches })
  }

  function handleScheduleSelected() {
    if (!batch) return
    const selected = batch.formats.filter(f => f.checked)
    
    // In production, this would call API to schedule posts
    alert(`Scheduling ${selected.length} posts:\n\n${selected.map(f => `${f.name} → ${f.scheduleTime}`).join('\n')}`)
  }

  function handleSaveAllDrafts() {
    alert('Saved all formats as drafts')
  }

  function handleDiscardUnselected() {
    if (!batch || !batchData) return
    const unselected = batch.formats.filter(f => !f.checked)
    if (confirm(`Discard ${unselected.length} unselected formats?`)) {
      const updatedBatches = [...batchData.batches]
      updatedBatches[currentIndex] = {
        ...batch,
        formats: batch.formats.filter(f => f.checked)
      }
      setBatchData({ ...batchData, batches: updatedBatches })
    }
  }

  const topPlatforms = batch?.formats.filter(f => 
    ['twitter', 'linkedin', 'instagram'].includes(f.id)
  ) || []
  
  const otherFormats = batch?.formats.filter(f => 
    !['twitter', 'linkedin', 'instagram'].includes(f.id)
  ).filter(f => {
    if (filter === 'all') return true
    return f.publishType === filter
  }) || []

  const selectedCount = batch?.formats.filter(f => f.checked).length || 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading batch...</div>
      </div>
    )
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">No batch found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HotKey
              </h1>
              
              {/* Status indicator */}
              <div className="text-sm text-gray-600">
                {showCompleted ? `${totalCompleted} completed` : `${totalActive} active`}
              </div>
              
              {/* Story navigation */}
              {batchData && (filteredBatches?.length || 0) > 1 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                    title="Previous story"
                  >
                    ← Prev
                  </button>
                  
                  <div className="relative">
                    <select
                      value={currentIndex}
                      onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-xs"
                      style={{ minWidth: '200px' }}
                    >
                      {filteredBatches?.map((b, idx) => (
                        <option key={b.id} value={idx}>
                          {idx + 1}. {b.story.title.slice(0, 50)}{b.story.title.length > 50 ? '...' : ''}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      ▼
                    </div>
                  </div>
                  
                  <span className="text-xs text-gray-500 font-medium">
                    {currentIndex + 1} of {filteredBatches?.length || 0}
                  </span>
                  
                  <button
                    onClick={() => setCurrentIndex(Math.min((filteredBatches?.length || 1) - 1, currentIndex + 1))}
                    disabled={currentIndex === (filteredBatches?.length || 1) - 1}
                    className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                    title="Next story"
                  >
                    Next →
                  </button>
                </div>
              )}
              
              <span className="text-sm font-medium text-gray-700">{batch.story.title}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium uppercase">
                {batch.story.pillar}
              </span>
              <span className="text-sm text-gray-500">{batch.story.score}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                {showCompleted ? `← Active (${totalActive})` : `Completed (${totalCompleted}) →`}
              </button>
              <a
                href="/review/schedule"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
              >
                View Schedule
              </a>
              <button
                onClick={() => {
                  if (!batch || !batchData) return
                  // Approve all top 3 platforms
                  const topIds = ['twitter', 'linkedin', 'instagram']
                  const updatedBatches = [...batchData.batches]
                  updatedBatches[currentIndex] = {
                    ...batch,
                    formats: batch.formats.map(f => 
                      topIds.includes(f.id) ? { ...f, checked: true } : f
                    )
                  }
                  setBatchData({ ...batchData, batches: updatedBatches })
                  alert('Approved top 3 platforms: Twitter, LinkedIn, Instagram')
                }}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium shadow-md transition-all"
              >
                Approve Top 3
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Formats (3/4 width) */}
          <div className="lg:col-span-3">
            {/* Top 3 Platforms - Big Preview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {topPlatforms.map(format => (
                <div key={format.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all">
                  {/* Preview - Clickable */}
                  <div 
                    className="p-6 relative cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedFormat(format)}
                  >
                    {format.id === 'twitter' && (
                      <TwitterPreview 
                        content={format.content}
                        media={format.media}
                      />
                    )}
                    {format.id === 'linkedin' && (
                      <LinkedInPreview 
                        content={format.content}
                        media={format.media}
                      />
                    )}
                    {format.id === 'instagram' && (
                      <InstagramPreview 
                        content={format.content}
                        media={format.media}
                      />
                    )}
                  </div>

                  {/* Controls */}
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={format.checked}
                          onChange={() => toggleFormat(format.id)}
                          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{format.name}</div>
                          <div className="text-sm text-gray-500">
                            Score: {format.score}
                            {getFormatStatus(format.id) && (
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                                getFormatStatus(format.id) === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                                getFormatStatus(format.id) === 'posted' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {getFormatStatus(format.id) === 'scheduled' ? '📅 Scheduled' :
                                 getFormatStatus(format.id) === 'posted' ? '✅ Posted' :
                                 getFormatStatus(format.id)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateFormatStatus(format.id, 'scheduled')
                          }}
                          className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-sm font-medium transition-colors"
                          title="Mark as Scheduled"
                        >
                          🕐 Scheduled
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateFormatStatus(format.id, 'posted')
                          }}
                          className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors"
                          title="Mark as Posted"
                        >
                          ✅ Posted
                        </button>
                      </div>
                    </div>

                    {format.checked && (
                      <select
                        value={format.scheduleTime}
                        onChange={(e) => updateScheduleTime(format.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        {format.scheduleOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Other Platforms */}
            {otherFormats.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Other Formats</h3>
                  <div className="flex gap-2">
                    {(['all', 'auto', 'manual', 'design', 'video'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filter === f
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherFormats.map(format => (
                    <div
                      key={format.id}
                      className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                        format.checked ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={format.checked}
                              onChange={() => toggleFormat(format.id)}
                              className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">{format.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  format.publishType === 'auto' ? 'bg-green-100 text-green-800' :
                                  format.publishType === 'manual' ? 'bg-yellow-100 text-yellow-800' :
                                  format.publishType === 'design' ? 'bg-purple-100 text-purple-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {format.publishType}
                                </span>
                                <span className="text-xs text-gray-500">{format.score}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-gray-700 line-clamp-3 mb-3">
                          {format.content}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedFormat(format)}
                            className="flex-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-medium"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => approveFormat(format.id)}
                            className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded font-medium"
                          >
                            Approve
                          </button>
                        </div>

                        {format.checked && (
                          <select
                            value={format.scheduleTime}
                            onChange={(e) => updateScheduleTime(format.id, e.target.value)}
                            className="w-full mt-3 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          >
                            {format.scheduleOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Column - Context Sidebar (1/4 width) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What We Did</h3>
              
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                {(() => {
                  const context = generateStoryContext(batch.story, profileConfig.dna.focus)
                  return (
                    <>
                      <p>{context.intro}</p>
                      <p>{context.insight}</p>
                      <div className="space-y-2 text-sm text-gray-600">
                        {context.platformNotes.map((note, i) => (
                          <p key={i}>{note}</p>
                        ))}
                      </div>
                    </>
                  )
                })()}

                {batch.story.timestamp && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Captured: {new Date(batch.story.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-lg">{selectedCount} formats selected</span>
              {selectedCount > 0 && (
                <span className="ml-2">
                  ({batch.formats.filter(f => f.checked && f.publishType === 'auto').length} auto, {' '}
                  {batch.formats.filter(f => f.checked && f.publishType === 'manual').length} manual)
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDiscardUnselected}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Discard Unselected
              </button>
              <button
                onClick={handleSaveAllDrafts}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Save All as Drafts
              </button>
              <button
                onClick={handleScheduleSelected}
                disabled={selectedCount === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedCount > 0
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Schedule Selected ({selectedCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedFormat && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setSelectedFormat(null)
            setIsEditing(false)
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedFormat.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    selectedFormat.publishType === 'auto' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedFormat.publishType}
                  </span>
                  <span className="text-sm text-gray-500">Score: {selectedFormat.score}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedFormat(null)
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
                    setEditedContent(selectedFormat.content)
                  }}
                >
                  {selectedFormat.content}
                </pre>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              {/* Schedule Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                <select
                  value={selectedFormat.scheduleTime}
                  onChange={(e) => {
                    if (!batch || !batchData) return
                    const updatedBatches = [...batchData.batches]
                    updatedBatches[currentIndex] = {
                      ...batch,
                      formats: batch.formats.map(f => 
                        f.id === selectedFormat.id ? { ...f, scheduleTime: e.target.value } : f
                      )
                    }
                    setBatchData({ ...batchData, batches: updatedBatches })
                    setSelectedFormat({ ...selectedFormat, scheduleTime: e.target.value })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  {selectedFormat.scheduleOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(isEditing ? editedContent : selectedFormat.content)
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
                        if (!batch || !batchData) return
                        const updatedBatches = [...batchData.batches]
                        updatedBatches[currentIndex] = {
                          ...batch,
                          formats: batch.formats.map(f => 
                            f.id === selectedFormat.id ? { ...f, content: editedContent } : f
                          )
                        }
                        setBatchData({ ...batchData, batches: updatedBatches })
                        setSelectedFormat({ ...selectedFormat, content: editedContent })
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
                      approveFormat(selectedFormat.id)
                      setSelectedFormat(null)
                      setIsEditing(false)
                    }}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Approve & Schedule
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFormat(null)
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

      {/* Bottom padding for fixed action bar */}
      <div className="h-24"></div>
    </div>
  )
}
