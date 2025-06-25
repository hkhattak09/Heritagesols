let animationRunning = false;
let animationCompleted = false;

function getParticleCount() {
    if (window.innerWidth <= 480) return 100;
    if (window.innerWidth <= 768) return 150;
    return 200;
}

function getParticleSize() {
    const baseSize = window.innerWidth <= 480 ? 0.8 : 1;
    return baseSize;
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const types = ['black', 'gray', 'cyan'];
    const weights = [0.4, 0.4, 0.4];
    let random = Math.random();
    let type;

    if (random < weights[0]) type = types[0];
    else if (random < weights[0] + weights[1]) type = types[1];
    else type = types[2];

    particle.classList.add(type);

    const sizeMultiplier = getParticleSize();
    const size = (Math.random() * 6 + 2) * sizeMultiplier;

    particle.style.width = 3 * size + 'px';
    particle.style.height = 3 * size + 'px';

    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';

    return particle;
}

function setFixedBackground() {
    const fixedBackground = document.getElementById('fixedBackground');
    if (fixedBackground) {
        fixedBackground.style.opacity = '0.8';
    }
}

function animateParticles() {
    const particles = [];
    const particleCount = getParticleCount();
    const animationContainer = document.querySelector('.animation-container');
    const backgroundImage = document.querySelector('.background-image');

    for (let i = 0; i < particleCount; i++) {
        const particle = createParticle();
        particles.push(particle);
        animationContainer.appendChild(particle);

        setTimeout(() => {
            particle.style.opacity = '1';
            particle.style.transition = 'opacity 0.6s ease';
        }, Math.random() * 600);
    }

    setTimeout(() => {
        const logoContainer = document.querySelector('.logo-container');
        const logoRect = logoContainer.getBoundingClientRect();

        const targetX = logoRect.left + logoRect.width / 4;
        const targetY = logoRect.top + logoRect.height / 2;

        const convergenceSize = window.innerWidth <= 480 ? 100 :
                              window.innerWidth <= 768 ? 150 : 192;

        backgroundImage.style.opacity = '0.8';
        setFixedBackground(); // Set the fixed background

        particles.forEach((particle) => {
            particle.style.transition = 'all 1.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            particle.style.left = (targetX + (Math.random() - 0.5) * convergenceSize) + 'px';
            particle.style.top = (targetY + (Math.random() - 0.5) * convergenceSize) + 'px';
            particle.style.transform = 'scale(0.2)';
        });

        setTimeout(() => {
            particles.forEach(particle => {
                particle.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                particle.style.opacity = '0';
                particle.style.transform = 'scale(0)';
            });

            setTimeout(() => {
                const logoContainer = document.querySelector('.logo-container');
                const svg = document.querySelector('.logo-icon svg');
                const ringPaths = document.querySelectorAll('.ring-path');
                const mainText = document.querySelector('.main-text');
                const subText = document.querySelector('.sub-text');
                const learnMoreBtn = document.querySelector('.learn-more-btn');
                const navbar = document.querySelector('.navbar'); 

                logoContainer.style.opacity = '1';
                logoContainer.style.transform = logoContainer.style.transform.replace(/scale\([^)]*\)/, 'scale(1)');

                svg.style.opacity = '1';
                svg.style.transform = 'scale(1)';

                ringPaths.forEach((ring, index) => {
                    setTimeout(() => {
                        ring.style.opacity = '1';
                    }, 200 + (index * 250));
                });

                setTimeout(() => {
                    mainText.style.opacity = '1';
                    mainText.style.transform = 'translateY(0)';

                    setTimeout(() => {
                        subText.style.opacity = '1';
                        subText.style.transform = 'translateY(0)';
                        
                        setTimeout(() => {
                            learnMoreBtn.classList.add('visible');
                            navbar.classList.add('visible');
                        }, 500);
                    }, 300);
                }, 1200);

                setTimeout(() => {
                    particles.forEach(particle => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    });
                    animationRunning = false;
                    animationCompleted = true;
                }, 2500);
            }, 600);
        }, 1800);
    }, 800);
}

