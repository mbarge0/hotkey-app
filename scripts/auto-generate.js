#!/usr/bin/env node

/**
 * Content Factory - Automated Generation (Level 4+)
 * 
 * Fully automated: Profile + Pillar + Platform + Source → Draft (saved)
 * 
 * Uses OpenClaw sessions_send to call Claude programmatically
 * 
 * Usage:
 *   ./auto-generate.js --source inbox/video.mov --pillar ai
 *   ./auto-generate.js --prompt "Kelly fixed bug" --pillar ai --approve
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================================
// CONFIG
// ============================================================================

const FACTORY_DIR = __dirname;
const PROFILE_PATH = path.join(FACTORY_DIR, 'profiles/matt-barge.json');
const STRUCTURES_DIR = path.join(FACTORY_DIR, 'structures');
const DRAFTS_DIR = path.join(FACTORY_DIR, 'drafts');
const INBOX_DIR = path.join(FACTORY_DIR, 'content-inbox');

// Import from generate.js
const { loadProfile, loadPillar, loadPlatformStructures } = require('./generate.js');

// ============================================================================
// CLAUDE INTEGRATION
// ============================================================================

function buildGenerationPrompt(args) {
  const { source, pillar, platforms, profile, customPrompt, sourceContent } = args;
  
  const pillarInfo = pillar.meta ? pillar : { pillar_name: 'unknown', ...pillar };
  
  return `You are a content strategist for ${profile.identity.name}. Generate platform-specific posts.

**Profile:**
- Voice: ${profile.voice.tone.join(', ')}
- Signature style: ${profile.voice.signature_phrases.join(' • ')}
- Avoid: ${profile.voice.avoid.slice(0, 3).join(', ')}

**Pillar: ${pillarInfo.pillar_name || pillarInfo.focus}**
- Focus: ${pillar.focus}
- Key messages: ${(pillar.key_messages || []).slice(0, 3).join(', ')}

**Source:**
${customPrompt || sourceContent || 'User-provided context'}

**Task:**
Generate posts for: ${platforms.join(', ')}

**Requirements:**
1. Match Matt's voice: casual, technical, contrarian, specific
2. Use pillar messaging
3. Include real details and proof points
4. Show behind-the-scenes reality
5. Twitter: 1-2 options (single tweet <280 chars OR thread)
6. LinkedIn: Detailed post with methodology (1000-1500 chars)
7. Instagram: Reel caption + visual description

**Format output as:**

## Twitter
[option 1]

[optional: option 2 or thread]

## LinkedIn
[post]

## Instagram
[caption + visual notes]

Make it feel like Matt wrote it - specific, real, technical.`;
}

async function callClaude(prompt) {
  console.log('\n🤖 Calling Claude via OpenClaw...\n');
  
  // Use openclaw CLI to send message to isolated session
  // This assumes we have openclaw installed and configured
  try {
    const result = execSync(
      `echo "${prompt.replace(/"/g, '\\"')}" | openclaw send --session main --wait`,
      { 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024 // 10MB
      }
    );
    
    return result;
  } catch (err) {
    console.error('Error calling Claude:', err.message);
    throw err;
  }
}

// ============================================================================
// DRAFT MANAGEMENT
// ============================================================================

function saveDraft(content, slug) {
  if (!fs.existsSync(DRAFTS_DIR)) {
    fs.mkdirSync(DRAFTS_DIR, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${timestamp}-${slug}.md`;
  const filepath = path.join(DRAFTS_DIR, filename);
  
  const header = `# Content Draft - ${slug}
**Generated:** ${new Date().toISOString()}
**Status:** pending_review

---

`;
  
  fs.writeFileSync(filepath, header + content, 'utf8');
  return filepath;
}

function loadSourceContent(sourcePath) {
  if (!sourcePath || !fs.existsSync(sourcePath)) {
    return null;
  }
  
  const ext = path.extname(sourcePath).toLowerCase();
  
  // For text files, read directly
  if (['.md', '.txt'].includes(ext)) {
    return fs.readFileSync(sourcePath, 'utf8').slice(0, 3000);
  }
  
  // For media files, check for companion notes
  const notesPath = path.join(path.dirname(sourcePath), 'QUICK-NOTES.md');
  if (fs.existsSync(notesPath)) {
    const notes = fs.readFileSync(notesPath, 'utf8');
    const basename = path.basename(sourcePath);
    
    // Extract relevant section from notes
    const lines = notes.split('\n');
    const relevantSection = [];
    let capturing = false;
    
    for (const line of lines) {
      if (line.includes(basename)) {
        capturing = true;
      }
      if (capturing) {
        relevantSection.push(line);
        if (line.trim() === '' && relevantSection.length > 5) {
          break;
        }
      }
    }
    
    return relevantSection.join('\n');
  }
  
  // For media without notes, just return filename
  return `Media file: ${path.basename(sourcePath)}`;
}

// ============================================================================
// GENERATION ENGINE
// ============================================================================

async function autoGenerate(args) {
  const { pillarName, platforms, source, prompt: customPrompt, approve } = args;
  
  console.log('\n🏭 Content Factory - Auto-Generation Engine\n');
  
  // Load components
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
  
  // Load source content
  let sourceContent = null;
  if (source) {
    console.log(`📄 Loading source: ${source}`);
    sourceContent = loadSourceContent(source);
  }
  
  // Build prompt
  const generationPrompt = buildGenerationPrompt({
    source,
    pillar,
    platforms,
    profile,
    customPrompt,
    sourceContent
  });
  
  // Call Claude
  const response = await callClaude(generationPrompt);
  
  // Save draft
  const slug = customPrompt 
    ? customPrompt.slice(0, 30).toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : source 
      ? path.basename(source, path.extname(source))
      : 'generated-content';
  
  const draftPath = saveDraft(response, slug);
  console.log(`\n✅ Draft saved: ${draftPath}`);
  
  // If --approve flag, send to Telegram
  if (approve) {
    console.log('\n📱 Sending approval request to Telegram...');
    try {
      execSync(
        `openclaw message --channel telegram --action send --message "New content draft ready for review:\n\n${draftPath}\n\nReply 'approve' to publish."`,
        { encoding: 'utf8' }
      );
      console.log('✅ Approval request sent');
    } catch (err) {
      console.error('Error sending approval request:', err.message);
    }
  }
  
  return {
    draftPath,
    content: response
  };
}

// ============================================================================
// CLI
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    pillarName: 'ai',
    platforms: ['twitter', 'linkedin', 'instagram'],
    source: null,
    prompt: null,
    approve: false
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
    } else if (arg === '--approve') {
      parsed.approve = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Content Factory - Auto-Generation Engine

Fully automated content generation with Claude integration.

Usage:
  ./auto-generate.js --source <path> --pillar ai
  ./auto-generate.js --prompt "Kelly fixed bug" --pillar ai --approve

Options:
  --source <path>       Path to source content
  --prompt <text>       Custom prompt describing content
  --pillar <name>       Content pillar (ai, real-estate, business-systems)
  --platforms <list>    Comma-separated platforms (default: all)
  --approve             Send Telegram approval request after generation
  --help, -h            Show this help

Examples:
  # Generate from video
  ./auto-generate.js --source inbox/learning.mov --pillar ai
  
  # Generate and request approval
  ./auto-generate.js --prompt "Shipped 3 apps in 48h" --pillar ai --approve
  
  # Twitter-only
  ./auto-generate.js --prompt "Quick insight" --pillar ai --platforms twitter
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
  try {
    const args = parseArgs();
    const result = await autoGenerate(args);
    
    console.log('\n' + '='.repeat(80));
    console.log('Generation complete!');
    console.log('='.repeat(80));
    console.log(`Draft: ${result.draftPath}`);
    console.log('\nNext steps:');
    console.log('1. Review draft');
    console.log('2. Approve via Telegram');
    console.log('3. Posts auto-publish via Publer');
    
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { autoGenerate };
