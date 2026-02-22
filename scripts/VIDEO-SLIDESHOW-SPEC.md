# Video Slideshow Generator - Specification

**Status:** Documented, not yet built  
**Purpose:** Turn static content into video for YouTube Shorts, TikTok, Instagram Reels

---

## Overview

Takes a story → generates images for each point → combines into video with text overlays

**Output formats:**
- YouTube Shorts (vertical 9:16, 60 sec)
- TikTok (vertical 9:16, 60 sec)
- Instagram Reels (vertical 9:16, 30-60 sec)

---

## Architecture

```
Story JSON
  ↓
Generate script (already done by format templates)
  ↓
Generate frames (images with text)
  ↓
Combine with ffmpeg → MP4 video
  ↓
Add audio (TTS or trending audio)
  ↓
Export in platform format
```

---

## Usage

```bash
# Generate from existing prompt
./video-slideshow.js --prompt-file drafts/story/tiktok-slideshow-prompt.txt

# Or from story directly
./video-slideshow.js --story app-store-defense --format tiktok

# Outputs:
# - video.mp4 (1080x1920, 60 sec)
# - frames/ (individual PNG frames)
# - audio.mp3 (if TTS generated)
```

---

## Frame Generation (Programmatic Design)

### Using Node Canvas

```javascript
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function generateSlide(slide, index, totalSlides) {
  const width = 1080;
  const height = 1920; // 9:16 vertical
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Main text (large, centered)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 80px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Word wrap
  wrapText(ctx, slide.text, width / 2, height / 2, width - 200, 100);
  
  // Slide number
  ctx.font = '32px Arial';
  ctx.fillStyle = '#888888';
  ctx.fillText(`${index + 1}/${totalSlides}`, width / 2, height - 100);
  
  // Save frame
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`./frames/slide-${String(index).padStart(3, '0')}.png`, buffer);
  
  return `./frames/slide-${String(index).padStart(3, '0')}.png`;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let yPos = y;
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, yPos);
      line = words[n] + ' ';
      yPos += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, yPos);
}
```

---

## Video Assembly (ffmpeg)

```javascript
const ffmpeg = require('fluent-ffmpeg');

async function createVideo(frames, audioPath, outputPath) {
  return new Promise((resolve, reject) => {
    const frameDuration = 3; // 3 seconds per frame
    
    ffmpeg()
      // Input: image sequence
      .input(`frames/slide-%03d.png`)
      .inputFPS(1 / frameDuration) // Change image every 3 seconds
      
      // Add audio (optional)
      .input(audioPath)
      .audioCodec('aac')
      
      // Video settings
      .videoCodec('libx264')
      .size('1080x1920') // Vertical format
      .fps(30)
      .format('mp4')
      
      // Output
      .output(outputPath)
      
      // Run
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}
```

---

## Audio Options

### Option 1: Text-to-Speech (Free)

```javascript
const tts = require('@google-cloud/text-to-speech');

async function generateVoiceover(script) {
  const client = new tts.TextToSpeechClient();
  
  const request = {
    input: { text: script },
    voice: {
      languageCode: 'en-US',
      name: 'en-US-Neural2-J', // Male voice
      ssmlGender: 'MALE'
    },
    audioConfig: { audioEncoding: 'MP3' }
  };
  
  const [response] = await client.synthesizeSpeech(request);
  fs.writeFileSync('audio.mp3', response.audioContent, 'binary');
  
  return 'audio.mp3';
}
```

### Option 2: Silent + Captions

Just show text on screen, no audio (works for many TikToks)

### Option 3: Trending Audio

Download trending audio and use that as background (manual for now)

---

## Text Overlay (Alternative to TTS)

```javascript
async function addTextOverlay(videoPath, captions, outputPath) {
  // Add captions to video using ffmpeg drawtext filter
  
  const filterComplex = captions.map((caption, i) => {
    return `drawtext=text='${caption.text}':` +
           `fontfile=/path/to/font.ttf:` +
           `fontsize=60:fontcolor=white:` +
           `x=(w-text_w)/2:y=(h-text_h)/2:` +
           `enable='between(t,${caption.start},${caption.end})'`;
  }).join(',');
  
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .complexFilter(filterComplex)
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
}
```

