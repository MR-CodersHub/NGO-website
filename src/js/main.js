/**
 * Jeevan Foundation - Main JavaScript
 * Animation & Interaction Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initRippleEffects();
    setActiveNavLink();

    // Global Event Listeners for Nav
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        window.toggleProfileDropdown = (e) => {
            if (e) e.stopPropagation();
            const dropdown = document.getElementById('profileDropdown');
            if (dropdown) {
                const isOpen = dropdown.classList.toggle('open');
                profileBtn.setAttribute('aria-expanded', isOpen);
            }
        };
    }

    const mobMenu = document.getElementById('mobMenu');
    window.toggleMenu = () => {
        if (mobMenu) {
            const isOpen = mobMenu.classList.toggle('open');
            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        }
    };

    // Close mobile menu when a link is clicked
    const mobMenuLinks = document.querySelectorAll('.mob-menu a');
    mobMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            const mobMenu = document.getElementById('mobMenu');
            if (mobMenu && mobMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    window.onclick = function () {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown && dropdown.classList.contains('open')) {
            dropdown.classList.remove('open');
            if (profileBtn) profileBtn.setAttribute('aria-expanded', 'false');
        }
    };
});

/**
 * Set Active Nav Link based on current URL
 */
function setActiveNavLink() {
    // Standardize current path (strip query params and hashes)
    const path = window.location.pathname;
    const page = path.split('/').pop().split('?')[0].split('#')[0] || 'index.html';

    // Select both desktop and mobile links
    const navLinks = document.querySelectorAll('.nav-links a, .mob-menu a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Strip query params and hashes from href for accurate matching
        const linkPath = href.split('/').pop().split('?')[0].split('#')[0];

        // Match current page or handle root/index
        const isIndex = (page === 'index.html' || page === '');
        const isLinkIndex = (linkPath === 'index.html' || linkPath === '');

        const isActive = (linkPath === page) || (isIndex && isLinkIndex);

        if (isActive) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

/**
 * Initialize Scroll Animations
 * Adds fade-in-up animation to elements as they enter the viewport
 */
function initScrollAnimations() {
    // Elements to animate
    const selectors = [
        '.card',
        '.portrait',
        '.stat-card',
        '.hero h1',
        '.hero p',
        '.hero .badge',
        '.hero .btn-group',
        '.hero .btn',
        '.section-header',
        '.sec h2',
        '.sec .badge',
        // Grid items
        '.g2 > *',
        '.g3 > *',
        '.g4 > *',
        '.gallery-item',
        // Footer columns
        '.footer-grid > *'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));

    // Intersection Observer Options
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px' // Offset slightly so it triggers before bottom
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                if (!target) return;

                // Add staggered delay for grid items
                // Check if parent is a grid container
                const parent = target.parentElement;
                if (parent && (parent.classList.contains('g2') || parent.classList.contains('g3') || parent.classList.contains('g4') || parent.classList.contains('footer-grid'))) {
                    const children = Array.from(parent.children);
                    const index = children.indexOf(target);
                    // Add delay (max 500ms to allow scrolling past)
                    const delay = Math.min(index * 150, 600);
                    target.style.animationDelay = `${delay}ms`;
                }

                target.classList.add('fade-in-up');
                target.classList.remove('animate-on-scroll');
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    elements.forEach(el => {
        // Ensure we don't double-animate or hide things that shouldn't be hidden
        if (!el.classList.contains('fade-in-up')) {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        }
    });

    // Special case for stats numbers - animate counting
    initStatCounters();
}

/**
 * Animate numbers counting up
 */
function initStatCounters() {
    const stats = document.querySelectorAll('.stat-num');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); // Wait until 50% visible

    stats.forEach(stat => observer.observe(stat));
}

function animateValue(obj) {
    const rawValue = obj.textContent;
    // Extract number and suffix (e.g. "2.5M" -> 2.5, "M" or "1,200+" -> 1200, "+")
    // Remove commas for parsing but keep format concept
    const cleanValue = rawValue.replace(/,/g, '');
    const match = cleanValue.match(/([\d\.]+)(.*)/);

    if (!match) return;

    const end = parseFloat(match[1]);
    const suffix = match[2];
    const duration = 2500; // 2.5 seconds for premium feel
    const startTimestamp = performance.now();

    // Check if original had commas
    const hadCommas = rawValue.includes(',');

    // For float numbers
    const isFloat = end % 1 !== 0 || rawValue.includes('.');
    const decimalPlaces = (end.toString().split('.')[1] || []).length;

    function step(timestamp) {
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Easing function: easeOutExpo
        // 1 - Math.pow(2, -10 * progress)
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        const current = easeProgress * end;

        let displayValue;
        if (isFloat) {
            displayValue = current.toFixed(decimalPlaces);
        } else {
            displayValue = Math.floor(current);
        }

        // Add commas back if needed
        if (hadCommas || (!isFloat && end >= 1000)) {
            displayValue = displayValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        obj.textContent = displayValue + suffix;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Ensure final value is exactly what was there (to fix any rounding errors)
            obj.textContent = rawValue;
        }
    }

    window.requestAnimationFrame(step);
}

/**
 * Ripple Effect for Buttons
 */
function initRippleEffects() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');

            // Add style for ripple if not in CSS
            if (!document.getElementById('ripple-style')) {
                const style = document.createElement('style');
                style.id = 'ripple-style';
                style.innerHTML = `
                    .ripple-effect {
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.4);
                        transform: scale(0);
                        animation: ripple 0.6s linear;
                        pointer-events: none;
                    }
                    @keyframes ripple {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                    .btn {
                        position: relative;
                        overflow: hidden;
                    }
                `;
                document.head.appendChild(style);
            }

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}
