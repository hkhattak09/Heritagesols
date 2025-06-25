// Minimal JavaScript - Only essentials

// Mobile menu
document.querySelector('.mobile-menu-toggle').onclick = function() {
    document.querySelector('.nav-menu').classList.toggle('active');
};

// Close menu on escape
document.onkeydown = function(e) {
    if (e.key === 'Escape') {
        document.querySelector('.nav-menu').classList.remove('active');
    }
};