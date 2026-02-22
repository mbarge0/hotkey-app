#!/usr/bin/env node

/**
 * HotKey Content Watcher
 * 
 * Watches content-inbox for new story files
 * Auto-generates posts for all platforms
 * Updates batch.json
 * Sends Telegram notification
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONTENT_INBOX = path.join(process.env.HOME, 'Library/Mobile Documents/com~apple~CloudDocs/content-inbox');
const BATCH_JSON = path.join(__dirname, '../apps/review/public/batch.json');
const PROCESSED_FILE = path.join(__dirname, '../.processed-stories.json');

// Load processed stories
function loadProcessed() {
  try {
    return JSON.parse(fs.readFileSync(PROCESSED_FILE, 'utf8'));
  } catch {
    return { stories: [] };
  }
}

function saveProcessed(data) {
  fs.writeFileSync(PROCESSED_FILE, JSON.stringify(data, null, 2));
}

// Parse story file
function parseStory(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract metadata
  const titleMatch = content.match(/^#\s+\[([\d-]+\s+[\d:]+)\]\s+(.+)$/m);
  const descMatch = content.match(/## What Happened\n([\s\S]+?)(?=\n## |$)/);
  const whyMatch = content.match(/## Why It Matters\n([\s\S]+?)(?=\n## |$)/);
  const pillarMatch = content.match(/## Suggested Pillar\n(\w+)/);
  const scoreMatch = content.match(/\*\*Score:\*\*\s+(\d+)/);
  const mediaMatch = content.match(/## Media\n(.+)/);
  
  return {
    id: path.basename(filePath, '.md'),
    title: titleMatch ? titleMatch[2] : 'Untitled',
    timestamp: titleMatch ? titleMatch[1] : new Date().toISOString(),
    description: descMatch ? descMatch[1].trim() : '',
    whyItMatters: whyMatch ? whyMatch[1].trim() : '',
    pillar: pillarMatch ? pillarMatch[1] : 'ai',
    score: scoreMatch ? parseInt(scoreMatch[1]) : 75,
    media: mediaMatch && mediaMatch[1] !== 'None' ? mediaMatch[1].trim() : null,
    createdAt: new Date().toISOString()
  };
}

// Generate posts using Claude
async function generatePosts(story) {
  console.log(`\n🤖 Generating posts for: ${story.title}`);
  
  try {
    const { generatePosts: claudeGenerate } = require('./generate-with-claude.js');
    return await claudeGenerate(story);
  } catch (err) {
    console.error('Error generating posts:', err.message);
    
    // Fallback: basic formatting
    return {
      twitter: `${story.title}\n\n${story.description.slice(0, 250)}...\n\nThoughts?`,
      linkedin: `${story.title}\n\n${story.description}\n\n${story.whyItMatters}\n\nWhat's your experience with this?`,
      instagram: `${story.title} 💡\n\n${story.description.slice(0, 250)}...\n\n#BuildInPublic #AI #Tech #Productivity #IndieHacker`
    };
  }
}

// Update batch.json
function updateBatchJson(story, posts) {
  console.log(`\n📝 Updating batch.json...`);
  
  let batch = { batches: [], total: 0 };
  
  try {
    batch = JSON.parse(fs.readFileSync(BATCH_JSON, 'utf8'));
  } catch (err) {
    console.log('Creating new batch.json');
  }
  
  // Create new batch entry
  const newBatch = {
    id: story.id,
    story: {
      title: story.title,
      rawTitle: story.title,
      description: story.description,
      pillar: story.pillar,
      score: story.score,
      timestamp: story.timestamp
    },
    formats: [
      {
        id: 'twitter',
        name: 'Twitter',
        platform: 'Twitter',
        content: posts.twitter,
        score: 92,
        publishType: 'auto',
        scheduleOptions: ['Now', 'Sun 12 PM', 'Sun 3 PM', 'Sun 6 PM', 'Mon 9 AM', 'Custom'],
        checked: false,
        scheduleTime: 'Now',
        media: story.media
      },
      {
        id: 'linkedin',
        name: 'LinkedIn Article',
        platform: 'LinkedIn',
        content: posts.linkedin,
        score: 88,
        publishType: 'auto',
        scheduleOptions: ['Now', 'Mon 8 AM', 'Tue 8 AM', 'Custom'],
        checked: false,
        scheduleTime: 'Mon 8 AM',
        media: story.media
      },
      {
        id: 'instagram',
        name: 'Instagram Post',
        platform: 'Instagram',
        content: posts.instagram,
        score: 85,
        publishType: 'auto',
        scheduleOptions: ['Now', 'Sun 6 PM', 'Mon 11 AM', 'Custom'],
        checked: false,
        scheduleTime: 'Sun 6 PM',
        media: story.media
      }
    ],
    createdAt: story.createdAt
  };
  
  // Add to batches (newest at the end)
  batch.batches.push(newBatch);
  batch.total = batch.batches.length;
  batch.generated = new Date().toISOString();
  
  fs.writeFileSync(BATCH_JSON, JSON.stringify(batch, null, 2));
  console.log(`✅ Added batch for: ${story.title}`);
}

// Send Telegram notification (via OpenClaw tool integration)
async function sendTelegramNotification(story) {
  console.log(`\n📱 Sending Telegram notification...`);
  
  // For now, just log - will be integrated when Telegram channel is configured
  console.log(`\n📝 New HotKey post ready to review!`);
  console.log(`Title: ${story.title}`);
  console.log(`Score: ${story.score}/100`);
  console.log(`Review: https://hotkey-ai.netlify.app/review`);
  console.log(`\n✅ Notification logged (Telegram integration pending)`);
  
  // TODO: Implement via OpenClaw message tool when Telegram is configured
  // Will use: message({ action: 'send', channel: 'telegram', target: USER, message: ... })
}

// Process new stories
async function processNewStories() {
  console.log('\n🔍 Checking for new stories...');
  
  const processed = loadProcessed();
  const files = fs.readdirSync(CONTENT_INBOX)
    .filter(f => f.startsWith('matt-story-') && f.endsWith('.md'))
    .map(f => path.join(CONTENT_INBOX, f));
  
  const newFiles = files.filter(f => !processed.stories.includes(f));
  
  if (newFiles.length === 0) {
    console.log('No new stories found');
    return;
  }
  
  console.log(`\n📚 Found ${newFiles.length} new stories`);
  
  for (const file of newFiles) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Processing: ${path.basename(file)}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    try {
      // Parse story
      const story = parseStory(file);
      
      // Generate posts
      const posts = await generatePosts(story);
      
      // Update batch.json
      updateBatchJson(story, posts);
      
      // Send notification
      sendTelegramNotification(story);
      
      // Mark as processed
      processed.stories.push(file);
      saveProcessed(processed);
      
      console.log(`\n✅ Successfully processed: ${story.title}\n`);
      
    } catch (err) {
      console.error(`\n❌ Error processing ${file}:`, err.message);
    }
  }
  
  console.log(`\n🎉 All stories processed!`);
}

// Main
processNewStories().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
