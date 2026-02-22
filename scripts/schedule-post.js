#!/usr/bin/env node

/**
 * Schedule a post via Publer API
 * 
 * Usage:
 *   ./schedule-post.js --post-id "story-id-platform" --time "2026-02-22T15:00:00Z"
 *   ./schedule-post.js --post-id "story-id-platform" --now
 */

const fs = require('fs');
const path = require('path');

const PUBLER_API_KEY = process.env.PUBLER_API_KEY || 'PLACEHOLDER_GET_FROM_PUBLER_MONDAY';
const PUBLER_BASE_URL = 'https://api.publer.io/v1';
const BATCH_JSON = path.join(__dirname, '../apps/review/public/batch.json');

// Parse args
const args = process.argv.slice(2);
const postId = args[args.indexOf('--post-id') + 1];
const time = args.includes('--now') ? null : args[args.indexOf('--time') + 1];

if (!postId) {
  console.error('Error: --post-id required');
  process.exit(1);
}

// Find post in batch.json
function findPost(postId) {
  const batch = JSON.parse(fs.readFileSync(BATCH_JSON, 'utf8'));
  
  for (const b of batch.batches) {
    const [storyId, platform] = postId.split('-').slice(0, -1).join('-'), postId.split('-').pop();
    
    if (b.id.includes(storyId)) {
      const format = b.formats.find(f => f.id === platform);
      if (format) {
        return {
          story: b.story,
          format,
          media: format.media
        };
      }
    }
  }
  
  return null;
}

// Schedule via Publer
async function schedulePost(post, scheduleTime) {
  const publerId = post.format.platform;
  
  // Build media URLs
  const mediaUrls = post.media 
    ? [`https://hotkey-ai.netlify.app${post.media}`]
    : [];
  
  const payload = {
    text: post.format.content,
    platforms: [publerId],
    media_urls: mediaUrls
  };
  
  if (scheduleTime) {
    payload.schedule_time = scheduleTime;
  }
  
  if (PUBLER_API_KEY === 'PLACEHOLDER_GET_FROM_PUBLER_MONDAY') {
    console.log('\n⚠️  MOCK MODE - Publer API key not set\n');
    console.log('Would schedule:');
    console.log(JSON.stringify(payload, null, 2));
    console.log(`\n✅ Mock: Post scheduled for ${scheduleTime || 'NOW'}`);
    return {
      id: `mock-${Date.now()}`,
      status: 'scheduled'
    };
  }
  
  const response = await fetch(`${PUBLER_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PUBLER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Publer API error: ${response.status} - ${error}`);
  }
  
  return await response.json();
}

// Main
async function main() {
  const post = findPost(postId);
  
  if (!post) {
    console.error(`Error: Post not found: ${postId}`);
    process.exit(1);
  }
  
  console.log(`\n📅 Scheduling post: ${post.story.title} (${post.format.platform})`);
  
  if (time) {
    console.log(`⏰ Schedule time: ${time}`);
  } else {
    console.log(`⚡ Posting NOW`);
  }
  
  try {
    const result = await schedulePost(post, time);
    console.log(`\n✅ Success! Publer ID: ${result.id}`);
    console.log(`   Status: ${result.status}`);
  } catch (err) {
    console.error(`\n❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
