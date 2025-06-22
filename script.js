let animationRunning = false;

function getParticleCount() {
    // Reduce particle count on mobile for better performance
    if (window.innerWidth <= 480) return 100;
    if (window.innerWidth <= 768) return 150;
    return 200;
}

function getParticleSize() {
    // Scale particle size based on screen size
    const baseSize = window.innerWidth <= 480 ? 0.8 : 1;
    return baseSize;
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const types = ['black', 'gray', 'cyan'];
    const weights = [0.4, 0.4, 0.2];
    let random = Math.random();
    let type;

    if (random < weights[0]) type = types[0];
    else if (random < weights[0] + weights[1]) type = types[1];
    else type = types[2];

    particle.classList.add(type);

    const sizeMultiplier = getParticleSize();
    const size = type === 'cyan' ?
        (Math.random() * 3 + 1.5) * sizeMultiplier :
        (Math.random() * 6 + 2) * sizeMultiplier;

    particle.style.width = 3 * size + 'px';
    particle.style.height = 3 * size + 'px';

    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';

    return particle;
}

function animateParticles() {
    const particles = [];
    const particleCount = getParticleCount();

    for (let i = 0; i < particleCount; i++) {
        const particle = createParticle();
        particles.push(particle);
        document.body.appendChild(particle);

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

        // Adjust convergence area based on screen size
        const convergenceSize = window.innerWidth <= 480 ? 100 :
                              window.innerWidth <= 768 ? 150 : 192;

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

                logoContainer.style.opacity = '1';
                logoContainer.style.transform = 'scale(1)';

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
                    }, 300);
                }, 1200);

                setTimeout(() => {
                    particles.forEach(particle => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    });
                    animationRunning = false;
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

    logoContainer.style.opacity = '0';
    logoContainer.style.transform = 'scale(0.7)';

    svg.style.opacity = '0';
    svg.style.transform = 'scale(0.9)';

    ringPaths.forEach(ring => {
        ring.style.opacity = '0';
    });

    mainText.style.opacity = '0';
    mainText.style.transform = 'translateY(' + (window.innerWidth <= 480 ? '20px' : '72px') + ')';

    subText.style.opacity = '0';
    subText.style.transform = 'translateY(' + (window.innerWidth <= 480 ? '20px' : '72px') + ')';
}

function restartAnimation() {
    if (animationRunning) return;

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

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (!animationRunning) {
            resetLogo();
        }
    }, 500);
});

// Handle resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (!animationRunning) {
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

window.addEventListener('load', () => {
    setTimeout(() => {
        restartAnimation();
    }, 500);
});