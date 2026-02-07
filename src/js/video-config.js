window.videoConfig = {
  hero: {
    sources: [
      {
        name: "hero-bg",
        formats: [
          { src: "assets/videos/hero-bg.mp4", type: "video/mp4" }
        ],
        transition: 600  // milliseconds for fade
      },
      {
        name: "hero-2",
        formats: [
          { src: "assets/videos/hero-2.mp4", type: "video/mp4" }
        ],
        transition: 650
      },
      {
        name: "hero-3",
        formats: [
          { src: "assets/videos/hero-3.mp4", type: "video/mp4" }
        ],
        transition: 600
      }
    ],
    fallback: "assets/images/hero-poster.svg",
    playbackRate: 0.85,
    pauseBetweenSeconds: 0,
    transitionVariation: 50  // add random ±50ms to transition for less robotic feel
  },
  builds: [
    {
      url: "assets/videos/build-1.mp4",
      title: "Honda Civic Time Attack",
      description: "Track • Turbo • Suspension refresh"
    },
    {
      url: "assets/videos/build-2.mp4",
      title: "Integra Street Spec",
      description: "Street • NA • ECU calibration"
    },
    {
      url: "assets/videos/build-3.mp4",
      title: "S2000 Weekend Warrior",
      description: "Honda • Track • Brake upgrade"
    }
  ]
};
