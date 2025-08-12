// Main JavaScript for Mecra Website
function initializeMecraWebsite() {
    console.log('🔧 Initializing Mecra Website...');
    
    // Initialize AOS (Animate On Scroll) if available
    if (window.AOS) {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // Form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Back to top button
    createBackToTopButton();

    // Initialize language switcher (with delay to ensure DOM is ready)
    setTimeout(() => {
        initializeLanguageSwitcher();
    }, 100);

    // Initialize tooltips
    initializeTooltips();

    // Initialize carousel if exists
    initializeCarousel();

    // Initialize modal if exists
    initializeModal();

    // Simple navbar scroll effect
    initializeNavbarScrollEffect();

    // Initialize hero animations
    initializeHeroAnimations();

    // Initialize navigation scroll handlers
    initializeNavigationScrollHandlers();
}

// Function to initialize hero animations
function initializeHeroAnimations() {
    // Reset and restart hero animations
    const heroAnimations = {
        '.hero-title': { delay: '0.3s', duration: '1s', type: 'fadeInUp' },
        '.hero-subtitle': { delay: '0.8s', duration: '1s', type: 'fadeInUp' },
        '.hero-description': { delay: '1.3s', duration: '1s', type: 'fadeInUp' },
        '.hero-buttons': { delay: '1.8s', duration: '1s', type: 'fadeInUp' },
        '.btn-hero.primary': { delay: '2.2s', duration: '0.8s', type: 'fadeInLeft' },
        '.btn-hero.secondary': { delay: '2.6s', duration: '0.8s', type: 'fadeInRight' },
        '.scroll-indicator': { delay: '3s', duration: '1s', type: 'fadeInUp' }
    };

    Object.entries(heroAnimations).forEach(([selector, config]) => {
        const element = document.querySelector(selector);
        if (element) {
            // Reset element state
            element.style.opacity = '0';
            element.style.transform = getInitialTransform(config.type);
            element.style.animation = 'none';
            
            // Force reflow
            element.offsetHeight;
            
            // Apply animation
            element.style.animation = `${config.type} ${config.duration} ease-out ${config.delay} forwards`;
        }
    });

    console.log('🎬 Hero animations reinitialized');
}

// Helper function to get initial transform based on animation type
function getInitialTransform(animationType) {
    switch(animationType) {
        case 'fadeInLeft':
            return 'translateX(-30px)';
        case 'fadeInRight':
            return 'translateX(30px)';
        case 'fadeInUp':
        default:
            return 'translateY(30px)';
    }
}

// Make function globally available
window.initializeHeroAnimations = initializeHeroAnimations;

// Simple navbar scroll effect
function initializeNavbarScrollEffect() {
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }, { passive: true });
}

// Initialize navigation scroll handlers
function initializeNavigationScrollHandlers() {
    console.log('🔗 Setting up navigation scroll handlers...');
    
    // Wait a bit for content to load
    setTimeout(() => {
        const scrollLinks = document.querySelectorAll('.nav-link[href^="#"], .btn-hero[href^="#"], .scroll-down[href^="#"]');
        console.log('Found scroll links:', scrollLinks.length);
        
        // Log each link found
        scrollLinks.forEach((link, index) => {
            console.log(`Link ${index + 1}:`, link.getAttribute('href'), link.textContent.trim());
        });
        
        scrollLinks.forEach(link => {
            // Remove any existing listeners first
            link.removeEventListener('click', handleScrollClick);
            
            link.addEventListener('click', handleScrollClick);
        });
        
        console.log('✅ Navigation scroll handlers initialized');
    }, 500); // Reduced timeout
}

// Separate scroll click handler
function handleScrollClick(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    console.log('🎯 Scroll click:', targetId, 'Element found:', !!targetElement);
    
    if (targetElement) {
        // Calculate target position manually for better mobile compatibility
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = rect.top + scrollTop - 70; // 70px offset for navbar
        
        console.log('📍 Scrolling to position:', targetPosition);
        
        // Try multiple scroll methods for maximum compatibility
        try {
            // Method 1: Modern smooth scroll
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } catch (e) {
            console.log('🔄 Fallback scroll method');
            // Method 2: Fallback for older browsers
            smoothScrollTo(targetPosition);
        }
        
        // Also update URL
        window.history.pushState(null, null, this.getAttribute('href'));
        
        // Close mobile menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    } else {
        console.warn('Target element not found:', targetId);
    }
}

