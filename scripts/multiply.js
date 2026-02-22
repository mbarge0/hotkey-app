#!/usr/bin/env node

/**
 * Content Multiplication Engine
 * 
 * Takes ONE story and generates content for EVERY format
 * 
 * Usage:
 *   ./multiply.js --story app-store-defense --formats all
 *   ./multiply.js --story app-store-defense --formats blog,twitter,linkedin
 *   ./multiply.js --story-file inbox/story.json --formats all
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const FACTORY_DIR = __dirname;
const PROFILES_DIR = path.join(FACTORY_DIR, 'profiles');
const PILLARS_DIR = path.join(FACTORY_DIR, 'pillars');
const FORMATS_DIR = path.join(FACTORY_DIR, 'formats');
const DRAFTS_DIR = path.join(FACTORY_DIR, 'drafts');
const STORIES_DIR = path.join(FACTORY_DIR, 'stories');

// Available format templates (29 total)
const FORMATS = {
  // Original 10
  blog: require('./formats/blog-template.js'),
  'twitter-thread': require('./formats/twitter-thread-template.js'),
  'linkedin-article': require('./formats/linkedin-article-template.js'),
  'instagram-carousel': require('./formats/instagram-carousel-template.js'),
  'tiktok-slideshow': require('./formats/tiktok-slideshow-template.js'),
  'youtube-script': require('./formats/youtube-script-template.js'),
  newsletter: require('./formats/newsletter-template.js'),
  reddit: require('./formats/reddit-template.js'),
  medium: require('./formats/medium-template.js'),
  podcast: require('./formats/podcast-script-template.js'),
  
  // New 19
  'twitter-single': require('./formats/twitter-single-template.js'),
  'youtube-short': require('./formats/youtube-short-template.js'),
  'linkedin-carousel': require('./formats/linkedin-carousel-template.js'),
  'instagram-story': require('./formats/instagram-story-template.js'),
  'instagram-reel': require('./formats/instagram-reel-template.js'),
  'facebook-post': require('./formats/facebook-post-template.js'),
  'github-readme': require('./formats/github-readme-template.js'),
  devto: require('./formats/devto-template.js'),
  hashnode: require('./formats/hashnode-template.js'),
  producthunt: require('./formats/producthunt-template.js'),
  hackernews: require('./formats/hackernews-template.js'),
  indiehackers: require('./formats/indiehackers-template.js'),
  substack: require('./formats/substack-template.js'),
  'landing-page': require('./formats/landing-page-template.js'),
  'cold-email': require('./formats/cold-email-template.js'),
  'press-release': require('./formats/press-release-template.js'),
  'case-study': require('./formats/case-study-template.js'),
  'conference-talk': require('./formats/conference-talk-template.js'),
  workshop: require('./formats/workshop-template.js'),
  'quote-cards': require('./formats/quote-cards-template.js'),
};

// ============================================================================
// STORY LOADING
// ============================================================================

function loadStory(storyName) {
  // Try loading from stories directory first
  const storyPath = path.join(STORIES_DIR, `${storyName}.json`);
  
  if (fs.existsSync(storyPath)) {
    return JSON.parse(fs.readFileSync(storyPath, 'utf8'));
  }
  
  throw new Error(`Story not found: ${storyName}`);
}

function loadStoryFromFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Story file not found: ${filePath}`);
  }
  
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// ============================================================================
// PROFILE & PILLAR LOADING
// ============================================================================

function loadProfile(profileName = 'matt-barge') {
  const profilePath = path.join(PROFILES_DIR, `${profileName}.json`);
  
  if (!fs.existsSync(profilePath)) {
    throw new Error(`Profile not found: ${profileName}`);
  }
  
  return JSON.parse(fs.readFileSync(profilePath, 'utf8'));
}

function loadPillar(pillarName) {
  const pillarPath = path.join(PILLARS_DIR, `${pillarName}.json`);
  
  if (!fs.existsSync(pillarPath)) {
    throw new Error(`Pillar not found: ${pillarName}`);
  }
  
  return JSON.parse(fs.readFileSync(pillarPath, 'utf8'));
}

// ============================================================================
// CONTENT GENERATION
// ============================================================================

async function generateFormat(formatName, story, profile, pillar) {
  const template = FORMATS[formatName];
  
  if (!template) {
    throw new Error(`Unknown format: ${formatName}`);
  }
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Generating: ${template.name} (${template.platform})`);
  console.log('='.repeat(80));
  
  try {
    const result = await template.generate(story, profile, pillar);
    
    console.log(`✅ Generated ${template.name}`);
    if (result.wordCount) console.log(`   Word count: ${result.wordCount}`);
    if (result.tweetCount) console.log(`   Tweets: ${result.tweetCount}`);
    
    return result;
    
  } catch (error) {
    console.error(`❌ Error generating ${template.name}:`, error.message);
    return null;
  }
}

async function multiplyContent(story, profile, pillar, formatList) {
  const results = {};
  
  console.log(`\n🏭 Content Multiplication Engine`);
  console.log(`\nStory: ${story.title}`);
  console.log(`Profile: ${profile.identity.name}`);
  console.log(`Pillar: ${pillar.meta.pillar_name}`);
  console.log(`Formats: ${formatList.join(', ')}\n`);
  
  for (const formatName of formatList) {
    const result = await generateFormat(formatName, story, profile, pillar);
    
    if (result) {
      results[formatName] = result;
    }
  }
  
  return results;
}

// ============================================================================
// OUTPUT SAVING
// ============================================================================

function saveDrafts(story, results, promptsOnly = false) {
  // Create story-specific drafts directory
  const storySlug = story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const timestamp = new Date().toISOString().split('T')[0];
  const draftDir = path.join(DRAFTS_DIR, `${timestamp}-${storySlug}`);
  
  if (!fs.existsSync(draftDir)) {
    fs.mkdirSync(draftDir, { recursive: true });
  }
  
  console.log(`\n📁 Saving ${promptsOnly ? 'prompts' : 'drafts'} to: ${draftDir}\n`);
  
  let savedCount = 0;
  
  for (const [formatName, result] of Object.entries(results)) {
    if (promptsOnly && result.prompt) {
      // Save prompt for manual generation
      const promptFile = path.join(draftDir, `${formatName}-prompt.txt`);
      fs.writeFileSync(promptFile, result.prompt, 'utf8');
      console.log(`✅ Saved prompt: ${formatName}-prompt.txt`);
      savedCount++;
    } else if (!promptsOnly && result.content) {
      // Save generated content
      const filename = result.filename || `${formatName}.txt`;
      const filepath = path.join(draftDir, filename);
      fs.writeFileSync(filepath, result.content, 'utf8');
      console.log(`✅ Saved: ${filename}`);
      savedCount++;
    }
  }
  
  // Save manifest
  const manifest = {
    story: story.title,
    timestamp: new Date().toISOString(),
    formats: Object.keys(results),
    count: savedCount,
    promptsOnly
  };
  
  fs.writeFileSync(
    path.join(draftDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );
  
  console.log(`\n✅ Saved ${savedCount} ${promptsOnly ? 'prompts' : 'formats'} to ${draftDir}`);
  
  return draftDir;
}

// ============================================================================
// CLI
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  let storyName = null;
  let storyFile = null;
  let formatArg = 'all';
  let profileName = 'matt-barge';
  let promptsOnly = false;
  let autoSelect = false;
  let minScore = 60;
  let maxFormats = null;
  let goals = null;
  let onlyImmediate = false;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--story') {
      storyName = args[++i];
    } else if (args[i] === '--story-file') {
      storyFile = args[++i];
    } else if (args[i] === '--formats') {
      formatArg = args[++i];
    } else if (args[i] === '--profile') {
      profileName = args[++i];
    } else if (args[i] === '--prompts-only') {
      promptsOnly = true;
    } else if (args[i] === '--auto-select') {
      autoSelect = true;
    } else if (args[i] === '--min-score') {
      minScore = parseInt(args[++i]);
    } else if (args[i] === '--max-formats') {
      maxFormats = parseInt(args[++i]);
    } else if (args[i] === '--goals') {
      goals = args[++i].split(',').map(g => g.trim());
    } else if (args[i] === '--only-immediate') {
      onlyImmediate = true;
    }
  }
  
  if (!storyName && !storyFile) {
    console.log(`
Content Multiplication Engine

Usage:
  ./multiply.js --story <name> --formats all
  ./multiply.js --story <name> --auto-select --max-formats 5
  ./multiply.js --story <name> --formats blog,twitter,linkedin
  ./multiply.js --story-file <path> --formats all
  
Options:
  --story <name>        Story name (from stories/ directory)
  --story-file <path>   Path to story JSON file
  --formats <list>      Comma-separated list or "all"
  --profile <name>      Profile name (default: matt-barge)
  --prompts-only        Generate prompts only (no API calls)
  
Smart Selection (uses rubric):
  --auto-select         Use rubric to select best formats
  --min-score <n>       Minimum score to include (default: 60)
  --max-formats <n>     Max formats to generate
  --goals <list>        Comma-separated: traffic, leads, authority, engagement
  --only-immediate      Only formats that can publish immediately
  
Available formats (${Object.keys(FORMATS).length}):
  ${Object.keys(FORMATS).join(', ')}

Examples:
  # Smart selection (top 5 formats by rubric)
  ./multiply.js --story app-store-defense --auto-select --max-formats 5
  
  # All immediate formats optimized for traffic
  ./multiply.js --story app-store-defense --auto-select --only-immediate --goals traffic
  
  # Specific formats, prompts only
  ./multiply.js --story app-store-defense --formats blog,twitter --prompts-only
    `);
    process.exit(0);
  }
  
  try {
    // Load story
    const story = storyFile 
      ? loadStoryFromFile(storyFile)
      : loadStory(storyName);
    
    // Load profile
    const profile = loadProfile(profileName);
    
    // Load pillar
    const pillar = loadPillar(story.pillar);
    
    // Determine formats
    let formatList;
    
    if (autoSelect) {
      // Use smart selection
      const { selectFormats } = require('./format-selector.js');
      const selected = selectFormats(story, {
        minScore,
        maxFormats,
        goals,
        onlyImmediate
      });
      
      formatList = selected.map(s => s.id).filter(id => FORMATS[id]);
      
      console.log(`\n🤖 Auto-selected ${formatList.length} formats based on story analysis:\n`);
      selected.slice(0, 10).forEach((s, idx) => {
        if (FORMATS[s.id]) {
          console.log(`  ${idx + 1}. ${s.format.name} (score: ${s.score})`);
        }
      });
      console.log('');
      
    } else if (formatArg === 'all') {
      formatList = Object.keys(FORMATS);
    } else {
      formatList = formatArg.split(',').map(f => f.trim());
    }
    
    // Validate formats
    for (const f of formatList) {
      if (!FORMATS[f]) {
        throw new Error(`Unknown format: ${f}`);
      }
    }
    
    // Generate content
    const results = await multiplyContent(story, profile, pillar, formatList);
    
    // Save drafts or prompts
    const draftDir = saveDrafts(story, results, promptsOnly);
    
    console.log(`\n🎉 Multiplication complete!`);
    console.log(`\nDrafts saved to: ${draftDir}`);
    console.log(`\nNext steps:`);
    console.log(`1. Review the drafts`);
    console.log(`2. Edit as needed`);
    console.log(`3. Publish to platforms`);
    
  } catch (error) {
    console.error(`\n❌ Error:`, error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  multiplyContent,
  loadStory,
  loadProfile,
  loadPillar
};
