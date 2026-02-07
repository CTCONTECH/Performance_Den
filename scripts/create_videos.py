import cv2
import numpy as np
import os

# Create videos directory if it doesn't exist
os.makedirs("assets/videos", exist_ok=True)

# Video settings
width, height = 1280, 720
fps = 30
duration = 10  # seconds

videos = {
    "hero-bg.mp4": "Performance Den - Hero Background",
    "build-1.mp4": "Honda Civic Time Attack",
    "build-2.mp4": "Integra Street Spec",
    "build-3.mp4": "S2000 Weekend Warrior"
}

for filename, title in videos.items():
    filepath = f"assets/videos/{filename}"
    
    # Create video writer
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(filepath, fourcc, fps, (width, height))
    
    # Generate frames
    total_frames = int(fps * duration)
    for frame_num in range(total_frames):
        # Create a frame with gradient background
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        
        # Red-to-black gradient (performance theme)
        for y in range(height):
            intensity = int(255 * (1 - (y / height)) * 0.8)
            frame[y, :] = [0, 0, intensity]  # Red channel
        
        # Add animation effect (moving line)
        x_pos = int((frame_num / total_frames) * width)
        cv2.line(frame, (x_pos, 0), (x_pos, height), (0, 255, 255), 3)
        
        # Add text
        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(frame, title, (50, height // 2), font, 2, (255, 255, 255), 3)
        cv2.putText(frame, f"Placeholder - {frame_num + 1}/{total_frames}", 
                   (50, height // 2 + 60), font, 1, (150, 150, 150), 2)
        
        out.write(frame)
    
    out.release()
    print(f"✓ Created {filepath}")

print("\nAll placeholder videos created successfully!")