function resetLogo() {
    const logoContainer = document.querySelector('.logo-container');
    const svg = document.querySelector('.logo-icon svg');
    const ringPaths = document.querySelectorAll('.ring-path');
    const mainText = document.querySelector('.main-text');
    const subText = document.querySelector('.sub-text');
    const backgroundImage = document.querySelector('.background-image');
    const learnMoreBtn = document.querySelector('.learn-more-btn');

    backgroundImage.style.opacity = '0';
    logoContainer.style.opacity = '0';

    const style = getComputedStyle(logoContainer);
    const matrix = new DOMMatrix(style.transform);
    const newTransform = matrix.translate(0, 0).scale(0.7 / matrix.a, 0.7 / matrix.d);
    const currentTransform = getComputedStyle(logoContainer).transform;
    if (currentTransform.includes('translate')) {
         logoContainer.style.transform = logoContainer.style.transform.replace(/scale\([^)]*\)/, 'scale(0.7)');
    } else {
        logoContainer.style.transform = 'scale(0.7) translate(-50%, -50%)';
    }

    svg.style.opacity = '0';
    svg.style.transform = 'scale(0.9)';

    ringPaths.forEach(ring => {
        ring.style.opacity = '0';
    });

    mainText.style.opacity = '0';
    mainText.style.transform = 'translateY(clamp(20px, 4vw, 72px))';

    subText.style.opacity = '0';
    subText.style.transform = 'translateY(clamp(20px, 4vw, 72px))';
    
    learnMoreBtn.classList.remove('visible');
}

function startAnimation() {
    if (animationRunning || animationCompleted) return;

    animationRunning = true;

    const existingParticles = document.querySelectorAll('.particle');
    existingParticles.forEach(particle => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    });

    resetLogo();

    setTimeout(() => {
        animateParticles();
    }, 100);
}

// Enhanced Image Loading System with Background Queue and Caching
class ImageLoader {
    constructor() {
        this.loadedImages = new Set();
        this.imageQueue = [];
        this.isLoading = false;
        this.preloadCount = 3; // Number of images to preload immediately
        this.cache = new Map(); // In-memory cache for loaded images
        this.cacheKey = 'hbs_image_cache_v1';
        this.maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        // Initialize cache from localStorage
        this.initializeCache();
    }

