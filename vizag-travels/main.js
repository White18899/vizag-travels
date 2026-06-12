/* 
   Vizag Travels - Client Interactivity & Animations Script
   Designed by: Antigravity AI
   Owner: Rapeti Matshya Mukesh
*/

document.addEventListener('DOMContentLoaded', () => {
  // --- INTRO LOADER ANIMATION ---
  const introLoader = document.getElementById('intro-loader');
  document.body.classList.add('loading');

  if (introLoader) {
    setTimeout(() => {
      introLoader.classList.add('slide-up');
      document.body.classList.remove('loading');
      
      // Trigger Hero reveal animation right after loader slides away
      setTimeout(() => {
        const heroReveal = document.querySelector('.hero .reveal');
        if (heroReveal) heroReveal.classList.add('active');
      }, 400);

      // Clean up loader from DOM after animation completes
      setTimeout(() => {
        introLoader.style.display = 'none';
      }, 800);
    }, 2500); // 2.5 seconds splash intro
  }

  // --- CUSTOM CURSOR ---
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');
  
  // Immediately destroy custom cursors on touchscreen interaction (fixes emulator/hybrid touchscreen bugs)
  window.addEventListener('touchstart', function removeCursorOnTouch() {
    if (cursor) cursor.remove();
    if (cursorDot) cursorDot.remove();
    window.removeEventListener('touchstart', removeCursorOnTouch);
  }, { passive: true });

  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  
  if (hasFinePointer && cursor && cursorDot) {
    // Show custom cursor elements on fine pointer screens
    cursor.style.display = 'block';
    cursorDot.style.display = 'block';

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    });

    const hoverElements = document.querySelectorAll('a, button, .filter-btn, .gallery-item, .package-card, .slider-btn');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.backgroundColor = 'rgba(19, 176, 197, 0.1)';
        cursor.style.borderColor = '#eeb902';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.backgroundColor = 'transparent';
        cursor.style.borderColor = '#13b0c5';
      });
    });
  } else {
    // Remove cursor elements entirely on touch devices to avoid interference
    if (cursor) cursor.remove();
    if (cursorDot) cursorDot.remove();
  }

  // --- STICKY NAVBAR & PROGRESS BAR ---
  const header = document.querySelector('header');
  const scrollProgress = document.querySelector('.scroll-progress');

  window.addEventListener('scroll', () => {
    // Sticky header class toggle
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Progress bar width
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (window.scrollY / windowHeight) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = `${scrollPercentage}%`;
    }
  });

  // --- MOBILE NAVIGATION TOGGLE ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      
      // Lock body scroll when mobile menu is active
      if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = ''; // Ensure scroll is restored
      });
    });
  }

  // --- HERO BACKGROUND SLIDER ---
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;
  const slideInterval = 6000;

  function nextSlide() {
    if (slides.length > 0) {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }
  }

  if (slides.length > 0) {
    setInterval(nextSlide, slideInterval);
  }

  // --- SCROLL REVEAL ANIMATIONS (Intersection Observer) ---
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .scale-up');
  const isMobileDevice = window.innerWidth <= 1024;
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: isMobileDevice ? 0.08 : 0.15,
    rootMargin: isMobileDevice ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // --- DYNAMIC PACKAGE FILTERING ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const packageCards = document.querySelectorAll('.package-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Active state for button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      packageCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- TESTIMONIALS SLIDER ---
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  let currentTestimonial = 0;
  let testimonialTimer;

  function showTestimonial(index) {
    testimonialSlides.forEach(slide => {
      slide.classList.remove('active');
    });
    testimonialSlides[index].classList.add('active');
    currentTestimonial = index;
  }

  function nextTestimonial() {
    let index = (currentTestimonial + 1) % testimonialSlides.length;
    showTestimonial(index);
  }

  function prevTestimonial() {
    let index = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
    showTestimonial(index);
  }

  function startTestimonialAuto() {
    testimonialTimer = setInterval(nextTestimonial, 5000);
  }

  function stopTestimonialAuto() {
    clearInterval(testimonialTimer);
  }

  if (testimonialSlides.length > 0) {
    showTestimonial(0);
    startTestimonialAuto();

    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', () => {
        stopTestimonialAuto();
        nextTestimonial();
        startTestimonialAuto();
      });

      prevBtn.addEventListener('click', () => {
        stopTestimonialAuto();
        prevTestimonial();
        startTestimonialAuto();
      });
    }

    const sliderContainer = document.querySelector('.testimonials-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', stopTestimonialAuto);
      sliderContainer.addEventListener('mouseleave', startTestimonialAuto);
    }
  }

  // --- GALLERY LIGHTBOX ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (galleryItems.length > 0 && lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').getAttribute('src');
        lightboxImg.setAttribute('src', imgSrc);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scrolling
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImg.setAttribute('src', '');
      }, 300);
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // --- BOOKING INQUIRY FORM & MODAL ---
  const bookingForm = document.getElementById('bookingForm');
  const searchForm = document.getElementById('searchForm');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (bookingForm && successModal) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const name = document.getElementById('userName').value.trim();
      const email = document.getElementById('userEmail').value.trim();
      const phone = document.getElementById('userPhone').value.trim();
      const packageSelected = document.getElementById('travelPackage').value;
      const date = document.getElementById('travelDate').value;
      const guests = document.getElementById('travelGuests').value;
      const address = document.getElementById('userAddress').value.trim();
      const message = document.getElementById('userMessage').value.trim();

      if (!name || !email || !phone || !packageSelected || !date || !guests || !address) {
        alert('Please fill in all required details (including address) to send the inquiry.');
        return;
      }

      // Format WhatsApp Message details
      const whatsappNumber = '919398149818'; // country code + number
      const text = `*Vizag Travels Booking Inquiry*\n\n` +
                   `• *Name:* ${name}\n` +
                   `• *Phone:* ${phone}\n` +
                   `• *Email:* ${email}\n` +
                   `• *Address:* ${address}\n` +
                   `• *Selected Package:* ${packageSelected}\n` +
                   `• *Date of Travel:* ${date}\n` +
                   `• *Number of Guests:* ${guests}\n` +
                   `• *Special Request:* ${message ? message : 'None'}`;
      
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

      // Open WhatsApp Web/App in a new tab
      window.open(whatsappUrl, '_blank');

      // Show local success modal overlay
      successModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Reset form fields
      bookingForm.reset();
    });
  }

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const destination = document.getElementById('searchDest').value;
      const date = document.getElementById('searchDate').value;
      const type = document.getElementById('searchType').value;

      // Scroll to booking form and populate fields
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
          const travelPackage = document.getElementById('travelPackage');
          const travelDate = document.getElementById('travelDate');
          
          if (travelPackage && destination) {
            travelPackage.value = destination;
          }
          if (travelDate && date) {
            travelDate.value = date;
          }
        }, 800);
      }
    });
  }

  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // --- CINEMATIC VIDEO SIMULATOR ---
  const videoPlayer = document.querySelector('.video-player');
  const videoPlayBtn = document.getElementById('videoPlayBtn');
  const videoPlayerOverlay = document.getElementById('videoPlayerOverlay');
  const controlPlayPause = document.getElementById('controlPlayPause');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const videoProgress = document.getElementById('videoProgress');
  const videoCurrentTime = document.getElementById('videoCurrentTime');
  const videoDuration = document.getElementById('videoDuration');
  const videoFrames = document.querySelectorAll('.video-frame');

  let videoIsPlaying = false;
  let videoFrameIndex = 0;
  let videoTimer = null;
  let progressTimer = null;
  let timeElapsed = 0; // seconds
  const totalDuration = 15.0; // 15 seconds

  function updateVideoFrame() {
    videoFrames.forEach(frame => frame.classList.remove('active'));
    videoFrames[videoFrameIndex].classList.add('active');
    
    // Increment slide index for next transition
    videoFrameIndex = (videoFrameIndex + 1) % videoFrames.length;
  }

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }

  function playSimulatedVideo() {
    videoIsPlaying = true;
    videoPlayer.classList.add('playing');
    videoPlayer.classList.remove('paused');
    videoPlayerOverlay.classList.add('hidden');
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';

    // Image frame transition every 3 seconds
    videoTimer = setInterval(() => {
      updateVideoFrame();
    }, 3000);

    // Progress bar and timestamp update every 100ms
    progressTimer = setInterval(() => {
      timeElapsed += 0.1;
      
      // Update progress bar
      const percentage = (timeElapsed / totalDuration) * 100;
      if (videoProgress) videoProgress.style.width = `${percentage}%`;
      
      // Update time indicator
      if (videoCurrentTime) videoCurrentTime.textContent = formatTime(timeElapsed);

      // End of video simulation
      if (timeElapsed >= totalDuration) {
        stopSimulatedVideo();
      }
    }, 100);
  }

  function pauseSimulatedVideo() {
    videoIsPlaying = false;
    videoPlayer.classList.add('paused');
    videoPlayer.classList.remove('playing');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';

    clearInterval(videoTimer);
    clearInterval(progressTimer);
  }

  function stopSimulatedVideo() {
    pauseSimulatedVideo();
    videoPlayer.classList.remove('paused');
    videoPlayerOverlay.classList.remove('hidden');
    timeElapsed = 0;
    videoFrameIndex = 0;
    
    if (videoProgress) videoProgress.style.width = '0%';
    if (videoCurrentTime) videoCurrentTime.textContent = '00:00';
    
    // Reset to first frame
    videoFrames.forEach(frame => frame.classList.remove('active'));
    videoFrames[0].classList.add('active');
  }

  if (videoPlayer && videoPlayBtn) {
    videoPlayBtn.addEventListener('click', playSimulatedVideo);
    videoPlayerOverlay.addEventListener('click', playSimulatedVideo);

    if (controlPlayPause) {
      controlPlayPause.addEventListener('click', (e) => {
        e.stopPropagation();
        if (videoIsPlaying) {
          pauseSimulatedVideo();
        } else {
          playSimulatedVideo();
        }
      });
    }

    // Timeline click simulator
    const timeline = document.querySelector('.video-timeline');
    if (timeline) {
      timeline.addEventListener('click', (e) => {
        e.stopPropagation();
        const timelineWidth = timeline.clientWidth;
        const clickX = e.offsetX;
        const newPercentage = clickX / timelineWidth;
        
        timeElapsed = newPercentage * totalDuration;
        videoFrameIndex = Math.floor(newPercentage * videoFrames.length) % videoFrames.length;
        
        updateVideoFrame();
        
        if (videoProgress) videoProgress.style.width = `${newPercentage * 100}%`;
        if (videoCurrentTime) videoCurrentTime.textContent = formatTime(timeElapsed);

        if (!videoIsPlaying) {
          playSimulatedVideo();
        }
      });
    }
  }
});
