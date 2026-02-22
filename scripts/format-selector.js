#!/usr/bin/env node

/**
 * Format Selector
 * 
 * Smart rubric that decides which formats to generate for a given story
 * Based on: story type, audience, goals, effort, ROI, media availability
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, 'format-registry.json');

// ============================================================================
// SCORING RUBRIC
// ============================================================================

/**
 * Score a format for a given story
 * Returns 0-100 score
 */
function scoreFormat(format, story, criteria) {
  let score = 0;
  const weights = {
    storyType: 30,    // Does format match story type?
    audience: 25,     // Does format reach target audience?
    goals: 20,        // Does format achieve goals?
    effort: 15,       // Is effort justified by reach/conversion?
    media: 10         // Do we have required media?
  };
  
  // 1. Story Type Match
  const storyTypes = criteria.storyType || [];
  const typeMatches = storyTypes.filter(type => format.bestFor.includes(type));
  score += (typeMatches.length / Math.max(storyTypes.length, 1)) * weights.storyType;
  
  // 2. Audience Match
  const targetAudiences = criteria.audience || [];
  const audienceMatches = targetAudiences.filter(aud => format.audience.includes(aud));
  score += (audienceMatches.length / Math.max(targetAudiences.length, 1)) * weights.audience;
  
  // 3. Goals Alignment
  const goals = criteria.goals || [];
  let goalScore = 0;
  
  if (goals.includes('traffic') && format.reach === 'very-high') goalScore += 10;
  if (goals.includes('traffic') && format.reach === 'high') goalScore += 7;
  if (goals.includes('traffic') && format.seo) goalScore += 5;
  
  if (goals.includes('leads') && format.conversion === 'very-high') goalScore += 10;
  if (goals.includes('leads') && format.conversion === 'high') goalScore += 7;
  
  if (goals.includes('authority') && format.evergreen) goalScore += 5;
  if (goals.includes('authority') && format.effort === 'very-high') goalScore += 5;
  
  if (goals.includes('engagement') && format.reach === 'very-high') goalScore += 5;
  if (goals.includes('engagement') && format.platform === 'Twitter/X') goalScore += 5;
  
  score += Math.min(goalScore, weights.goals);
  
  // 4. Effort vs ROI
  const effortMap = { minimal: 5, low: 4, medium: 3, high: 2, 'very-high': 1 };
  const reachMap = { low: 1, medium: 2, high: 3, 'very-high': 4 };
  const conversionMap = { low: 1, medium: 2, high: 3, 'very-high': 4 };
  
  const effortCost = effortMap[format.effort] || 3;
  const reachBenefit = reachMap[format.reach] || 2;
  const conversionBenefit = conversionMap[format.conversion] || 2;
  
  const roi = (reachBenefit + conversionBenefit) / (6 - effortCost);
  score += roi * weights.effort;
  
  // 5. Media Availability
  const hasVideo = (story.media?.video || []).length > 0;
  const hasImages = (story.media?.screenshots || story.media?.images || []).length > 0;
  
  let mediaScore = weights.media;
  
  if (format.timeToPublish === 'needs-video' && !hasVideo) {
    mediaScore = 0; // Hard blocker
  } else if (format.timeToPublish === 'needs-design' && !hasImages) {
    mediaScore *= 0.5; // Penalty but not blocker
  }
  
  score += mediaScore;
  
  return Math.round(score);
}

// ============================================================================
// FORMAT SELECTION
// ============================================================================

function selectFormats(story, options = {}) {
  const {
    minScore = 60,           // Minimum score to include format
    maxFormats = null,       // Max formats to return (null = unlimited)
    priorityGoal = null,     // If set, boost formats that match this goal
    excludeEffort = [],      // Exclude formats with these effort levels
    onlyImmediate = false    // Only include formats that can publish immediately
  } = options;
  
  // Load format registry
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  
  // Determine criteria from story
  const criteria = {
    storyType: determineStoryTypes(story),
    audience: determineAudience(story),
    goals: determineGoals(story, options)
  };
  
  // Score all formats
  const scored = Object.entries(registry.formats).map(([id, format]) => {
    let score = scoreFormat(format, story, criteria);
    
    // Apply filters
    if (excludeEffort.includes(format.effort)) {
      score = 0;
    }
    
    if (onlyImmediate && format.timeToPublish !== 'immediate') {
      score = 0;
    }
    
    // Priority boost
    if (priorityGoal && format.bestFor.includes(priorityGoal)) {
      score += 10;
    }
    
    return {
      id,
      format,
      score,
      criteria
    };
  });
  
  // Filter and sort
  let selected = scored
    .filter(s => s.score >= minScore)
    .sort((a, b) => b.score - a.score);
  
  // Limit if maxFormats set
  if (maxFormats) {
    selected = selected.slice(0, maxFormats);
  }
  
  return selected;
}

// ============================================================================
// STORY ANALYSIS
// ============================================================================

