// Profile configuration for platform previews
export const profileConfig = {
  name: "Matt Barge",
  
  // User DNA - what you're known for
  dna: {
    focus: ["AI", "real estate", "systems"],
    vibe: "building systems and automation",
  },
  
  twitter: {
    handle: "@matthewbarge",
    avatar: "/review/avatars/twitter.jpg",
    verified: true,
  },
  
  linkedin: {
    name: "Matt Barge",
    title: "Founder & Developer",
    avatar: "/review/avatars/linkedin.jpg",
  },
  
  instagram: {
    handle: "themattbarge",
    avatar: "/review/avatars/instagram.jpg",
  },
}

// Helper to get profile image URLs
// You can update these with actual URLs from each platform
export function getProfileUrls() {
  return {
    twitter: profileConfig.twitter.avatar,
    linkedin: profileConfig.linkedin.avatar,
    instagram: profileConfig.instagram.avatar,
  }
}
