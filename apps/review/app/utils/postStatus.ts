/**
 * Post Status Management
 * Uses localStorage for persistence across sessions
 */

export type PostStatus = 'unscheduled' | 'scheduled' | 'posted' | 'dismissed'

interface PostStatusData {
  posts: Record<string, {
    status: PostStatus
    timestamp: string
    scheduledTime?: string
    publishedUrl?: string
  }>
  lastUpdated: string
}

const STORAGE_KEY = 'hotkey-post-status'

export function savePostStatus(
  postId: string, 
  status: PostStatus, 
  meta?: { scheduledTime?: string; publishedUrl?: string }
): PostStatusData {
  const data = loadPostStatus()
  data.posts[postId] = {
    status,
    timestamp: new Date().toISOString(),
    ...meta
  }
  data.lastUpdated = new Date().toISOString()
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
  
  return data
}

export function loadPostStatus(): PostStatusData {
  if (typeof window === 'undefined') {
    return { posts: {}, lastUpdated: new Date().toISOString() }
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return { posts: {}, lastUpdated: new Date().toISOString() }
  }
  
  try {
    return JSON.parse(stored)
  } catch (err) {
    console.error('Failed to parse post status:', err)
    return { posts: {}, lastUpdated: new Date().toISOString() }
  }
}

export function getPostStatus(postId: string): PostStatus | null {
  const data = loadPostStatus()
  return data.posts[postId]?.status || null
}

export function exportPostStatus(): void {
  const data = loadPostStatus()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `hotkey-status-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importPostStatus(file: File): Promise<PostStatusData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

export function clearPostStatus(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}
