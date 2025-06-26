// Mobile menu toggle with smooth animation
document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-menu').classList.toggle('active');
});

// Optimized smooth scrolling for navigation links
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

// Enhanced Intersection Observer with better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Use requestAnimationFrame for smoother animations
            requestAnimationFrame(() => {
                entry.target.classList.add('visible');
            });
            serviceObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
    serviceObserver.observe(card);
});

// Enhanced navbar with smoother transitions
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.9)';
        navbar.style.backdropFilter = 'blur(30px) saturate(180%)';
        navbar.style.borderBottomColor = 'rgba(0, 128, 128, 0.12)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.85)';
        navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
        navbar.style.borderBottomColor = 'rgba(0, 128, 128, 0.08)';
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
}

// Use requestAnimationFrame for smooth scroll performance
function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}

window.addEventListener('scroll', handleScroll, { passive: true });

// Optimized hover effects with touch support
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    let isTouch = false;
    
    // Handle touch devices
    card.addEventListener('touchstart', () => {
        isTouch = true;
    }, { passive: true });
    
    card.addEventListener('mouseenter', function() {
        if (!isTouch) {
            this.style.transition = 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        if (!isTouch) {
            this.style.transition = 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
    });
});

// Optimize performance with debouncing
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

// Update active navigation with debouncing
const updateActiveNav = debounce(() => {
    const sections = document.querySelectorAll('section[class*="section"], section[class*="hero"]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
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

window.addEventListener('scroll', updateActiveNav, { passive: true });

// Add loading state with faster animations
document.addEventListener('DOMContentLoaded', function() {
    // Ensure smooth initial load
    document.body.classList.add('loaded');
    
    // Preload critical images
    const imagesToPreload = ['Images/tab.png', 'Images/logo.png', 'Images/background.png'];
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    }
});

// Enhanced focus management for accessibility
document.querySelectorAll('.cta-btn, .nav-menu a').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #008080';
        this.style.outlineOffset = '3px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Performance optimization for animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.transition = 'none';
        card.classList.add('visible');
    });
}

// Lazy load background image for better performance
const backgroundImage = document.querySelector('.fixed-background');
if (backgroundImage) {
    const imageLoader = new Image();
    imageLoader.onload = function() {
        backgroundImage.style.opacity = '0.8';
    };
    imageLoader.src = backgroundImage.src;
}

// Add smooth page transitions
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0';
});

// Touch gesture support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

// Optimize scroll performance with IntersectionObserver for navbar
const navbarObserver = new IntersectionObserver(
    ([e]) => {
        const navbar = document.querySelector('.navbar');
        if (!e.isIntersecting) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    },
    { threshold: [1] }
);

// Create a sentinel element for navbar observation
const sentinel = document.createElement('div');
sentinel.style.position = 'absolute';
sentinel.style.top = '100px';
sentinel.style.height = '1px';
sentinel.style.width = '1px';
document.body.appendChild(sentinel);
navbarObserver.observe(sentinel);

// Progressive enhancement for service cards
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.05}s`;
    
    // Add ripple effect on click
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 128, 128, 0.1);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .navbar.scrolled {
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style);