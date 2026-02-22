#!/usr/bin/env node

/**
 * Content Factory Orchestrator
 * 
 * Master script that runs the full pipeline:
 * Story → JSON → Multiply → Generate → Approve → Publish
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SCRIPTS_DIR = path.join(__dirname, 'scripts');

async function runFullPipeline(storyMarkdownPath, options = {}) {
  const {
    maxFormats = 10,
    goals = null,
    onlyImmediate = false,
    autoPublish = false
  } = options;
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🏭 CONTENT FACTORY - FULL PIPELINE`);
  console.log('='.repeat(80));
  
  // Step 1: Convert Kelly story to JSON
  console.log(`\n📝 Step 1: Converting story to JSON`);
  
  const converterPath = path.join(SCRIPTS_DIR, 'kelly-story-converter.js');
  const storiesDir = path.join(__dirname, 'stories');
  
  const result1 = execSync(
    `node "${converterPath}" "${storyMarkdownPath}" "${storiesDir}"`,
    { encoding: 'utf8' }
  );
  
  console.log(result1);
  
  // Extract story name from output
  const storyMatch = result1.match(/Converted to: (.+\.json)/);
  if (!storyMatch) {
    throw new Error('Failed to convert story');
  }
  
  const storyJsonPath = storyMatch[1];
  const storyName = path.basename(storyJsonPath, '.json');
  const story = JSON.parse(fs.readFileSync(storyJsonPath, 'utf8'));
  
  // Step 2: Multiply to selected formats
  console.log(`\n📊 Step 2: Multiplying to formats`);
  
  const multiplyArgs = [
    `--story ${storyName}`,
    '--auto-select',
    `--max-formats ${maxFormats}`,
    '--prompts-only'
  ];
  
  if (goals) multiplyArgs.push(`--goals ${goals}`);
  if (onlyImmediate) multiplyArgs.push('--only-immediate');
  
  const result2 = execSync(
    `cd ${__dirname} && ./multiply.js ${multiplyArgs.join(' ')}`,
    { encoding: 'utf8' }
  );
  
  console.log(result2);
  
  // Find draft directory
  const draftMatch = result2.match(/Drafts saved to: (.+)/);
  if (!draftMatch) {
    throw new Error('Failed to generate prompts');
  }
  
  const draftDir = draftMatch[1].trim();
  
  // Step 3: Generate content from prompts
  console.log(`\n🤖 Step 3: Generating content`);
  console.log(`NOTE: This step requires Jarvis to read prompts and generate content`);
  console.log(`For now, prompts are saved. Jarvis will process them.\n`);
  
  const generatePath = path.join(SCRIPTS_DIR, 'generate-all-content.js');
  
  try {
    const result3 = execSync(
      `node "${generatePath}" generate "${draftDir}"`,
      { encoding: 'utf8' }
    );
    console.log(result3);
  } catch (error) {
    console.log('⚠️  Generation queued (Jarvis will process)');
  }
  
  // Step 4: Send for approval
  console.log(`\n📱 Step 4: Sending approval request`);
  
  const approvalPath = path.join(SCRIPTS_DIR, 'telegram-approval.js');
  
  const result4 = execSync(
    `node "${approvalPath}" send "${draftDir}" "${story.title}"`,
    { encoding: 'utf8' }
  );
  
  console.log(result4);
  
  // Summary
  console.log(`\n${'='.repeat(80)}`);
  console.log(`✅ PIPELINE COMPLETE`);
  console.log('='.repeat(80));
  console.log(`\nStory: ${story.title}`);
  console.log(`Pillar: ${story.pillar}`);
  console.log(`Draft directory: ${draftDir}`);
  console.log(`\nNext steps:`);
  console.log(`1. Check Telegram for approval request`);
  console.log(`2. Reply with "post 1 2 5" to select formats`);
  console.log(`3. Run batch-publisher.js to publish`);
  console.log(`\nOr wait - if Jarvis is monitoring, he'll handle it automatically.`);
  console.log('='.repeat(80));
  
  return {
    story,
    draftDir,
    storyJsonPath
  };
}

async function handleApprovalReply(draftDir, reply) {
  console.log(`\n📱 Processing approval reply...`);
  
  const approvalPath = path.join(SCRIPTS_DIR, 'telegram-approval.js');
  
  const result = execSync(
    `node "${approvalPath}" reply "${draftDir}" "${reply}"`,
    { encoding: 'utf8' }
  );
  
  console.log(result);
  
  // Run publisher
  console.log(`\n🚀 Publishing selected formats...`);
  
  const publisherPath = path.join(SCRIPTS_DIR, 'batch-publisher.js');
  
  const result2 = execSync(
    `node "${publisherPath}" "${draftDir}"`,
    { encoding: 'utf8' }
  );
  
  console.log(result2);
  
  return true;
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === '--help') {
    console.log(`
Content Factory Orchestrator

Usage:
  ./orchestrate.js run <story-markdown> [options]
  ./orchestrate.js approve <draft-dir> "<reply>"

Options:
  --max-formats <n>     Maximum formats to generate (default: 10)
  --goals <list>        Comma-separated goals (traffic,leads,authority,engagement)
  --only-immediate      Only formats that can publish immediately
  --auto-publish        Skip approval, publish immediately

Examples:
  # Full pipeline
  ./orchestrate.js run ~/content-inbox/kelly-story-2026-02-20-2352.md --max-formats 5
  
  # Process approval
  ./orchestrate.js approve ./drafts/2026-02-21-app-store-defense/ "post 1 2 5"
    `);
    process.exit(0);
  }
  
  if (command === 'run') {
    const storyPath = args[1];
    
    if (!storyPath) {
      console.error('Error: Story markdown path required');
      process.exit(1);
    }
    
    const options = {};
    for (let i = 2; i < args.length; i++) {
      if (args[i] === '--max-formats') {
        options.maxFormats = parseInt(args[++i]);
      } else if (args[i] === '--goals') {
        options.goals = args[++i];
      } else if (args[i] === '--only-immediate') {
        options.onlyImmediate = true;
      } else if (args[i] === '--auto-publish') {
        options.autoPublish = true;
      }
    }
    
    runFullPipeline(storyPath, options).catch(err => {
      console.error('\n❌ Pipeline failed:', err.message);
      process.exit(1);
    });
    
  } else if (command === 'approve') {
    const draftDir = args[1];
    const reply = args[2];
    
    if (!draftDir || !reply) {
      console.error('Error: Draft directory and reply required');
      process.exit(1);
    }
    
    handleApprovalReply(draftDir, reply).catch(err => {
      console.error('\n❌ Approval failed:', err.message);
      process.exit(1);
    });
    
  } else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }
}

module.exports = {
  runFullPipeline,
  handleApprovalReply
};
