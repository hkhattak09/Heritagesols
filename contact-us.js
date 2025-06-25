// Contact Us Page JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page functionality
    initializeNavigation();
    initializeInteractiveEffects();
    initializeAccessibility();
    
    console.log('Contact Us page loaded successfully');
});

// Navigation functionality
function initializeNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Mobile menu toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Add animation to hamburger menu
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on navigation links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && mobileMenuToggle) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu) {
            navMenu.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
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
}

// Interactive effects for contact items
function initializeInteractiveEffects() {
    const contactItems = document.querySelectorAll('.contact-item');
    const hourItems = document.querySelectorAll('.hour-item');
    const ctaButtons = document.querySelectorAll('.cta-btn');
    
    // Enhanced hover effects for contact items
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 128, 128, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '';
        });
        
        // Add click effect for mobile
        item.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        item.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Hover effects for business hours
    hourItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Enhanced button effects
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-1px) scale(1.01)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
    });
}

// Accessibility enhancements
function initializeAccessibility() {
    // Add focus management for keyboard navigation
    const focusableElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #008080';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Add aria-labels for better screen reader support
    const contactLinks = document.querySelectorAll('.contact-details a');
    contactLinks.forEach(link => {
        if (link.href.startsWith('tel:')) {
            link.setAttribute('aria-label', `Call ${link.textContent}`);
        } else if (link.href.startsWith('mailto:')) {
            link.setAttribute('aria-label', `Send email to ${link.textContent}`);
        }
    });
}

// Map interaction enhancements
function initializeMapFeatures() {
    const mapEmbed = document.querySelector('.map-embed');
    const mapContainer = document.querySelector('.map-container');
    
    if (mapEmbed && mapContainer) {
        // Add loading state
        mapEmbed.addEventListener('load', function() {
            console.log('Map loaded successfully');
        });
        
        // Add click to focus functionality
        mapContainer.addEventListener('click', function() {
            mapEmbed.focus();
        });
        
        // Prevent scroll wheel from zooming map accidentally
        mapEmbed.addEventListener('wheel', function(e) {
            if (!this.classList.contains('map-active')) {
                e.preventDefault();
            }
        });
        
        // Enable scroll when clicked
        mapEmbed.addEventListener('click', function() {
            this.classList.add('map-active');
        });
        
        // Disable scroll when mouse leaves
        mapEmbed.addEventListener('mouseleave', function() {
            this.classList.remove('map-active');
        });
    }
}

// Scroll-based animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for contact items
                if (entry.target.classList.contains('contact-info')) {
                    const contactItems = entry.target.querySelectorAll('.contact-item');
                    contactItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    const sectionsToObserve = document.querySelectorAll(
        '.contact-info, .map-container, .cta-section'
    );
    
    sectionsToObserve.forEach(section => {
        observer.observe(section);
    });
}

// Performance optimizations
function initializePerformanceOptimizations() {
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Handle responsive adjustments
            handleResponsiveAdjustments();
        }, 250);
    });
    
    // Preload critical images
    preloadCriticalImages();
    
    // Lazy load non-critical content
    lazyLoadContent();
}

// Handle responsive layout adjustments
function handleResponsiveAdjustments() {
    const contactContainer = document.querySelector('.contact-container');
    const mapEmbed = document.querySelector('.map-embed');
    
    if (window.innerWidth <= 768) {
        // Mobile adjustments
        if (mapEmbed) {
            mapEmbed.style.height = '300px';
        }
    } else {
        // Desktop adjustments
        if (mapEmbed) {
            mapEmbed.style.height = '400px';
        }
    }
}

// Preload critical images
function preloadCriticalImages() {
    const imagesToPreload = [
        'Images/logo.png',
        'Images/tab.png'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Lazy load content
function lazyLoadContent() {
    // Intersection Observer for lazy loading
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Load content when visible
                if (entry.target.classList.contains('map-embed')) {
                    // Map is already loaded via iframe, but we can optimize it
                    entry.target.style.opacity = '1';
                }
                lazyObserver.unobserve(entry.target);
            }
        });
    });
    
    // Observe elements for lazy loading
    const lazyElements = document.querySelectorAll('.map-embed');
    lazyElements.forEach(element => {
        lazyObserver.observe(element);
    });
}

// Contact form utilities (for future implementation)
function initializeContactFormUtils() {
    // Phone number formatting
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track phone call analytics if needed
            console.log('Phone call initiated:', this.href);
        });
    });
    
    // Email link tracking
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track email analytics if needed
            console.log('Email initiated:', this.href);
        });
    });
}

// Error handling and fallbacks
function initializeErrorHandling() {
    // Handle map loading errors
    const mapEmbed = document.querySelector('.map-embed');
    if (mapEmbed) {
        mapEmbed.addEventListener('error', function() {
            console.warn('Map failed to load');
            const fallbackMessage = document.createElement('div');
            fallbackMessage.className = 'map-fallback';
            fallbackMessage.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 400px;
                    background: #f8f9fa;
                    border-radius: 15px;
                    flex-direction: column;
                    text-align: center;
                ">
                    <h3 style="color: #008080; margin-bottom: 10px;">Map Unavailable</h3>
                    <p style="color: #666;">Please visit us at:<br>
                    First Floor, 270 Y Block, DHA Phase 3, Lahore, Pakistan</p>
                </div>
            `;
            this.parentNode.replaceChild(fallbackMessage, this);
        });
    }
}

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeInteractiveEffects();
    initializeAccessibility();
    initializeMapFeatures();
    initializeScrollAnimations();
    initializePerformanceOptimizations();
    initializeContactFormUtils();
    initializeErrorHandling();
    
    console.log('Contact Us page fully initialized');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden - pausing non-essential animations');
    } else {
        console.log('Page visible - resuming animations');
    }
});

// Export functions for testing purposes (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeInteractiveEffects,
        initializeAccessibility,
        handleResponsiveAdjustments
    };
}