    // Initialize cache from localStorage
    initializeCache() {
        try {
            const cachedData = localStorage.getItem(this.cacheKey);
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                const now = Date.now();
                
                // Filter out expired entries
                Object.entries(parsed).forEach(([url, data]) => {
                    if (now - data.timestamp < this.maxCacheAge) {
                        this.cache.set(url, data);
                    }
                });
            }
        } catch (error) {
            console.warn('Failed to load image cache:', error);
            localStorage.removeItem(this.cacheKey);
        }
    }

    // Save cache to localStorage
    saveCache() {
        try {
            const cacheObj = {};
            this.cache.forEach((value, key) => {
                cacheObj[key] = value;
            });
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheObj));
        } catch (error) {
            console.warn('Failed to save image cache:', error);
        }
    }

    // Check if image is cached
    isCached(url) {
        const cached = this.cache.get(url);
        if (cached) {
            const now = Date.now();
            if (now - cached.timestamp < this.maxCacheAge) {
                return true;
            } else {
                this.cache.delete(url);
                return false;
            }
        }
        return false;
    }

    // Add image to cache
    addToCache(url, success = true) {
        this.cache.set(url, {
            url: url,
            success: success,
            timestamp: Date.now()
        });
        this.saveCache();
    }

    // Initialize the image loading system
    init() {
        this.addLoadingCSS();
        this.queueAllImages();
        this.setupProgressiveLoading();
    }

    // Add CSS for loading states
    addLoadingCSS() {
        const loadingCSS = `
        .loading-spinner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            z-index: 5;
            transition: opacity 0.3s ease;
        }

        .spinner-circle {
            width: 30px;
            height: 30px;
            border: 3px solid rgba(0, 128, 128, 0.1);
            border-left: 3px solid #008080;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .loading-text {
            font-size: 0.9rem;
            color: #666;
            font-weight: 500;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Skeleton loading effect for images */
        .client-card img[data-src] {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading-shimmer 1.5s infinite;
        }

        @keyframes loading-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        /* Cache indicator */
        .cached-indicator {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 8px;
            height: 8px;
            background: #28a745;
            border-radius: 50%;
            opacity: 0.7;
            z-index: 10;
        }
        `;

        const style = document.createElement('style');
        style.textContent = loadingCSS;
        document.head.appendChild(style);
    }

    // Queue all images for background loading (no lazy loading)
    queueAllImages() {
        const clientCards = document.querySelectorAll('.client-card');
        const cardsPerView = this.getCardsPerView();
        
        // Load images for initially visible cards immediately
        for (let i = 0; i < Math.min(cardsPerView, clientCards.length); i++) {
            const img = clientCards[i].querySelector('img[data-src]');
            if (img) {
                this.loadImage(img, true); // High priority
            }
        }

        // Queue ALL remaining images for background loading
        for (let i = cardsPerView; i < clientCards.length; i++) {
            const img = clientCards[i].querySelector('img[data-src]');
            if (img) {
                this.imageQueue.push(img);
            }
        }
    }

    // Progressive loading of queued images
    setupProgressiveLoading() {
        // Start loading all queued images after initial page load
        setTimeout(() => {
            this.processImageQueue();
        }, 500); // Reduced delay for faster background loading

        // Load more images when user interacts with carousel
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.prioritizeUpcomingImages();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prioritizeUpcomingImages();
            });
        }
    }

    // Load an individual image
    loadImage(img, highPriority = false) {
        if (this.loadedImages.has(img)) return;

        const src = img.dataset.src;
        if (!src) return;

        // Check if image is cached and show indicator
        if (this.isCached(src)) {
            this.addCacheIndicator(img);
        }

        // Show loading state
        this.showLoadingState(img);

        // Create a new image object for preloading
        const imageObj = new Image();
        
        imageObj.onload = () => {
            this.onImageLoad(img, src);
            this.addToCache(src, true);
        };
        
        imageObj.onerror = () => {
            this.onImageError(img);
            this.addToCache(src, false);
        };

        // Set loading priority
        if (highPriority && 'loading' in imageObj) {
            imageObj.loading = 'eager';
        }

        imageObj.src = src;
        this.loadedImages.add(img);
    }

    // Add cache indicator
    addCacheIndicator(img) {
        const clientCard = img.closest('.client-card');
        if (clientCard && !clientCard.querySelector('.cached-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'cached-indicator';
            indicator.title = 'Cached image';
            clientCard.appendChild(indicator);
        }
    }

    // Handle successful image load
    onImageLoad(img, src) {
        img.src = src;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // Fade in the image
        requestAnimationFrame(() => {
            img.style.opacity = '1';
        });

        this.hideLoadingState(img);
        img.removeAttribute('data-src');
    }

    // Handle image load error
    onImageError(img) {
        console.warn('Failed to load image:', img.dataset.src);
        this.hideLoadingState(img);
        
        // Show fallback content
        const clientCard = img.closest('.client-card');
        if (clientCard) {
            const clientName = clientCard.querySelector('.client-name');
            if (clientName) {
                img.style.display = 'none';
                clientCard.innerHTML = `<div class="client-placeholder">${clientName.textContent}</div>`;
            }
        }
    }

    // Show loading state
    showLoadingState(img) {
        const clientCard = img.closest('.client-card');
        if (clientCard && !clientCard.querySelector('.loading-spinner')) {
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            spinner.innerHTML = `
                <div class="spinner-circle"></div>
                <div class="loading-text">Loading...</div>
            `;
            clientCard.appendChild(spinner);
        }
    }

    // Hide loading state
    hideLoadingState(img) {
        const clientCard = img.closest('.client-card');
        const spinner = clientCard?.querySelector('.loading-spinner');
        if (spinner) {
            spinner.style.opacity = '0';
            setTimeout(() => {
                spinner.remove();
            }, 300);
        }
    }

    // Process the entire image queue in the background
    async processImageQueue() {
        if (this.isLoading || this.imageQueue.length === 0) return;
        
        this.isLoading = true;
        console.log(`Starting background loading of ${this.imageQueue.length} images...`);
        
        // Load images in small batches to avoid overwhelming the browser
        const batchSize = 3; // Increased batch size
        const batchDelay = 100; // Reduced delay for faster loading
        
        while (this.imageQueue.length > 0) {
            const batch = this.imageQueue.splice(0, batchSize);
            
            // Load batch concurrently
            const promises = batch.map(img => new Promise(resolve => {
                this.loadImage(img);
                setTimeout(resolve, 50); // Small delay between individual images
            }));
            
            await Promise.all(promises);
            
            // Allow other tasks to run
            await new Promise(resolve => setTimeout(resolve, batchDelay));
        }
        
        this.isLoading = false;
        console.log('Background image loading completed!');
    }

    // Prioritize upcoming images when user navigates
    prioritizeUpcomingImages() {
        const carousel = document.querySelector('.clients-carousel');
        if (!carousel) return;
        
        const currentSlide = parseInt(carousel.dataset.currentSlide || '0');
        const cardsPerView = this.getCardsPerView();
        
        // Load images for next slide with high priority
        const nextSlideStart = (currentSlide + 1) * cardsPerView;
        const nextSlideEnd = nextSlideStart + cardsPerView;
        
        const clientCards = document.querySelectorAll('.client-card');
        for (let i = nextSlideStart; i < Math.min(nextSlideEnd, clientCards.length); i++) {
            const img = clientCards[i]?.querySelector('img[data-src]');
            if (img) {
                this.loadImage(img, true); // High priority
            }
        }
    }

    // Get number of cards per view
    getCardsPerView() {
        const width = window.innerWidth;
        if (width <= 480) return 1;
        if (width <= 768) return 2;
        return 3;
    }

    // Get cache statistics
    getCacheStats() {
        const totalCached = this.cache.size;
        const successfulCached = Array.from(this.cache.values()).filter(item => item.success).length;
        return {
            total: totalCached,
            successful: successfulCached,
            failed: totalCached - successfulCached
        };
    }

    // Clear old cache entries
    clearOldCache() {
        const now = Date.now();
        let cleared = 0;
        
        this.cache.forEach((value, key) => {
            if (now - value.timestamp >= this.maxCacheAge) {
                this.cache.delete(key);
                cleared++;
            }
        });
        
        if (cleared > 0) {
            this.saveCache();
            console.log(`Cleared ${cleared} expired cache entries`);
        }
    }
}

