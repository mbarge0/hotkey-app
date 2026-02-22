# Get Profile Images for Platform Previews

To make the content previews look authentic, add your real profile images.

---

## Quick Steps

### 1. Twitter (@matthewbarge)

**Method A: From Twitter directly**
1. Go to https://twitter.com/matthewbarge
2. Right-click your profile picture → "Open image in new tab"
3. Copy the URL (should be like `https://pbs.twimg.com/profile_images/...`)

**Method B: Via API**
```bash
curl -s "https://twitter.com/matthewbarge" | grep -o 'https://pbs.twimg.com/profile_images/[^"]*' | head -1
```

### 2. LinkedIn (Matt Barge)

1. Go to https://linkedin.com/in/yourprofile
2. Right-click your profile picture → "Open image in new tab"
3. Copy the URL (should be like `https://media.licdn.com/dms/image/...`)

**Note:** LinkedIn URLs often expire, so you may need to use a hosted version or update periodically.

### 3. Instagram (@themattbarge)

1. Go to https://instagram.com/themattbarge
2. Right-click your profile picture → "Inspect"
3. Find the `<img>` tag and copy the `src` URL
4. Or use: https://www.instagram.com/themattbarge/?__a=1&__d=dis (view source, find profile_pic_url)

**Note:** Instagram URLs are temporary. Consider downloading and hosting yourself.

---

## Best Practice: Host Your Own

Instead of using platform URLs (which can expire or change), download your profile pics and host them:

**Option 1: Put in `/public/avatars/`**
```bash
cd ~/clawd/content-factory/review-ui/public
mkdir -p avatars
# Download your images
curl -o avatars/twitter.jpg "YOUR_TWITTER_IMAGE_URL"
curl -o avatars/linkedin.jpg "YOUR_LINKEDIN_IMAGE_URL"
curl -o avatars/instagram.jpg "YOUR_INSTAGRAM_IMAGE_URL"
```

Then update `app/config/profile.ts`:
```typescript
twitter: {
  avatar: "/avatars/twitter.jpg",
  ...
},
linkedin: {
  avatar: "/avatars/linkedin.jpg",
  ...
},
instagram: {
  avatar: "/avatars/instagram.jpg",
  ...
},
```

**Option 2: Use a CDN (like Cloudinary or Imgur)**

Upload your profile pics to a CDN and use those URLs.

---

## Update the Config

Edit `app/config/profile.ts` with your actual URLs:

```typescript
export const profileConfig = {
  name: "Matt Barge",
  
  twitter: {
    handle: "@matthewbarge",
    avatar: "YOUR_TWITTER_AVATAR_URL_HERE",
    verified: true,
  },
  
  linkedin: {
    name: "Matt Barge",
    title: "Founder & Developer", // Update if needed
    avatar: "YOUR_LINKEDIN_AVATAR_URL_HERE",
  },
  
  instagram: {
    handle: "themattbarge",
    avatar: "YOUR_INSTAGRAM_AVATAR_URL_HERE",
  },
}
```

After updating, rebuild and deploy:
```bash
npm run build
netlify deploy --prod --dir=out
```

---

## Alternative: Let Me Fetch Them

If you want, I can try to fetch your profile images programmatically. Just let me know and I'll write a script to grab them from each platform.
