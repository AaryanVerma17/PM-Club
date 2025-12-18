/**
 * Mobile Menu - Enhanced Version
 * With smooth animations and accessibility
 */

class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.body = document.body;
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.menuToggle || !this.mobileMenu) return;
        
        // Add ARIA attributes for accessibility
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menuToggle.setAttribute('aria-label', 'Open menu');
        this.mobileMenu.setAttribute('aria-hidden', 'true');
        
        // Event listeners
        this.menuToggle.addEventListener('click', (e) => this.toggleMenu(e));
        this.mobileMenu.addEventListener('click', (e) => this.handleMenuClick(e));
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.menuToggle.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.mobileMenu.classList.add('active');
        this.menuToggle.classList.add('active');
        this.body.classList.add('menu-open');
        
        // Update ARIA attributes
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.menuToggle.setAttribute('aria-label', 'Close menu');
        this.mobileMenu.setAttribute('aria-hidden', 'false');
        
        // Animate hamburger icon
        this.animateHamburger(true);
        
        // Animate menu items with stagger
        this.animateMenuItems(true);
        
        // Trap focus inside menu
        this.trapFocus(true);
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('menuOpen'));
    }
    
    closeMenu() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.mobileMenu.classList.remove('active');
        this.menuToggle.classList.remove('active');
        this.body.classList.remove('menu-open');
        
        // Update ARIA attributes
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menuToggle.setAttribute('aria-label', 'Open menu');
        this.mobileMenu.setAttribute('aria-hidden', 'true');
        
        // Animate hamburger icon
        this.animateHamburger(false);
        
        // Animate menu items
        this.animateMenuItems(false);
        
        // Release focus trap
        this.trapFocus(false);
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('menuClose'));
    }
    
    animateHamburger(open) {
        const icon = this.menuToggle.querySelector('i');
        
        if (open) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            this.menuToggle.style.transform = 'rotate(90deg)';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            this.menuToggle.style.transform = 'rotate(0deg)';
        }
        
        // Smooth transition
        this.menuToggle.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        // Reset transition after animation
        setTimeout(() => {
            this.menuToggle.style.transition = '';
        }, 300);
    }
    
    animateMenuItems(open) {
        const menuItems = this.mobileMenu.querySelectorAll('.mobile-link, .mobile-btn');
        
        if (open) {
            // Animate in with stagger
            menuItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    
                    // Reset transition
                    setTimeout(() => {
                        item.style.transition = '';
                    }, 400);
                }, index * 100);
            });
        } else {
            // Animate out
            menuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                }, index * 50);
            });
        }
    }
    
    handleMenuClick(e) {
        const link = e.target.closest('.mobile-link');
        if (link) {
            // Add click feedback
            link.style.transform = 'scale(0.95)';
            setTimeout(() => {
                link.style.transform = '';
            }, 200);
            
            // Close menu after delay for smooth transition
            setTimeout(() => {
                this.closeMenu();
            }, 300);
        }
    }
    
    handleKeydown(e) {
        if (!this.isOpen) return;
        
        // Close on Escape key
        if (e.key === 'Escape') {
            this.closeMenu();
            this.menuToggle.focus();
        }
        
        // Trap focus with Tab key
        if (e.key === 'Tab') {
            this.handleTabKey(e);
        }
    }
    
    handleTabKey(e) {
        const focusableElements = this.mobileMenu.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // If shift + tab on first element, focus last
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
        // If tab on last element, focus first
        else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
    
    trapFocus(enable) {
        if (enable) {
            // Store previously focused element
            this.previouslyFocused = document.activeElement;
            
            // Focus first element in menu
            const firstFocusable = this.mobileMenu.querySelector(
                'a[href], button, input, [tabindex]:not([tabindex="-1"])'
            );
            
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 300);
            }
        } else {
            // Restore focus to previously focused element
            if (this.previouslyFocused && this.previouslyFocused.focus) {
                setTimeout(() => this.previouslyFocused.focus(), 100);
            }
        }
    }
}

// Initialize mobile menu
document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
    
    // Add styles for animations
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu {
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .mobile-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .mobile-link, .mobile-btn {
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .menu-toggle {
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        body.menu-open {
            overflow: hidden;
        }
        
        @media (max-width: 768px) {
            body.menu-open::after {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        }
    `;
    document.head.appendChild(style);
});