// Manual smooth scroll function for mobile compatibility
function smoothScrollTo(targetPosition) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800; // 800ms for smooth animation
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    // Easing function for smooth animation
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Check if DOM is already loaded or wait for it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMecraWebsite);
} else {
    // DOM already loaded
    initializeMecraWebsite();
}

// Listen for language change events
document.addEventListener('languageChanged', function(event) {
    console.log('🌍 Language changed event received:', event.detail.language);
    setTimeout(() => {
        updateNavigationAndFooter();
        initializeHeroAnimations(); // Reinitialize hero animations after content change
    }, 100);
});

// Also initialize language switcher after full page load as a fallback
window.addEventListener('load', function() {
    setTimeout(() => {
        const languageButtons = document.querySelectorAll('.language-btn');
        if (languageButtons.length > 0) {
            console.log('🔤 Language switcher fallback initialization...');
            initializeLanguageSwitcher();
        }
    }, 500);
});

// Contact form handler
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
        showAlert('Lütfen tüm alanları doldurun.', 'danger');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showAlert('Geçerli bir e-posta adresi girin.', 'danger');
        return;
    }
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Gönderiliyor...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showAlert('Mesajınız başarıyla gönderildi!', 'success');
        e.target.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Alert system
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at the top of the page
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Back to top button
function createBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'btn btn-primary btn-back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: none;
        border: none;
        box-shadow: 0 4px 12px rgba(6, 50, 60, 0.3);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Update active language button based on current language
function updateActiveLanguageButton() {
    const languageButtons = document.querySelectorAll('.language-btn');
    
    let currentLang = 'en'; // Default fallback
    
    // Try to get current language from various sources
    if (window.mecraApp?.textManager?.getCurrentLanguage) {
        currentLang = window.mecraApp.textManager.getCurrentLanguage();
    } else if (window.textManager?.getCurrentLanguage) {
        currentLang = window.textManager.getCurrentLanguage();
    }
    
    languageButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
    });
}

// Make function globally available
window.updateActiveLanguageButton = updateActiveLanguageButton;

// Initialize language switcher
function initializeLanguageSwitcher() {
    console.log('🔤 Initializing language switcher...');
    
    // Try multiple times to find the buttons
    let attempts = 0;
    const maxAttempts = 10;
    
    function tryInitialize() {
        const languageButtons = document.querySelectorAll('.language-btn');
        console.log('Found language buttons:', languageButtons.length);
        
        if (languageButtons.length === 0) {
            attempts++;
            if (attempts < maxAttempts) {
                console.log(`❌ No language buttons found! Retrying in 500ms... (attempt ${attempts}/${maxAttempts})`);
                setTimeout(tryInitialize, 500);
                return;
            } else {
                console.error('❌ Language buttons not found after maximum attempts');
                return;
            }
        }
        
        languageButtons.forEach((button, index) => {
            console.log(`Setting up button ${index + 1}:`, button.dataset.lang, button);
            
            // Remove any existing event listeners
            button.removeEventListener('click', handleLanguageClick);
            button.removeEventListener('mousedown', handleLanguageMousedown);
            
            // Add new event listeners
            button.addEventListener('click', handleLanguageClick);
            button.addEventListener('mousedown', handleLanguageMousedown);
            
            // Test that the button is clickable
            button.style.pointerEvents = 'auto';
            button.style.cursor = 'pointer';
        });
        
        // Set active button based on current language
        updateActiveLanguageButton();
        
        console.log('✅ Language switcher initialized successfully');
    }
    
    tryInitialize();
}

// Handle language button click
async function handleLanguageClick(e) {
    console.log('🔄 Language button clicked:', this.dataset.lang);
    e.preventDefault();
    
    const targetLang = this.dataset.lang;
    
    // Show loading state
    const originalText = this.textContent;
    this.textContent = '...';
    this.disabled = true;
    
    try {
        // Switch language in text manager
        if (window.mecraApp && window.mecraApp.textManager) {
            console.log('📥 Switching language to:', targetLang);
            await window.mecraApp.textManager.switchLanguage(targetLang);
            
            // Update active language button
            updateActiveLanguageButton();
            
            // Update navigation and footer FIRST
            updateNavigationAndFooter();
            
            // Then reload all content with new language
            if (window.mecraApp.contentLoader) {
                console.log('🔄 Reloading content...');
                await window.mecraApp.contentLoader.reloadAllContent();
            }
            
            // Update navigation and footer AGAIN after content reload
            setTimeout(() => {
                updateNavigationAndFooter();
            }, 500);
            
            console.log(`✅ Language switched to: ${targetLang}`);
        } else {
            console.error('❌ Text manager not available');
        }
    } catch (error) {
        console.error('❌ Error switching language:', error);
    } finally {
        // Restore button state
        this.textContent = originalText;
        this.disabled = false;
    }
}

