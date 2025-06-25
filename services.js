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

// Intersection Observer for service cards animation
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
    observer.observe(card);
});

// Update active navigation link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[class*="section"], section[class*="hero"]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.className.split('-')[0];
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current) || 
            (current === 'services' && link.getAttribute('href').includes('services'))) {
            link.classList.add('active');
        }
    });
});

// Smooth hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = this.classList.contains('visible') ? 'translateY(0)' : 'translateY(40px)';
    });
});

// Enhanced navbar behavior on scroll
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const navbar = document.querySelector('.navbar');
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down - add subtle transparency
        navbar.style.background = 'rgba(255, 255, 255, 0.8)';
    } else {
        // Scrolling up - restore full visibility
        navbar.style.background = 'rgba(255, 255, 255, 0.85)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
}, false);

// Add loading state for service cards
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure smooth loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Optimize performance by debouncing scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll handler
const debouncedScrollHandler = debounce(() => {
    // Update active navigation link
    const sections = document.querySelectorAll('section[class*="section"], section[class*="hero"]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.className.split('-')[0];
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current) || 
            (current === 'services' && link.getAttribute('href').includes('services'))) {
            link.classList.add('active');
        }
    });
}, 100);

// Replace the existing scroll event listener with debounced version
window.addEventListener('scroll', debouncedScrollHandler);

// Add smooth focus management for accessibility
document.querySelectorAll('.cta-btn, .nav-menu a').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #008080';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    }
});

// Preload critical images for better performance
function preloadImages() {
    const imagesToPreload = [
        'Images/tab.png',
        'Images/logo.png'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading when DOM is ready
document.addEventListener('DOMContentLoaded', preloadImages);

// Add animation observer for performance optimization
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        } else {
            entry.target.style.animationPlayState = 'paused';
        }
    });
}, {
    threshold: 0.1
});

// Observe elements with animations
document.querySelectorAll('.service-card, .cta-section').forEach(element => {
    animationObserver.observe(element);
});

// Add touch support for mobile devices
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiping up - could add specific functionality here
        } else {
            // Swiping down - could add specific functionality here
        }
    }
}

// Optimize scroll performance with requestAnimationFrame
let ticking = false;

function updateScrollEffects() {
    const scrollTop = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    
    // Update navbar transparency based on scroll position
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.8)';
        navbar.style.borderBottomColor = 'rgba(0, 128, 128, 0.12)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.85)';
        navbar.style.borderBottomColor = 'rgba(0, 128, 128, 0.08)';
    }
    
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}, { passive: true });