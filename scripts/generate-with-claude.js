#!/usr/bin/env node

/**
 * Generate posts using Claude via OpenClaw sessions_send
 */

const Anthropic = require('@anthropic-ai/sdk');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function generatePosts(story) {
  const client = new Anthropic({
    apiKey: ANTHROPIC_API_KEY || 'sk-ant-placeholder'
  });

  const prompt = `You are a content strategist for Matt Barge. Generate platform-specific posts using hook optimization techniques.

**Story:**
Title: ${story.title}
Description: ${story.description}

Why it matters: ${story.whyItMatters}

Pillar: ${story.pillar}
Score: ${story.score}/100

**Hook Optimization Principles:**
- Lead with the problem or insight, not the solution
- Use specifics and numbers
- Show contrarian/unexpected angles
- Make first line stop the scroll

**Task:** Generate 3 optimized posts:

**TWITTER** (Thread format, 5-7 tweets):
Tweet 1: Hook - problem or insight that stops scroll
Tweet 2-5: Specific details, numbers, before/after
Tweet 6: Insight or pattern
Tweet 7: Soft CTA or question

Make it punchy. Use line breaks for emphasis.

**LINKEDIN** (1200-1500 chars):
First 2 lines: Hook (shows in preview)
Then: Methodology, specifics, what you learned
Structure: Problem → What you built → Why it matters → Ask question
Use short paragraphs. Be conversational but professional.

**INSTAGRAM** (Caption 300-400 chars + hashtags):
Hook in first line with emoji
Behind-the-scenes vibe
Keep it accessible
End with 8-10 hashtags: #BuildInPublic #AI #Productivity #SaaS #IndieHacker + relevant ones

**Output ONLY valid JSON in this exact format:**
{
  "twitter": "full thread content here",
  "linkedin": "full post content here",
  "instagram": "full caption with hashtags here"
}

No additional text. Make it feel like Matt wrote it - specific, real, technical.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',  // Latest Claude Sonnet 4
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const text = message.content[0].text;
    
    // Extract JSON
    const jsonMatch = text.match(/\{[\s\S]*"twitter"[\s\S]*"linkedin"[\s\S]*"instagram"[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in response');
    }

    return JSON.parse(jsonMatch[0]);

  } catch (err) {
    console.error('Claude generation error:', err.message);
    
    // Fallback
    return {
      twitter: `${story.title}\n\n${story.description.slice(0, 250)}...\n\nThoughts?`,
      linkedin: `${story.title}\n\n${story.description}\n\n${story.whyItMatters}\n\nWhat's your experience with this?`,
      instagram: `${story.title} 💡\n\n${story.description.slice(0, 250)}...\n\n#BuildInPublic #AI #Tech #Productivity #SaaS #IndieHacker #Innovation #Automation`
    };
  }
}

// CLI usage
if (require.main === module) {
  const storyJson = process.argv[2];
  if (!storyJson) {
    console.error('Usage: generate-with-claude.js \'{"title":"...", "description":"..."}\'');
    process.exit(1);
  }

  const story = JSON.parse(storyJson);
  generatePosts(story).then(posts => {
    console.log(JSON.stringify(posts, null, 2));
  }).catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { generatePosts };
