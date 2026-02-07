import Bun from "bun";
import * as fs from "fs";
import * as path from "path";

const videosDir = "./assets/videos";

// Create directory if it doesn't exist
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

// Minimal valid MP4 file (placeholder)
// This is a very small valid MP4 that won't play video but won't error
const createMinimalMP4 = () => {
  // Basic MP4 structure (ftyp + mdat boxes)
  const buffer = new Uint8Array([
    0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, // ftyp box header
    0x69, 0x73, 0x6f, 0x6d, 0x00, 0x00, 0x00, 0x00, // isom
    0x69, 0x73, 0x6f, 0x6d, 0x6d, 0x64, 0x61, 0x74, // mdat
    0x00, 0x00, 0x00, 0x08, 0x6d, 0x64, 0x61, 0x74, // mdat box
  ]);
  return buffer;
};

const videos = [
  "hero-bg.mp4",
  "build-1.mp4",
  "build-2.mp4",
  "build-3.mp4",
];

console.log("Creating placeholder videos...\n");

for (const video of videos) {
  const filepath = path.join(videosDir, video);
  const buffer = createMinimalMP4();
  fs.writeFileSync(filepath, buffer);
  console.log(`✓ Created ${filepath} (${buffer.length} bytes)`);
}

console.log("\n✓ All placeholder videos created!");
console.log("Refresh your browser to see the videos load.");
