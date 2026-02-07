# Video Setup Guide

## Quick Start

Videos go in: `assets/videos/`

## Required Videos

1. **hero-bg.mp4** — Hero background (landscape, 15-30 sec)
2. **build-1.mp4** — Carousel slide 1 (15 sec)
3. **build-2.mp4** — Carousel slide 2 (15 sec)
4. **build-3.mp4** — Carousel slide 3 (15 sec)

## How to Get Videos from Instagram

### Option A: Download (Easiest)
1. Visit instagram.com/performanceden
2. Right-click any video post → Inspect → Find `<video>` tag
3. Copy the `src` URL
4. Paste into a downloader: https://insta-save.com/ or https://igdownload.app/
5. Save the MP4 file

### Option B: Screen Record
1. Go to the Instagram post
2. Press `Win + G` (Windows) to open Game Bar
3. Click "Start Recording"
4. Record 15-30 seconds
5. Save as MP4

### Option C: Use yt-dlp (Command Line)
```powershell
# Install yt-dlp
pip install yt-dlp

# Download video
yt-dlp -f best -o "assets/videos/hero-bg.mp4" "https://www.instagram.com/p/VIDEO_POST_ID/"
```

## Video Optimization

**For web, compress videos:**

```powershell
# Using ffmpeg (install with: choco install ffmpeg)
ffmpeg -i input.mp4 -vcodec h264 -b:v 1000k -acodec aac -b:a 128k output.mp4
```

**Settings:**
- Format: H.264 MP4
- Bitrate: 800-1500 kbps (fast loading)
- Audio: Optional (can mute with `muted` attribute)
- Max duration: 30 seconds per video

## Update Video URLs

Edit `assets/js/video-config.js` to change video paths or titles.

## Troubleshooting

- **Videos not showing?** Check browser console (F12) for errors
- **Videos choppy?** Reduce file size or bitrate
- **No sound?** Make sure MP4 has audio track, or remove `muted` from HTML
