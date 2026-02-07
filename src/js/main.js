const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Hero video playlist
const heroVideo = document.querySelector(".hero-video");
const heroConfig = window.videoConfig?.hero;

if (heroVideo && heroConfig?.sources?.length) {
  let heroIndex = 0;
  const sources = heroConfig.sources;
  const pauseSeconds = heroConfig.pauseBetweenSeconds ?? 0;
  const playbackRate = heroConfig.playbackRate ?? 1;
  const fadeDuration = 600;
  let isTransitioning = false;

  const setSource = (index) => {
    if (isTransitioning) return; // Prevent multiple transitions
    isTransitioning = true;
    
    heroIndex = index % sources.length;
    heroVideo.classList.add("is-fading");
    
    setTimeout(() => {
      heroVideo.src = sources[heroIndex];
      heroVideo.playbackRate = playbackRate;
      heroVideo.load();
      
      // Ensure video plays after loading
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => console.log("Video play prevented"));
      }
      
      isTransitioning = false;
    }, fadeDuration);
  };

  heroVideo.addEventListener("ended", () => {
    setTimeout(() => setSource(heroIndex + 1), pauseSeconds * 1000);
  });

  heroVideo.addEventListener("error", () => {
    console.error("Video error, skipping to next");
    isTransitioning = false;
    setSource(heroIndex + 1);
  });

  heroVideo.addEventListener("loadeddata", () => {
    heroVideo.classList.remove("is-fading");
  });

  // Fallback: if video is paused unexpectedly, resume playback
  setInterval(() => {
    if (heroVideo && heroVideo.paused && !isTransitioning && document.hidden === false) {
      heroVideo.play().catch(() => {});
    }
  }, 1000);

  setSource(0);
}

// Video carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");
const totalSlides = slides.length;

function showSlide(index) {
  if (totalSlides === 0) return;
  currentSlide = (index + totalSlides) % totalSlides;
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentSlide);
    const video = slide.querySelector(".slide-video");
    if (video && i === currentSlide) {
      video.play().catch(() => {});
    } else if (video) {
      video.pause();
    }
  });
  const counter = document.getElementById("carousel-current");
  if (counter) counter.textContent = currentSlide + 1;
}

const prevBtn = document.querySelector(".carousel-prev");
const nextBtn = document.querySelector(".carousel-next");
const totalCounter = document.getElementById("carousel-total");

if (prevBtn) prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
if (nextBtn) nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
if (totalCounter) totalCounter.textContent = totalSlides;

if (totalSlides > 0) {
  showSlide(0);
  // Auto-advance carousel every 8 seconds
  setInterval(() => showSlide(currentSlide + 1), 8000);
}

// Instagram embed
const instagramGrid = document.getElementById("instagram-grid");
const config = window.instagramConfig;

if (instagramGrid && config?.featuredPosts?.length) {
  config.featuredPosts.forEach((postUrl) => {
    const card = document.createElement("div");
    card.className = "instagram-card";
    card.innerHTML = `
      <blockquote
        class="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink="${postUrl}"
        data-instgrm-version="14"
        style=" background:#000; border:0; margin: 0; padding: 0; width: 100%; min-width: 100%;">
      </blockquote>
      <noscript>
        <a href="${postUrl}" target="_blank" rel="noreferrer">View post</a>
      </noscript>
    `;
    instagramGrid.appendChild(card);
  });

  if (window.instgrm?.Embeds?.process) {
    window.instgrm.Embeds.process();
  } else {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = () => window.instgrm?.Embeds?.process?.();
    document.body.appendChild(script);
  }
}


