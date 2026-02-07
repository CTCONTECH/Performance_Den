# Performance Den Video Optimization Script
# This script re-encodes hero videos to both H.264 and H.265 formats for optimal quality and compression
# Requires: FFmpeg (https://ffmpeg.org/download.html)

# Installation: Install FFmpeg if not already installed
# Using Chocolatey: choco install ffmpeg
# Or download from: https://ffmpeg.org/download.html

param(
    [switch]$InstallFFmpeg = $false,
    [string]$VideoQuality = "high",  # high, medium, low
    [switch]$DryRun = $false
)

Write-Host "🎬 Performance Den Video Optimizer" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Check if FFmpeg is installed
$ffmpegPath = (Get-Command ffmpeg -ErrorAction SilentlyContinue).Source
if (-not $ffmpegPath) {
    Write-Host "❌ FFmpeg not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install FFmpeg using one of these methods:" -ForegroundColor Yellow
    Write-Host "1. Chocolatey: choco install ffmpeg" -ForegroundColor White
    Write-Host "2. Winget: winget install ffmpeg" -ForegroundColor White
    Write-Host "3. Download: https://ffmpeg.org/download.html" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ FFmpeg found at: $ffmpegPath`n" -ForegroundColor Green

# Define video quality presets
$presets = @{
    "high" = @{
        h264_crf = 20  # 0-51, lower = better (20 is visually lossless)
        h265_crf = 22  # HEVC can use slightly higher CRF for same quality
        audio_bitrate = "128k"
    }
    "medium" = @{
        h264_crf = 23
        h265_crf = 25
        audio_bitrate = "96k"
    }
    "low" = @{
        h264_crf = 26
        h265_crf = 28
        audio_bitrate = "64k"
    }
}

$config = $presets[$VideoQuality]
if (-not $config) {
    $config = $presets["high"]
}

Write-Host "Quality preset: $VideoQuality" -ForegroundColor Cyan
Write-Host "H.264 CRF: $($config.h264_crf)" -ForegroundColor Cyan
Write-Host "H.265 CRF: $($config.h265_crf)" -ForegroundColor Cyan
Write-Host ""

$videosDir = "assets/videos"
$videos = @("hero-bg.mp4", "hero-2.mp4", "hero-3.mp4")

$totalStartSize = 0
$totalEndSize = 0

foreach ($video in $videos) {
    $videoPath = Join-Path $videosDir $video
    
    if (-not (Test-Path $videoPath)) {
        Write-Host "⚠️  Skipping $video (not found)" -ForegroundColor Yellow
        continue
    }
    
    $fileSize = (Get-Item $videoPath).Length / 1MB
    $totalStartSize += $fileSize
    Write-Host "Processing: $video ($([math]::Round($fileSize, 2)) MB)" -ForegroundColor Cyan
    
    # H.264 optimization
    $h264Output = Join-Path $videosDir ($video -replace '\.mp4$', '.h264.mp4')
    $h265Output = Join-Path $videosDir ($video -replace '\.mp4$', '.h265.mp4')
    
    $h264Cmd = "ffmpeg -i `"$videoPath`" -c:v libx264 -crf $($config.h264_crf) -preset slow -c:a aac -b:a $($config.audio_bitrate) -y `"$h264Output`""
    $h265Cmd = "ffmpeg -i `"$videoPath`" -c:v libx265 -crf $($config.h265_crf) -preset slow -c:a aac -b:a $($config.audio_bitrate) -y `"$h265Output`""
    
    if ($DryRun) {
        Write-Host "  [DRY RUN] Would encode to H.264:" -ForegroundColor Gray
        Write-Host "  $h264Cmd" -ForegroundColor Gray
        Write-Host "  [DRY RUN] Would encode to H.265:" -ForegroundColor Gray
        Write-Host "  $h265Cmd" -ForegroundColor Gray
    } else {
        Write-Host "  → Encoding to H.264 (optimized for compatibility)..." -ForegroundColor White
        Invoke-Expression $h264Cmd | Out-Null
        
        if (Test-Path $h264Output) {
            $h264Size = (Get-Item $h264Output).Length / 1MB
            Write-Host "    ✅ H.264 complete: $([math]::Round($h264Size, 2)) MB (-$([math]::Round($fileSize - $h264Size, 2)) MB)" -ForegroundColor Green
            $totalEndSize += $h264Size
        }
        
        Write-Host "  → Encoding to H.265 (better compression)..." -ForegroundColor White
        Invoke-Expression $h265Cmd | Out-Null
        
        if (Test-Path $h265Output) {
            $h265Size = (Get-Item $h265Output).Length / 1MB
            Write-Host "    ✅ H.265 complete: $([math]::Round($h265Size, 2)) MB (-$([math]::Round($fileSize - $h265Size, 2)) MB)" -ForegroundColor Green
            $totalEndSize += $h265Size
        }
    }
    
    Write-Host ""
}

if (-not $DryRun) {
    Write-Host "✅ Optimization complete!" -ForegroundColor Green
    Write-Host "Total size reduction: $([math]::Round($totalStartSize, 2)) MB → $([math]::Round($totalEndSize, 2)) MB" -ForegroundColor Cyan
    Write-Host "Savings: $([math]::Round($totalStartSize - $totalEndSize, 2)) MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "The HTML will automatically use H.265 on modern browsers" -ForegroundColor Yellow
    Write-Host "and fall back to H.264 or original MP4 on older browsers." -ForegroundColor Yellow
}
