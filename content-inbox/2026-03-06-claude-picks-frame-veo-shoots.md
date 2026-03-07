# Claude picks the crop, Veo shoots the motion

**Date:** 2026-03-06 14:00
**Pillar:** ai
**Score:** 84

## What Happened

Built analysis-based smart crop into a real estate video pipeline: Claude Vision analyzes a property photo and returns first_frame_x_pct and last_frame_x_pct — fractional horizontal positions for two 9:16 keyframes. For a desk-to-bedroom shot, Claude returned 0.62 and 0.28 (start right on the desk/chair foreground, arc left through the doorway to reveal the bedroom). Those two frames go to Google Veo as first-and-last keyframe anchors; Veo interpolates the camera move between them. Also wired context-specific behavior: promo format uses center crop, highlight reels use analysis-based crop — same infrastructure, different behavior per use case.

## Why It Matters

You don't need a better video model — you need smarter inputs. Claude doesn't shoot video; it makes Veo make better decisions. One AI optimizing inputs for another AI is the production pattern that keeps working: analysis → structured output → feeds the next model's context. The crop algorithm was blind to what makes a shot interesting. Vision-based analysis isn't.

## Media

PROMO-205-desk-6bd98c3b-text_cta.mp4
