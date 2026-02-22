/**
 * Welfare Veterinary Clinic - Main JavaScript
 * Handles navigation, interactions, and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initLazyLoad();
    initScrollAnimations();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('nav--open');
        
        // Toggle icon
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('nav--open');
            menuToggle.setAttribute('aria-expanded', 'false');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
                
                // Update active nav link
                updateActiveNavLink(href);
            }
        });
    });
}

/**
 * Update Active Navigation Link
 */
function updateActiveNavLink(href) {
    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('nav__link--active');
        if (link.getAttribute('href') === href) {
            link.classList.add('nav__link--active');
        }
    });
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > scrollThreshold) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
            header.style.background = '#ffffff';
            header.style.backdropFilter = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Lazy Load Images with Intersection Observer
 */
function initLazyLoad() {
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.src = img.src;
        });
        return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // If using data-src
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                // If using loading lazy
                img.removeAttribute('loading');
                
                // Add loaded class for animation
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.service-card, .reel-card, .review-card, .about__feature').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(el);
    });

    // Add visible state styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .service-card { transition-delay: 0ms; }
        .service-card:nth-child(2) { transition-delay: 100ms; }
        .service-card:nth-child(3) { transition-delay: 200ms; }
        .service-card:nth-child(4) { transition-delay: 300ms; }
        .service-card:nth-child(5) { transition-delay: 400ms; }
        .service-card:nth-child(6) { transition-delay: 500ms; }
        .service-card:nth-child(7) { transition-delay: 600ms; }
        .service-card:nth-child(8) { transition-delay: 700ms; }
        .service-card:nth-child(9) { transition-delay: 800ms; }
    `;
    document.head.appendChild(style);
}

/**
 * Navbar Active State on Scroll
 */
function initNavActiveState() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
            
            if (window.pageYOffset >= sectionTop - headerHeight - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('nav__link--active');
            }
        });
    });
}

// Initialize nav active state
initNavActiveState();

/**
 * WhatsApp Click Tracking (Optional)
 */
function trackWhatsAppClicks() {
    document.querySelectorAll('a[href^="https://wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            console.log('WhatsApp click tracked');
            // Add analytics tracking here if needed
        });
    });
}

trackWhatsAppClicks();

/**
 * Emergency Button Click Handler
 */
function initEmergencyHandler() {
    const emergencyBtn = document.querySelector('.quick-action--emergency');
    
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            // Option 1: Call emergency line
            window.location.href = 'tel:+971504380030';
            
            // Option 2: Show modal (uncomment if needed)
            // showEmergencyModal();
        });
    }
}

initEmergencyHandler();

/**
 * Video Lazy Load
 */
function initVideoLazyLoad() {
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    
    if (!videoWrappers.length) return;

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target.querySelector('iframe');
                if (iframe && iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                }
                videoObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '200px 0px'
    });

    videoWrappers.forEach(wrapper => {
        videoObserver.observe(wrapper);
    });
}

initVideoLazyLoad();
