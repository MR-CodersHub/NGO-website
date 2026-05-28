/**
 * JEEVAN FOUNDATION - COMPONENT JAVASCRIPT
 * Interactive functionality for UI components
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Jeevan Foundation Components Initialized');

    // Initialize all component features
    // initNavbar();
    // initMobileMenu();
    initScrollAnimations();
    initProgressBars();

    console.log('✅ All components loaded successfully');
});

/**
 * Sticky Navbar with Scroll Behavior
 * Changes from transparent to solid background on scroll
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add 'scrolled' class when scrolled past threshold
        if (currentScroll > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    console.log('📍 Navbar scroll behavior initialized');
}

/**
 * Mobile Menu Toggle
 * Handles hamburger menu for responsive navigation
 */
function initMobileMenu() {
    const toggle = document.getElementById('navbarToggle');
    const menu = document.getElementById('navbarMenu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');

        // Animate hamburger icon
        const spans = toggle.querySelectorAll('span');
        if (menu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking on a link
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.classList.remove('active');

            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    console.log('📱 Mobile menu initialized');
}

/**
 * Scroll-triggered Animations
 * Uses Intersection Observer for performance
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class if not already present
                const element = entry.target;
                const classes = element.className.split(' ');

                // Check if element has fade-in or slide-in classes
                const hasAnimation = classes.some(cls =>
                    cls.includes('fade-in') || cls.includes('slide-in')
                );

                if (hasAnimation) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }

                // Unobserve after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.fade-in-up, .fade-in-up-delay-1, .fade-in-up-delay-2, .fade-in-up-delay-3, ' +
        '.slide-in-left, .slide-in-right, .hover-lift'
    );

    animatedElements.forEach(el => observer.observe(el));

    console.log(`🎬 Observing ${animatedElements.length} animated elements`);
}

/**
 * Animate Progress Bars
 * Animates campaign progress bars when they come into view
 */
function initProgressBars() {
    const progressBars = document.querySelectorAll('.campaign-progress-bar');

    if (progressBars.length === 0) return;

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;

                // Reset and animate
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);

                observer.unobserve(bar);
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => observer.observe(bar));

    console.log(`📊 ${progressBars.length} progress bars initialized`);
}

/**
 * Smooth Scroll for Anchor Links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if href is just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();

            const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Add Ripple Effect to Buttons
 * Creates a ripple animation on button click
 */
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        // Don't add ripple if it's a link that navigates
        if (this.tagName === 'A' && this.getAttribute('href') !== '#') {
            return;
        }

        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

/**
 * Counter Animation for Impact Stats
 * Animates numbers counting up when they come into view
 */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Initialize counter animations
const statNumbers = document.querySelectorAll('.impact-stat-number');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const text = element.textContent.trim();

            // Extract number from text (e.g., "10K+" -> 10000)
            let target = parseInt(text.replace(/[^0-9]/g, ''));
            if (text.includes('K')) target *= 1000;
            if (text.includes('M')) target *= 1000000;

            animateCounter(element, target);
            statObserver.unobserve(element);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statObserver.observe(stat));

/**
 * Parallax Effect for Hero Section
 */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.gradient-overlay');

    parallaxElements.forEach(element => {
        if (element.style.backgroundImage) {
            element.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });
});

/**
 * Lazy Load Images
 * Improves performance by loading images as they come into view
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log('🚀 All interactive features loaded');