// Mobile menu toggle
document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-menu').classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for content animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe content blocks
document.querySelectorAll('.content-block, .mission-vision .block, .section-title-container, .clients-carousel, .testimonial-card').forEach(block => {
    observer.observe(block);
});

// Enhanced Carousel Logic with Image Loading Integration
const carousel = document.querySelector('.clients-carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentSlide = 0;
let totalCards = 0;
let imageLoader;

function getCardsPerView() {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 2;
    return 3;
}

function getCardWidth() {
    const containerWidth = carousel.parentElement.offsetWidth;
    const cardsPerView = getCardsPerView();
    const totalGap = 30 * (cardsPerView - 1);
    return (containerWidth - totalGap) / cardsPerView;
}

function updateCarouselLayout() {
    if (!carousel) return;
    
    const cardsPerView = getCardsPerView();
    totalCards = carousel.querySelectorAll('.client-card').length;
    const totalSlides = Math.ceil(totalCards / cardsPerView);
    
    const indicatorContainer = document.querySelector('.carousel-indicators');
    if (indicatorContainer) {
        indicatorContainer.innerHTML = ''; 
        if (totalSlides > 1) {
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                indicator.dataset.slide = i;
                indicator.addEventListener('click', () => {
                    currentSlide = i;
                    updateCarousel();
                });
                indicatorContainer.appendChild(indicator);
            }
        }
    }
}

function updateCarousel() {
    if (!carousel) return;
    
    const cardWidth = getCardWidth();
    const cardsPerView = getCardsPerView();
    const scrollPosition = currentSlide * (cardWidth + 30) * cardsPerView;
    
    carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });

    // Store current slide for image loader
    carousel.dataset.currentSlide = currentSlide;
    
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });

    // Trigger image loading for upcoming slides
    if (imageLoader) {
        imageLoader.prioritizeUpcomingImages();
    }
}

function nextSlide() {
    const cardsPerView = getCardsPerView();
    const totalSlides = Math.ceil(totalCards / cardsPerView);
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    const cardsPerView = getCardsPerView();
    const totalSlides = Math.ceil(totalCards / cardsPerView);
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (prevBtn) prevBtn.addEventListener('click', prevSlide);

// Touch support for carousel
let startX = null;
if (carousel) {
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e) => {
        if (!startX) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        startX = null;
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        currentSlide = 0; 
        updateCarouselLayout(); 
        updateCarousel(); 
    }, 250);
});

// Initialize carousel after DOM load
setTimeout(() => {
    updateCarouselLayout();
    updateCarousel();
}, 100);

// Simple intersection observer for achievements (no counter animation)
const achievementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('achievement-card')) {
            entry.target.classList.add('visible');
            achievementObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.achievement-card').forEach(card => {
    achievementObserver.observe(card);
});

// Intersection observer for the CEC section
const cecSection = document.querySelector('.cec-section');
if (cecSection) {
    const cecObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    cecObserver.observe(cecSection);
}

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (!animationRunning && !animationCompleted) {
            resetLogo();
        }
    }, 500);
});

// Handle resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (!animationRunning && !animationCompleted) {
            resetLogo();
        }
    }, 250);
});

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Update active navigation link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize image loader
    imageLoader = new ImageLoader();
    imageLoader.init();
    
    // Update total cards count for carousel
    totalCards = document.querySelectorAll('.client-card').length;
    
    // Clear old cache entries on page load
    imageLoader.clearOldCache();
    
    // Log cache statistics
    const cacheStats = imageLoader.getCacheStats();
    console.log(`Image Cache Stats - Total: ${cacheStats.total}, Successful: ${cacheStats.successful}, Failed: ${cacheStats.failed}`);
});

// Start animation on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        startAnimation();
    }, 500);
});