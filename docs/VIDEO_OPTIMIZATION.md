# Video Optimization Guide

The website is now ready for video quality optimization. Here's what was implemented and how to use it:

## 🎬 What's New

### Advanced Transitions (Live Now)
✅ **Staggered Fades** - Videos fade out (0.4s) while next fades in (0.5s) for smooth overlap
✅ **Variable Timing** - Transition duration varies by ±50ms to prevent robotic feel  
✅ **Subtle Scale In** - Videos gently scale from 1.02x → 1.0x during fade-in
✅ **Loading Indicator** - Red pulsing dot appears during transition
✅ **Per-Video Timing** - Each video can have custom transition speed
✅ **Preloading Ready** - Next video loads silently (when optimized versions exist)

### Video Quality Support (Ready for Encoding)
- **H.265/HEVC** - Modern format (30-40% smaller, same quality)
- **H.264** - Compatibility fallback (plays nearly everywhere)
- **MP4** - Original fallback (if optimized versions missing)

Browser automatically uses the best format it supports!

---

## 🚀 How to Optimize Videos

### Step 1: Install FFmpeg
Choose one method:

**Chocolatey (Windows):**
```powershell
choco install ffmpeg
```

**Winget (Windows):**
```powershell
winget install ffmpeg
```

**Download:**  
https://ffmpeg.org/download.html

### Step 2: Run Optimization Script
```powershell
cd "c:\Dev\CTCONTECH PROJECTS\Performance Den"
.\scripts\optimize-videos.ps1
```

**With specific quality preset:**
```powershell
# Quality options: high (default), medium, low
.\scripts\optimize-videos.ps1 -VideoQuality high
```

**Dry run (see what would happen):**
```powershell
.\scripts\optimize-videos.ps1 -DryRun
```

### Step 3: Review Results
The script creates new files:
- `hero-bg.h265.mp4` - Best compression (H.265)
- `hero-bg.h264.mp4` - Wide compatibility (H.264)
- `hero-2.h265.mp4` & `hero-2.h264.mp4`
- `hero-3.h265.mp4` & `hero-3.h264.mp4`

Original MP4 files are kept as fallback.

---

## 📊 Quality Presets

### High Quality (Recommended)
```
CRF: H.264=20, H.265=22  (visually lossless)
Audio: 128 kbps
Encoding: -preset slow (higher quality, takes longer)
```

### Medium Quality
```
CRF: H.264=23, H.265=25  (excellent, slight compression)
Audio: 96 kbps
```

### Low Quality (Fast internet unnecessary)
```
CRF: H.264=26, H.265=28  (good, more compression)
Audio: 64 kbps
```

---

## 🎯 Expected Results

**Before:** ~7.3 MB total (3 videos)
**After:** ~5-5.5 MB total (with H.265 variants)

- H.265 files: ~30-40% smaller than H.264
- H.264 files: Similar to originals (compatibility backup)
- Encoding time: ~2-3 minutes total (depending on CPU)

---

## ✅ Current Status

**Working Now:**
- 3x hero videos looping smoothly
- Staggered fade transitions with subtle scale
- Loading indicator during transitions
- Per-video timing configuration

**After Video Encoding:**
- Website automatically serves H.265 to modern browsers
- Falls back to H.264 or original MP4 on older devices
- Faster loading with smaller file sizes
- Same visual quality, better performance

---

## 📝 Notes

- Original MP4 files remain unchanged (fallback)
- Website checks video format support and picks best available
- New files are created alongside originals (no replacements)
- HTML automatically configured for multi-format support
- Console logs video being played if you open DevTools

Enjoy the professional video transitions! 🎬
