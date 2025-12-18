/**
 * PM Club NSUT - Main JavaScript
 * Modern interactions without boxes
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 PM Club NSUT Website Initialized');
    
    // Initialize all modules
    initNavigation();
    initSmoothScrolling();
    initScrollAnimations();
    initParallaxEffects();
    initHoverEffects();
    initFormHandling();
    initDynamicCounters();
    initCursorEffects();
    initPerformanceOptimizer();
});

/**
 * Enhanced Navigation with Smooth Transitions
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const body = document.body;
    
    // Current page highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Mobile menu with smooth animation
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = mobileMenu.classList.contains('active');
            
            // Toggle menu
            mobileMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Animate hamburger to X
            const icon = menuToggle.querySelector('i');
            if (isActive) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
            
            // Animate menu items sequentially
            const menuItems = mobileMenu.querySelectorAll('.mobile-link, .mobile-btn');
            menuItems.forEach((item, index) => {
                if (!isActive) {
                    item.style.animationDelay = `${index * 0.1}s`;
                    item.classList.add('animate-fadeIn');
                } else {
                    item.classList.remove('animate-fadeIn');
                }
            });
        });
        
        // Close menu when clicking outside or on link
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu on link click
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    
    // Navbar scroll effect with debounce
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                // Add/remove shadow based on scroll
                if (currentScroll > 10) {
                    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                    navbar.style.backdropFilter = 'blur(10px)';
                } else {
                    navbar.style.boxShadow = 'none';
                    navbar.style.backdropFilter = 'none';
                }
                
                // Hide/show navbar on scroll direction
                if (currentScroll > lastScroll && currentScroll > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Add active state to nav links on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}` || 
                        (sectionId === 'hero' && link.getAttribute('href') === 'index.html')) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
}

/**
 * Smooth Scrolling with Enhanced Physics
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Calculate position
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            // Custom easing function for smooth scroll
            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }
            
            // Animate scroll
            const startPosition = window.pageYOffset;
            const distance = offsetPosition - startPosition;
            const duration = 1000;
            let startTime = null;
            
            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const easeProgress = easeInOutCubic(progress);
                
                window.scrollTo(0, startPosition + (distance * easeProgress));
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
            
            // Update URL without page reload
            history.pushState(null, null, targetId);
        });
    });
}

/**
 * Advanced Scroll Animations with Intersection Observer
 */
function initScrollAnimations() {
    // Create intersection observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add staggered animation for children
                if (element.classList.contains('activities-grid')) {
                    const items = element.querySelectorAll('.activity-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animated');
                        }, index * 100);
                    });
                } else {
                    element.classList.add('animated');
                    
                    // Special animations for specific elements
                    if (element.classList.contains('hero-title')) {
                        element.style.animation = 'textReveal 1.5s ease forwards';
                    }
                    
                    if (element.classList.contains('about-image')) {
                        element.querySelector('img').style.animation = 'imageReveal 2s ease forwards';
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-animate
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes textReveal {
            from {
                opacity: 0;
                transform: translateY(30px);
                background-position: 200% center;
            }
            to {
                opacity: 1;
                transform: translateY(0);
                background-position: 100% center;
            }
        }
        
        @keyframes imageReveal {
            from {
                opacity: 0;
                transform: perspective(1000px) rotateY(-15deg) scale(0.9);
            }
            to {
                opacity: 1;
                transform: perspective(1000px) rotateY(0) scale(1);
            }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
            animation: fadeIn 0.5s ease forwards;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Parallax Effects with Smooth Movement
 */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    // Create parallax effect on scroll
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
    
    // Throttle the scroll event for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial update
    updateParallax();
}

/**
 * Advanced Hover Effects without Boxes
 */
function initHoverEffects() {
    // Text hover effect
    const hoverTexts = document.querySelectorAll('.hover-text');
    hoverTexts.forEach(text => {
        text.addEventListener('mouseenter', (e) => {
            const letters = text.textContent.split('');
            text.innerHTML = letters.map(letter => 
                `<span class="letter-hover">${letter}</span>`
            ).join('');
            
            const spans = text.querySelectorAll('.letter-hover');
            spans.forEach((span, i) => {
                span.style.animation = `letterFloat 0.3s ease ${i * 0.05}s`;
            });
        });
        
        text.addEventListener('mouseleave', (e) => {
            const spans = text.querySelectorAll('.letter-hover');
            spans.forEach((span, i) => {
                span.style.animation = '';
                setTimeout(() => {
                    if (text.innerHTML.includes('span')) {
                        text.innerHTML = text.textContent;
                    }
                }, 300);
            });
        });
    });
    
    // Button ripple effect
    const buttons = document.querySelectorAll('.btn-primary, .btn-hero, .btn-cta');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    function createRipple(e) {
        const button = e.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');
        
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
    }
    
    // Activity item hover with gradient line
    const activities = document.querySelectorAll('.activity-item');
    activities.forEach(activity => {
        activity.addEventListener('mouseenter', () => {
            activity.style.background = 'linear-gradient(90deg, rgba(37, 99, 235, 0.05) 0%, transparent 100%)';
            activity.style.paddingLeft = '4rem';
            
            // Animate the icon
            const icon = activity.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            }
        });
        
        activity.addEventListener('mouseleave', () => {
            activity.style.background = 'transparent';
            activity.style.paddingLeft = '3.5rem';
            
            const icon = activity.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
        });
    });
}

/**
 * Form Handling with Validation and Feedback
 */
function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>Message sent successfully! We'll get back to you soon.</span>
            `;
            
            contactForm.parentNode.insertBefore(successMsg, contactForm.nextSibling);
            
            // Remove message after 5 seconds
            setTimeout(() => {
                successMsg.style.opacity = '0';
                setTimeout(() => successMsg.remove(), 300);
            }, 5000);
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            // Show error message
            alert('Something went wrong. Please try again.');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

/**
 * Dynamic Counters for Stats
 */
function initDynamicCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

/**
 * Custom Cursor Effects (Optional)
 */
function initCursorEffects() {
    if (window.innerWidth < 768) return; // Only for desktop
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animation loop
    function animateCursor() {
        // Smooth main cursor
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        // Smooth dot cursor (faster)
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    // Start animation
    animateCursor();
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .activity-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorDot.classList.add('cursor-dot-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorDot.classList.remove('cursor-dot-hover');
        });
    });
    
    // Add cursor styles
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .custom-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--primary-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, border-color 0.3s;
            mix-blend-mode: difference;
        }
        
        .cursor-dot {
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--accent-teal);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            transition: transform 0.1s;
        }
        
        .cursor-hover {
            width: 40px;
            height: 40px;
            border-color: var(--accent-teal);
            background: rgba(13, 148, 136, 0.1);
        }
        
        .cursor-dot-hover {
            transform: translate(-50%, -50%) scale(1.5);
        }
    `;
    document.head.appendChild(cursorStyle);
}

/**
 * Performance Optimizer
 */
function initPerformanceOptimizer() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Handle resize
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        }, 250);
    });
    
    // Preload critical resources
    function preloadResources() {
        const criticalResources = [
            'css/style.css',
            'css/responsive.css',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.includes('.css') ? 'style' : 'font';
            link.href = resource;
            document.head.appendChild(link);
        });
    }
    
    // Initialize when page is fully loaded
    window.addEventListener('load', () => {
        preloadResources();
        
        // Remove loading class
        document.body.classList.add('loaded');
        
        // Log performance metrics
        if ('performance' in window) {
            const perfData = window.performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`📊 Page loaded in ${loadTime}ms`);
        }
    });
}