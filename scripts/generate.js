#!/usr/bin/env node

/**
 * Content Factory - Level 4: Generation Engine
 * 
 * Automates: Profile + Pillar + Platform + Source → Draft
 * 
 * Usage:
 *   ./generate.js --source <path> --pillar ai --platforms twitter,linkedin,instagram
 *   ./generate.js --prompt "Kelly fixed a bug in the learning playbook" --pillar ai
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIG
// ============================================================================

const FACTORY_DIR = __dirname;
const PROFILE_PATH = path.join(FACTORY_DIR, 'profiles/matt-barge.json');
const STRUCTURES_DIR = path.join(FACTORY_DIR, 'structures');
const DRAFTS_DIR = path.join(FACTORY_DIR, 'drafts');
const INBOX_DIR = path.join(FACTORY_DIR, 'content-inbox');

// ============================================================================
// HELPERS
// ============================================================================

function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Error loading ${filePath}:`, err.message);
    process.exit(1);
  }
}

function loadProfile() {
  return loadJSON(PROFILE_PATH);
}

function loadPillar(pillarName) {
  const pillarPath = path.join(FACTORY_DIR, `pillars/${pillarName}.json`);
  return loadJSON(pillarPath);
}

function loadPlatformStructures(platformName) {
  const platformDir = path.join(STRUCTURES_DIR, platformName);
  return {
    hooks: loadJSON(path.join(platformDir, 'hooks.json')),
    formats: loadJSON(path.join(platformDir, 'formats.json')),
    criteria: loadJSON(path.join(platformDir, 'criteria.json')),
    examples: loadJSON(path.join(platformDir, 'examples.json'))
  };
}

function generatePrompt(args) {
  const { source, pillar, platforms, profile, customPrompt } = args;
  
  let prompt = `# Content Generation Request

## Profile
- Name: ${profile.identity.name}
- Title: ${profile.identity.professional_title}
- Voice: ${profile.voice.tone.join(', ')}
- Avoid: ${profile.voice.avoid.join(', ')}
- Signature phrases: ${profile.voice.signature_phrases.join(', ')}

## Pillar: ${pillar.pillar_name || pillar.meta?.pillar || 'unknown'}
- Focus: ${pillar.focus}
- Key Messages: ${pillar.key_messages?.join(', ') || 'N/A'}
- Target Audience: ${pillar.target_audience?.join(', ') || 'N/A'}

## Platforms
Generate content for: ${platforms.join(', ')}

## Source Content
${customPrompt || `File: ${source}\n\n${fs.existsSync(source) ? fs.readFileSync(source, 'utf8').slice(0, 2000) : '(file not found - use description from user)'}`}

## Task
Create platform-specific posts that:
1. Match Matt's voice (casual, technical, contrarian)
2. Use pillar messaging and key themes
3. Follow platform-specific hooks and formats
4. Include specific details and proof points
5. Show vulnerability and behind-the-scenes reality

For each platform, select appropriate hook template and format structure.

Output format:
- Twitter: 1-2 options (single tweet OR thread)
- LinkedIn: Detailed post with methodology breakdown
- Instagram: Reel caption + visual description

Make it feel like Matt wrote it - specific, technical, real.`;

  return prompt;
}

function saveDraft(content, filename) {
  if (!fs.existsSync(DRAFTS_DIR)) {
    fs.mkdirSync(DRAFTS_DIR, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  const filepath = path.join(DRAFTS_DIR, `${timestamp}-${filename}.md`);
  
  fs.writeFileSync(filepath, content, 'utf8');
  return filepath;
}

// ============================================================================
// GENERATION ENGINE
// ============================================================================

async function generateContent(args) {
  const { pillarName, platforms, source, prompt: customPrompt } = args;
  
  console.log('\n🏭 Content Factory - Generation Engine\n');
  console.log(`📊 Loading profile...`);
  const profile = loadProfile();
  
  console.log(`🎯 Loading pillar: ${pillarName}`);
  const pillar = loadPillar(pillarName);
  
  console.log(`📚 Loading platform structures...`);
  const structures = {};
  for (const platform of platforms) {
    structures[platform] = loadPlatformStructures(platform);
    console.log(`   ✓ ${platform}`);
  }
  
  console.log(`\n🤖 Generating prompt for Claude...`);
  const generationPrompt = generatePrompt({
    source,
    pillar,
    platforms,
    profile,
    customPrompt
  });
  
  // In production, this would call Claude via OpenClaw API
  // For now, output the prompt so it can be run manually
  
  console.log('\n' + '='.repeat(80));
  console.log('GENERATION PROMPT');
  console.log('='.repeat(80));
  console.log(generationPrompt);
  console.log('='.repeat(80));
  
  console.log('\n📝 Next steps:');
  console.log('1. Copy prompt above');
  console.log('2. Send to Claude (via webchat or API)');
  console.log('3. Save output to drafts/');
  console.log('4. Review and approve for publishing');
  
  return generationPrompt;
}

// ============================================================================
// CLI
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    pillarName: 'ai', // default
    platforms: ['twitter', 'linkedin', 'instagram'], // default
    source: null,
    prompt: null
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];
    
    if (arg === '--pillar' && next) {
      parsed.pillarName = next;
      i++;
    } else if (arg === '--platforms' && next) {
      parsed.platforms = next.split(',').map(p => p.trim());
      i++;
    } else if (arg === '--source' && next) {
      parsed.source = next;
      i++;
    } else if (arg === '--prompt' && next) {
      parsed.prompt = next;
      i++;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Content Factory - Generation Engine

Usage:
  ./generate.js --source <path> --pillar ai --platforms twitter,linkedin
  ./generate.js --prompt "Kelly fixed a bug" --pillar ai

Options:
  --source <path>       Path to source content (video, article, notes)
  --prompt <text>       Custom prompt describing the content
  --pillar <name>       Content pillar (ai, real-estate, business-systems)
  --platforms <list>    Comma-separated platforms (twitter,linkedin,instagram)
  --help, -h            Show this help

Examples:
  ./generate.js --source inbox/learning-playbook.mov --pillar ai
  ./generate.js --prompt "Shipped 3 apps in 48h" --pillar ai --platforms twitter
      `);
      process.exit(0);
    }
  }
  
  if (!parsed.source && !parsed.prompt) {
    console.error('Error: Must provide --source or --prompt');
    console.error('Run with --help for usage');
    process.exit(1);
  }
  
  return parsed;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = parseArgs();
  await generateContent(args);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { generateContent, loadProfile, loadPillar, loadPlatformStructures };
