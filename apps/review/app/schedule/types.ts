/**
 * Queue system types
 */

export type Platform = 'twitter' | 'linkedin' | 'instagram'

export interface ScheduledPost {
  id: string
  storyId: string
  platform: Platform
  title: string
  content: string
  scheduledTime: Date
  status: 'pending' | 'scheduled' | 'published' | 'failed'
}

export type PostStatus = 'unscheduled' | 'scheduled' | 'dismissed' | 'posted'

export interface UnscheduledPost {
  id: string
  storyId: string
  platform: Platform
  title: string
  content: string
  status: PostStatus
  createdAt: string
}

export interface ChannelRules {
  platform: Platform
  bestTimes: { hour: number; minute: number }[]  // 24-hour format
  minGapHours: number
  maxPostsPerDay: number
  daysActive: number[]  // 0-6, Sun-Sat
}

export const CHANNEL_RULES: Record<Platform, ChannelRules> = {
  twitter: {
    platform: 'twitter',
    bestTimes: [
      { hour: 9, minute: 0 },
      { hour: 12, minute: 0 },
      { hour: 15, minute: 0 },
      { hour: 18, minute: 0 },
      { hour: 21, minute: 0 }
    ],
    minGapHours: 4,
    maxPostsPerDay: 3,
    daysActive: [0, 1, 2, 3, 4, 5, 6]  // All days
  },
  linkedin: {
    platform: 'linkedin',
    bestTimes: [
      { hour: 8, minute: 0 },
      { hour: 12, minute: 0 },
      { hour: 17, minute: 0 }
    ],
    minGapHours: 24,
    maxPostsPerDay: 1,
    daysActive: [1, 2, 3, 4, 5]  // Mon-Fri only
  },
  instagram: {
    platform: 'instagram',
    bestTimes: [
      { hour: 11, minute: 0 },
      { hour: 18, minute: 0 },
      { hour: 21, minute: 0 }
    ],
    minGapHours: 12,
    maxPostsPerDay: 2,
    daysActive: [0, 1, 2, 3, 4, 5, 6]  // All days
  }
}

/**
 * Find next available slot for a platform
 */
export function findNextAvailableSlot(
  platform: Platform,
  existingPosts: ScheduledPost[],
  startDate: Date = new Date()
): Date {
  const rules = CHANNEL_RULES[platform]
  const platformPosts = existingPosts.filter(p => p.platform === platform)
  
  let candidate = new Date(startDate)
  candidate.setSeconds(0, 0)
  
  // Try up to 30 days ahead
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const checkDate = new Date(candidate)
    checkDate.setDate(checkDate.getDate() + dayOffset)
    checkDate.setHours(0, 0, 0, 0)
    
    const dayOfWeek = checkDate.getDay()
    
    // Skip if not an active day for this platform
    if (!rules.daysActive.includes(dayOfWeek)) {
      continue
    }
    
    // Check posts on this day
    const postsOnDay = platformPosts.filter(p => {
      const postDate = new Date(p.scheduledTime)
      return (
        postDate.getFullYear() === checkDate.getFullYear() &&
        postDate.getMonth() === checkDate.getMonth() &&
        postDate.getDate() === checkDate.getDate()
      )
    })
    
    // Skip if max posts per day reached
    if (postsOnDay.length >= rules.maxPostsPerDay) {
      continue
    }
    
    // Try each best time slot
    for (const timeSlot of rules.bestTimes) {
      const slotTime = new Date(checkDate)
      slotTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0)
      
      // Skip if in the past
      if (slotTime <= startDate) {
        continue
      }
      
      // Check if slot is available (respects min gap)
      const hasConflict = platformPosts.some(p => {
        const postTime = new Date(p.scheduledTime)
        const diffHours = Math.abs(slotTime.getTime() - postTime.getTime()) / (1000 * 60 * 60)
        return diffHours < rules.minGapHours
      })
      
      if (!hasConflict) {
        return slotTime
      }
    }
  }
  
  // Fallback: just pick first available time tomorrow
  const fallback = new Date(startDate)
  fallback.setDate(fallback.getDate() + 1)
  fallback.setHours(rules.bestTimes[0].hour, rules.bestTimes[0].minute, 0, 0)
  return fallback
}
