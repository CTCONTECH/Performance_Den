const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Hero video playlist with advanced transitions
const heroVideo = document.querySelector(".hero-video");
const heroLoading = document.querySelector(".hero-loading");
const heroConfig = window.videoConfig?.hero;

if (heroVideo && heroConfig?.sources?.length) {
  let heroIndex = 0;
  let nextIndex = 1;
  const sources = heroConfig.sources;
  const playbackRate = heroConfig.playbackRate ?? 1;
  const pauseSeconds = heroConfig.pauseBetweenSeconds ?? 0;
  const transitionVariation = heroConfig.transitionVariation ?? 0;
  
  let isTransitioning = false;
  let nextVideoReady = false;
  let nextVideoElement = null;

  // Helper: Get transition duration with optional randomization
  const getTransitionDuration = (baseDuration) => {
    if (transitionVariation <= 0) return baseDuration;
    const variation = Math.random() * transitionVariation * 2 - transitionVariation;
    return Math.max(200, baseDuration + variation);
  };

  // Helper: Load multiple video formats and pick the one the browser supports
  const setVideoSource = (videoElement, sourceConfig) => {
    // Clear existing sources
    videoElement.innerHTML = '';
    
    if (!sourceConfig.formats) {
      videoElement.src = sourceConfig;
      return;
    }

    // Try each format - browser will pick the first it supports
    sourceConfig.formats.forEach(format => {
      const source = document.createElement('source');
      source.src = format.src;
      source.type = format.type;
      videoElement.appendChild(source);
    });
  };

  // Preload next video in background
  const preloadNextVideo = () => {
    nextIndex = (heroIndex + 1) % sources.length;
    nextVideoElement = new Audio(); // Use Audio element for silent preload
    
    if (sources[nextIndex].formats) {
      // Try the best format (H.265) first
      nextVideoElement.src = sources[nextIndex].formats[0].src;
    } else {
      nextVideoElement.src = sources[nextIndex];
    }
    
    nextVideoElement.load();
    nextVideoReady = true;
  };

  // Staggered fade: fade out current, fade in next
  const fadeOutCurrentVideo = (duration) => {
    return new Promise((resolve) => {
      heroVideo.classList.add("is-fading-out");
      setTimeout(() => {
        heroVideo.classList.remove("is-fading-out");
        resolve();
      }, duration);
    });
  };

  const fadeInNewVideo = (duration) => {
    return new Promise((resolve) => {
      heroVideo.classList.add("is-fading-in");
      setTimeout(() => {
        heroVideo.classList.remove("is-fading-in");
        heroLoading.classList.remove("active");
        resolve();
      }, duration);
    });
  };

  // Main video switching logic
  const setSource = async (index) => {
    if (isTransitioning) return;
    isTransitioning = true;
    
    heroIndex = index % sources.length;
    const currentSource = sources[heroIndex];
    const fadeOutDuration = getTransitionDuration((currentSource.transition || 600) * 0.6);
    const fadeInDuration = getTransitionDuration((currentSource.transition || 600) * 0.4);
    
    console.log(`Loading video ${heroIndex + 1}/${sources.length}: ${currentSource.name}`);
    heroLoading.classList.add("active");

    try {
      // Fade out current video
      await fadeOutCurrentVideo(fadeOutDuration);
      
      // Load new video sources
      setVideoSource(heroVideo, currentSource);
      heroVideo.playbackRate = playbackRate;
      heroVideo.load();

      // Wait for video to be ready to play
      await new Promise((resolve, reject) => {
        const onCanPlay = () => {
          heroVideo.removeEventListener('canplay', onCanPlay);
          heroVideo.removeEventListener('error', onError);
          resolve();
        };
        const onError = () => {
          heroVideo.removeEventListener('canplay', onCanPlay);
          heroVideo.removeEventListener('error', onError);
          reject(new Error('Video load failed'));
        };
        
        // Set timeout in case events don't fire
        setTimeout(() => {
          heroVideo.removeEventListener('canplay', onCanPlay);
          heroVideo.removeEventListener('error', onError);
          resolve();
        }, 3000);
        
        heroVideo.addEventListener('canplay', onCanPlay, { once: true });
        heroVideo.addEventListener('error', onError, { once: true });
      });

      // Play video and fade in
      heroVideo.play().catch(err => console.log("Play prevented:", err));
      
      // Add subtle scale animation on fade in
      heroVideo.classList.add("is-scaling-in");
      await fadeInNewVideo(fadeInDuration);
      heroVideo.classList.remove("is-scaling-in");

      // Preload next video while current plays
      preloadNextVideo();
      
      isTransitioning = false;
    } catch (error) {
      console.error("Error loading video:", error);
      isTransitioning = false;
      // Skip to next video on error
      setTimeout(() => setSource(heroIndex + 1), pauseSeconds * 1000);
    }
  };

  // Event listeners
  heroVideo.addEventListener("ended", () => {
    setTimeout(() => setSource(heroIndex + 1), pauseSeconds * 1000);
  });

  // Resume if paused unexpectedly
  setInterval(() => {
    if (heroVideo && heroVideo.paused && !isTransitioning && document.hidden === false) {
      heroVideo.play().catch(() => {});
    }
  }, 2000);

  // Start with first video
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

// Contact form submission handler
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  let statusClearTimeout; // Track timeout to allow cancellation
  
  // Function to clear status message
  const clearStatus = () => {
    const statusEl = contactForm.querySelector(".form-status");
    if (statusClearTimeout) clearTimeout(statusClearTimeout);
    if (statusEl) {
      statusEl.style.opacity = "0";
      statusEl.style.transition = "opacity 0.3s ease";
      setTimeout(() => {
        statusEl.innerHTML = "";
        statusEl.style.opacity = "1";
        statusEl.style.display = "none";
        statusEl.style.transition = "none";
      }, 300);
    }
  };
  
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const statusEl = contactForm.querySelector(".form-status");
    const submitBtn = contactForm.querySelector("button[type='submit']");
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const platform = formData.get("platform") || "Not specified";
    const message = formData.get("message");
    
    // Clear any existing timeout
    if (statusClearTimeout) clearTimeout(statusClearTimeout);
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ Processing...";
    
    statusEl.style.display = "flex";
    statusEl.style.transition = "none";
    statusEl.innerHTML = `<span>Processing your enquiry...</span>`;
    statusEl.style.borderColor = "var(--muted)";
    statusEl.style.backgroundColor = "rgba(168, 176, 183, 0.1)";
    statusEl.style.color = "var(--muted)";
    
    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Build message for mailto
    const mailtoBody = `${message}\n\n---\nVehicle: ${platform}\nFrom: ${name}`;
    const mailtoLink = `mailto:Ctconenquiry@gmail.com?subject=Performance Den Enquiry from ${name}&body=${encodeURIComponent(mailtoBody)}`;
    
    // Show success with options and close button
    statusEl.innerHTML = `
      <div style="width: 100%; display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 0.5rem;">✓ Choose how to send</div>
            <small style="display: block; opacity: 0.85; line-height: 1.4;">Pick your preferred way to contact us</small>
          </div>
          <button type="button" onclick="this.closest('.form-status').parentElement.dispatchEvent(new Event('clearStatus'))" style="background: none; border: none; color: inherit; font-size: 1.5rem; cursor: pointer; opacity: 0.6; transition: opacity 0.2s; padding: 0; margin: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">✕</button>
        </div>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; align-items: center;">
          <a href="${mailtoLink}" class="form-action-link" style="display: inline-block; padding: 0.7rem 1.5rem; background: var(--accent); color: white; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; border: 2px solid var(--accent); cursor: pointer;">📧 Email</a>
          <span style="opacity: 0.4; font-size: 0.85rem;">or</span>
          <a href="https://wa.me/27823203406?text=${encodeURIComponent(`Hi, I'd like to inquire about: ${message}`)}" class="form-action-link" style="display: inline-block; padding: 0.7rem 1.5rem; background: #25D366; color: white; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; border: 2px solid #25D366; cursor: pointer;">💬 WhatsApp</a>
        </div>
        <small style="text-align: center; opacity: 0.6; font-size: 0.8rem;">Click close (✕) or pick a method above</small>
      </div>
    `;
    statusEl.style.borderColor = "var(--accent)";
    statusEl.style.backgroundColor = "rgba(255, 59, 47, 0.08)";
    statusEl.style.color = "var(--accent)";
    
    // Make action links close the status box when clicked
    const actionLinks = statusEl.querySelectorAll(".form-action-link");
    actionLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        // Clear status immediately when clicking an action link
        clearStatus();
      });
    });
    
    // Make status clickable to dismiss (but don't interfere with link clicks)
    statusEl.style.cursor = "pointer";
    statusEl.onclick = (e) => {
      if (e.target.tagName !== "A" && e.target.className !== "form-action-link") {
        clearStatus();
      }
    };
    
    // Reset form
    contactForm.reset();
    submitBtn.textContent = "Send Enquiry";
    submitBtn.disabled = false;
    
    // Auto-clear after 8 seconds with fade
    statusClearTimeout = setTimeout(() => {
      statusEl.style.transition = "opacity 0.3s ease";
      statusEl.style.opacity = "0";
      setTimeout(() => {
        clearStatus();
      }, 300);
    }, 8000);
  });
}