function determineStoryTypes(story) {
  const types = [];
  
  // Check story metadata
  if (story.storyType) {
    return Array.isArray(story.storyType) ? story.storyType : [story.storyType];
  }
  
  // Infer from content
  const summary = (story.summary || '').toLowerCase();
  const title = (story.title || '').toLowerCase();
  const combined = summary + ' ' + title;
  
  if (combined.includes('built') || combined.includes('system') || combined.includes('script')) {
    types.push('technical', 'tutorial');
  }
  
  if (combined.includes('learn') || combined.includes('failure') || combined.includes('mistake')) {
    types.push('case-study', 'personal-story');
  }
  
  if (combined.includes('why') || combined.includes('pattern') || combined.includes('insight')) {
    types.push('thought-leadership', 'insight');
  }
  
  if (story.metrics && Object.keys(story.metrics).length > 0) {
    types.push('case-study');
  }
  
  if (story.details?.workflow || story.details?.technical) {
    types.push('tutorial', 'deep-dive');
  }
  
  return types.length > 0 ? types : ['quick-win'];
}

function determineAudience(story) {
  const audiences = [];
  
  // From story metadata
  if (story.audience) {
    return Array.isArray(story.audience) ? story.audience : [story.audience];
  }
  
  // From pillar
  if (story.pillar === 'ai') {
    audiences.push('developers', 'technical', 'entrepreneurs');
  } else if (story.pillar === 'real-estate') {
    audiences.push('entrepreneurs', 'investors', 'professionals');
  } else if (story.pillar === 'business-systems') {
    audiences.push('entrepreneurs', 'founders', 'professionals');
  }
  
  // From content
  const summary = (story.summary || '').toLowerCase();
  
  if (summary.includes('code') || summary.includes('script') || summary.includes('api')) {
    audiences.push('developers');
  }
  
  if (summary.includes('business') || summary.includes('revenue') || summary.includes('customer')) {
    audiences.push('entrepreneurs');
  }
  
  return audiences.length > 0 ? audiences : ['general'];
}

function determineGoals(story, options) {
  const goals = [];
  
  // From options
  if (options.goals) {
    return Array.isArray(options.goals) ? options.goals : [options.goals];
  }
  
  // Default goals based on pillar
  if (story.pillar === 'ai') {
    goals.push('authority', 'traffic', 'engagement');
  } else if (story.pillar === 'real-estate') {
    goals.push('leads', 'authority');
  } else if (story.pillar === 'business-systems') {
    goals.push('leads', 'traffic');
  }
  
  return goals;
}

// ============================================================================
// CLI
// ============================================================================

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Format Selector - Smart rubric for content multiplication

Usage:
  ./format-selector.js <story-file> [options]

Options:
  --min-score <n>          Minimum score to include (default: 60)
  --max-formats <n>        Maximum formats to return
  --goals <list>           Comma-separated goals (traffic, leads, authority, engagement)
  --exclude-effort <list>  Exclude effort levels (minimal, low, medium, high, very-high)
  --only-immediate         Only formats that can publish immediately
  --json                   Output as JSON

Examples:
  ./format-selector.js stories/app-store-defense.json
  ./format-selector.js stories/app-store-defense.json --min-score 70 --max-formats 5
  ./format-selector.js stories/app-store-defense.json --goals traffic,leads --only-immediate
    `);
    process.exit(0);
  }
  
  const storyFile = args[0];
  const options = {
    minScore: 60,
    maxFormats: null,
    excludeEffort: [],
    onlyImmediate: false,
    jsonOutput: false
  };
  
  // Parse options
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--min-score') {
      options.minScore = parseInt(args[++i]);
    } else if (args[i] === '--max-formats') {
      options.maxFormats = parseInt(args[++i]);
    } else if (args[i] === '--goals') {
      options.goals = args[++i].split(',').map(g => g.trim());
    } else if (args[i] === '--exclude-effort') {
      options.excludeEffort = args[++i].split(',').map(e => e.trim());
    } else if (args[i] === '--only-immediate') {
      options.onlyImmediate = true;
    } else if (args[i] === '--json') {
      options.jsonOutput = true;
    }
  }
  
  // Load story
  if (!fs.existsSync(storyFile)) {
    console.error(`Error: Story file not found: ${storyFile}`);
    process.exit(1);
  }
  
  const story = JSON.parse(fs.readFileSync(storyFile, 'utf8'));
  
  // Select formats
  const selected = selectFormats(story, options);
  
  // Output
  if (options.jsonOutput) {
    console.log(JSON.stringify(selected, null, 2));
  } else {
    console.log(`\n📊 Format Selection for: ${story.title}\n`);
    console.log(`Criteria:`);
    console.log(`  Story Types: ${selected[0]?.criteria.storyType.join(', ')}`);
    console.log(`  Audience: ${selected[0]?.criteria.audience.join(', ')}`);
    console.log(`  Goals: ${selected[0]?.criteria.goals.join(', ')}\n`);
    
    console.log(`Selected Formats (${selected.length}):\n`);
    
    selected.forEach((s, idx) => {
      console.log(`${idx + 1}. ${s.format.name} (${s.format.platform})`);
      console.log(`   Score: ${s.score}/100`);
      console.log(`   Reach: ${s.format.reach} | Conversion: ${s.format.conversion} | Effort: ${s.format.effort}`);
      console.log(`   Time to publish: ${s.format.timeToPublish}`);
      console.log('');
    });
    
    console.log(`Format IDs: ${selected.map(s => s.id).join(',')}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  selectFormats,
  scoreFormat
};
