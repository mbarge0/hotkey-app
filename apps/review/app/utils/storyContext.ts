/**
 * Generate conversational context for the sidebar
 * Less templated, more like talking to your best friend
 */

interface Story {
  title: string
  description: string
  pillar: string
  score: number
  timestamp?: string
}

export function generateStoryContext(story: Story, profileFocus: string[]): {
  intro: string
  insight: string
  platformNotes: string[]
} {
  const score = story.score
  const pillar = story.pillar
  
  // Intro variations based on score
  let intro = ''
  if (score >= 80) {
    intro = `This one's strong. ${story.title} scored ${score}/100 - that's the kind of content that actually moves the needle.`
  } else if (score >= 70) {
    intro = `Solid story here. ${story.title} came in at ${score}/100. Not earth-shattering, but real and useful.`
  } else {
    intro = `${story.title} scored ${score}/100. Not the highest score, but sometimes the most honest stories aren't the flashiest.`
  }
  
  // Insight variations based on pillar and content
  let insight = ''
  const titleLower = story.title.toLowerCase()
  const descLower = story.description.toLowerCase()
  
  if (descLower.includes('system') || descLower.includes('pipeline') || descLower.includes('architecture')) {
    insight = `This is systems thinking - the kind of behind-the-scenes work that separates pros from amateurs. Your ${pillar} audience eats this up because it's not just "what" but "how."`
  } else if (descLower.includes('rejected') || descLower.includes('failed') || descLower.includes('broke')) {
    insight = `Real talk about failures and fixes. This resonates because most people only share wins. Showing the messy middle builds trust.`
  } else if (descLower.includes('built') || descLower.includes('shipped') || descLower.includes('launched')) {
    insight = `You shipped something. That puts you in the top 1% already. Most people talk about building. You actually did it.`
  } else if (descLower.includes('learned') || descLower.includes('discovered') || descLower.includes('realized')) {
    insight = `Learning in public. The best content isn't polished thought leadership - it's real-time figuring stuff out. This shows the process.`
  } else {
    insight = `This hits your ${pillar} focus. The specifics make it credible - not generic advice, actual experience.`
  }
  
  // Platform-specific notes (less formulaic)
  const platformNotes = [
    `Twitter gets the punchy version. Scroll-stoppers for builders who want the insight fast.`,
    `LinkedIn gets the full story with methodology. People there actually read - use it.`,
    `Instagram keeps it visual and accessible. Different audience, same core story.`
  ]
  
  return { intro, insight, platformNotes }
}