---

## Full Pipeline

```javascript
async function generateSlideshow(storyPromptFile) {
  // 1. Parse TikTok/YouTube Short prompt
  const script = parseSlideShowPrompt(storyPromptFile);
  
  // 2. Generate image for each slide
  console.log('Generating frames...');
  const frames = [];
  for (let i = 0; i < script.slides.length; i++) {
    const framePath = await generateSlide(
      script.slides[i],
      i,
      script.slides.length
    );
    frames.push(framePath);
  }
  
  // 3. Generate voiceover or use silent
  let audioPath = null;
  if (script.voiceover) {
    console.log('Generating voiceover...');
    audioPath = await generateVoiceover(script.voiceover);
  }
  
  // 4. Combine into video
  console.log('Creating video...');
  const videoPath = await createVideo(
    frames,
    audioPath,
    'output.mp4'
  );
  
  // 5. Add text overlays if needed
  if (script.textOverlays) {
    console.log('Adding captions...');
    await addTextOverlay(videoPath, script.textOverlays, 'final.mp4');
  }
  
  console.log('✅ Video ready: final.mp4');
  
  return 'final.mp4';
}
```

---

## Platform-Specific Adjustments

### TikTok
- Max 60 seconds
- Fast-paced (2-3 sec per slide)
- Bold text, high contrast
- Trending audio crucial

### YouTube Shorts
- Max 60 seconds
- Can be slightly slower (3-4 sec per slide)
- More informational
- Voiceover helpful

### Instagram Reels
- 30-60 seconds
- Visual-first
- Can use trending audio
- Captions recommended (many watch muted)

---

## Example: App Store Defense Story

**Input:** `tiktok-slideshow-prompt.txt` (generated by multiply.js)

**Output:**
```
Slide 1 (0-3s): "POV: You got 5 App Store rejections in one week 😤"
Slide 2 (3-6s): "Most devs: Submit → Wait → Reject → Repeat"
Slide 3 (6-9s): "I built a defense system instead 🛡️"
Slide 4 (9-15s): "5 scripts that catch 12+ rejection causes"
Slide 5 (15-21s): "Before Apple even sees your app"
Slide 6 (21-27s): "Real-time monitoring (15 min updates)"
Slide 7 (27-33s): "Rejection database → System learns"
Slide 8 (33-39s): "Result: Zero repeat mistakes ✅"
Slide 9 (39-45s): "Amateur: React to rejections"
Slide 10 (45-51s): "Factory: Prevent them 🏭"
Slide 11 (51-57s): "Systems that learn > error-free systems"
Slide 12 (57-60s): "Follow for more automation wins 🚀"
```

**Video specs:**
- 1080x1920 (vertical)
- 60 seconds
- 12 slides, 5 seconds each
- Bold white text on dark gradient
- Slide counter at bottom
- Optional: Trending TikTok audio

---

## Dependencies

```bash
npm install canvas fluent-ffmpeg @google-cloud/text-to-speech
# Also need ffmpeg installed: brew install ffmpeg
```

---

## Future Enhancements

### v1: Static Slides (This Spec)
- Generate images with text
- Combine into video
- Basic but functional

### v2: Motion Graphics
- Ken Burns effect (zoom/pan on images)
- Transitions between slides
- Animated text

### v3: AI-Generated Backgrounds
- Use Stability AI or DALL-E for custom backgrounds per slide
- Visual variety

### v4: Dynamic Content
- Screen recording integration
- Code demos
- Live examples

---

## Cost

**Free version (this spec):**
- Node canvas (free)
- ffmpeg (free)
- Google TTS (free tier: 4M chars/month)

**Total:** $0/month for typical usage

---

**Status:** Spec complete, ready to implement when video is priority
