/**
 * Publer API Integration
 * 
 * Schedule and publish posts to social media via Publer
 */

const PUBLER_API_KEY = process.env.PUBLER_API_KEY || 'PLACEHOLDER_GET_FROM_PUBLER_MONDAY';
const PUBLER_BASE_URL = 'https://api.publer.io/v1';

export interface PublerPost {
  text: string
  platforms: string[]  // ['twitter', 'linkedin', 'instagram']
  media_urls?: string[]
  schedule_time?: string  // ISO 8601 timestamp
}

export interface PublerResponse {
  id: string
  status: string
  post_id?: string
  error?: string
}

/**
 * Schedule a post via Publer
 */
export async function schedulePost(post: PublerPost): Promise<PublerResponse> {
  if (PUBLER_API_KEY === 'PLACEHOLDER_GET_FROM_PUBLER_MONDAY') {
    console.warn('⚠️  Publer API key not set - using mock response');
    return {
      id: `mock-${Date.now()}`,
      status: 'scheduled',
      post_id: `mock-post-${Date.now()}`
    };
  }

  try {
    const response = await fetch(`${PUBLER_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PUBLER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Publer API error: ${response.status} - ${error}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Publer API error:', err);
    throw err;
  }
}

/**
 * Post immediately (no scheduling)
 */
export async function postNow(post: Omit<PublerPost, 'schedule_time'>): Promise<PublerResponse> {
  return schedulePost(post as PublerPost);
}

/**
 * Get connected social accounts
 */
export async function getAccounts(): Promise<any> {
  if (PUBLER_API_KEY === 'PLACEHOLDER_GET_FROM_PUBLER_MONDAY') {
    return {
      accounts: [
        { id: 'mock-twitter', platform: 'twitter', username: '@matthewbarge' },
        { id: 'mock-linkedin', platform: 'linkedin', username: 'Matt Barge' },
        { id: 'mock-instagram', platform: 'instagram', username: '@themattbarge' }
      ]
    };
  }

  const response = await fetch(`${PUBLER_BASE_URL}/accounts`, {
    headers: {
      'Authorization': `Bearer ${PUBLER_API_KEY}`
    }
  });

  return await response.json();
}

/**
 * Delete/cancel a scheduled post
 */
export async function deletePost(postId: string): Promise<void> {
  if (PUBLER_API_KEY === 'PLACEHOLDER_GET_FROM_PUBLER_MONDAY') {
    console.warn('⚠️  Mock: Would delete post', postId);
    return;
  }

  await fetch(`${PUBLER_BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${PUBLER_API_KEY}`
    }
  });
}