// Handle language button mousedown for debugging
function handleLanguageMousedown() {
    console.log('👆 Button mousedown detected:', this.dataset.lang);
}

// Update navigation and footer after language change
function updateNavigationAndFooter() {
    console.log('📝 Updating navigation and footer...');
    
    if (!window.mecraApp || !window.mecraApp.textManager) {
        console.error('❌ mecraApp or textManager not available');
        return;
    }
    
    const textManager = window.mecraApp.textManager;
    console.log('📋 Current language:', textManager.getCurrentLanguage());
    console.log('📋 Is loaded:', textManager.isLoaded);
    
    if (!textManager.isLoaded) {
        console.error('❌ TextManager not loaded yet');
        return;
    }
    
    // Update navigation
    const navData = textManager.getText('navigation');
    console.log('📋 Navigation data:', navData);
    
    if (navData) {
        const brandElement = document.getElementById('nav-brand-text');
        if (brandElement) {
            brandElement.textContent = navData.brand;
            console.log('✅ Brand updated to:', navData.brand);
        } else {
            console.error('❌ Brand element not found');
        }
        
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            let navHTML = '';
            navData.items.forEach(item => {
                navHTML += `<li class="nav-item"><a class="nav-link" href="${item.href}">${item.text}</a></li>`;
            });
            navMenu.innerHTML = navHTML;
            console.log('✅ Navigation menu updated:', navData.items);
            
            // Re-initialize scroll handlers after navigation update
            setTimeout(() => {
                initializeNavigationScrollHandlers();
            }, 100);
        } else {
            console.error('❌ Navigation menu element not found');
        }
    } else {
        console.error('❌ Navigation data not found');
    }
    
    // Update footer
    const footerData = textManager.getText('footer');
    console.log('📋 Footer data:', footerData);
    
    if (footerData) {
        const elements = {
            'footer-company-name': footerData.companyName,
            'footer-company-description': footerData.description,
            'footer-contact-title': footerData.contactTitle,
            'footer-copyright': footerData.copyright
        };
        
        Object.entries(elements).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
                console.log(`✅ Updated ${id} to:`, text);
            } else {
                console.error(`❌ Element ${id} not found`);
            }
        });
        
        const footerContactInfo = document.getElementById('footer-contact-info');
        if (footerContactInfo) {
            footerContactInfo.innerHTML = 
                `<p><i class="fas fa-envelope"></i> ${footerData.email}</p>
                 <p><i class="fas fa-phone"></i> ${footerData.phone}</p>`;
            console.log('✅ Footer contact info updated');
        } else {
            console.error('❌ Footer contact info element not found');
        }
    } else {
        console.error('❌ Footer data not found');
    }
    
    // Update page title
    const site = textManager.getText('site');
    if (site) {
        document.title = site.title;
        const pageTitleElement = document.getElementById('page-title');
        if (pageTitleElement) {
            pageTitleElement.textContent = site.title;
        }
        console.log('✅ Page title updated to:', site.title);
    } else {
        console.error('❌ Site data not found');
    }
    
    console.log('✅ Navigation and footer update completed');
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize carousel
function initializeCarousel() {
    const carouselElement = document.querySelector('#projectsCarousel');
    if (carouselElement) {
        const carousel = new bootstrap.Carousel(carouselElement, {
            interval: 5000,
            wrap: true
        });
    }
}

// Initialize modal
function initializeModal() {
    const modalElement = document.querySelector('#projectModal');
    if (modalElement) {
        modalElement.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const projectTitle = button.getAttribute('data-project-title');
            const projectDescription = button.getAttribute('data-project-description');
            
            const modal = this;
            modal.querySelector('.modal-title').textContent = projectTitle;
            modal.querySelector('.modal-body p').textContent = projectDescription;
        });
    }
}

// Utility functions
const Utils = {
    // Debounce function
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    // Throttle function
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format date
    formatDate: function(date) {
        return new Intl.DateTimeFormat('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },

    // Animate counter
    animateCounter: function(element, target, duration = 2000) {
        const start = 0;
        const startTime = Date.now();
        
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (target - start) * progress);
            
            element.textContent = current.toLocaleString('tr-TR');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        updateCounter();
    }
};

// Export Utils for use in other scripts
window.MecraUtils = Utils;
