// Simple Scroll Animation Manager
class ScrollAnimationManager {
    constructor() {
        this.observer = null;
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        console.log('🎬 Initializing scroll animations...');
        
        // Handle initial hash navigation
        this.handleInitialHash();
        
        // Intersection Observer API support check
        if (!('IntersectionObserver' in window)) {
            console.warn('Intersection Observer not supported, scroll animations disabled');
            return;
        }

        // Observer options
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        // Create observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, observerOptions);

        // Start observing after DOM is ready
        this.startObserving();
    }

    handleInitialHash() {
        // Check if page loaded with a hash fragment
        const hash = window.location.hash;
        if (hash) {
            console.log('🔗 Page loaded with hash:', hash);
            // Prevent immediate scroll to allow animations to set up
            window.scrollTo(0, 0);
            // Delay the scroll to the hash target
            setTimeout(() => {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    // Smooth scroll to the target after animations are set up
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 1500); // Wait for animations to be set up
        }
    }

    animateElement(element) {
        console.log('🎯 Animating element:', element.className);
        
        // Add base transition
        element.style.transition = 'all 0.8s ease-out';
        
        // Apply animation based on element type
        if (element.classList.contains('section')) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        } else if (element.classList.contains('section-title')) {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 200);
        } else if (element.classList.contains('service-card')) {
            const cards = element.parentElement.parentElement.querySelectorAll('.service-card');
            const index = Array.from(cards).indexOf(element);
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) scale(1)';
            }, index * 150 + 300);
        } else if (element.classList.contains('project-card')) {
            const cards = element.parentElement.parentElement.querySelectorAll('.project-card');
            const index = Array.from(cards).indexOf(element);
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
            }, index * 150 + 300);
        } else if (element.classList.contains('team-card')) {
            const cards = element.parentElement.parentElement.querySelectorAll('.team-card');
            const index = Array.from(cards).indexOf(element);
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) rotate(0deg)';
            }, index * 200 + 400);
        } else if (element.classList.contains('about-content')) {
            // About section main content
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300);
        } else if (element.classList.contains('stat-item')) {
            // About section statistics
            const items = element.parentElement.parentElement.querySelectorAll('.stat-item');
            const index = Array.from(items).indexOf(element);
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) scale(1)';
            }, index * 150 + 600);
        } else if (element.classList.contains('value-item')) {
            // About section values
            const items = element.parentElement.parentElement.querySelectorAll('.value-item');
            const index = Array.from(items).indexOf(element);
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200 + 800);
        } else if (element.classList.contains('scroll-animate-fade')) {
            element.style.opacity = '1';
        }
    }

    startObserving() {
        // Wait for DOM to be ready
        setTimeout(() => {
            this.observeElements();
        }, 1000);
    }

    observeElements() {
        console.log('👀 Starting to observe elements...');
        
        // Check if we have a hash target
        const hash = window.location.hash;
        const targetSection = hash ? document.querySelector(hash) : null;
        
        // Hide and observe sections (except home)
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            if (section.closest('#home')) return;
            
            // If this section is the target of a hash, animate it immediately
            if (targetSection && section.closest(hash)) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
                section.style.transition = 'all 0.8s ease-out';
                this.animatedElements.add(section);
                return;
            }
            
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'none';
            this.observer.observe(section);
        });

        // Hide and observe titles
        const titles = document.querySelectorAll('.section-title');
        titles.forEach(title => {
            if (title.closest('#home')) return;
            
            // If this title is in the target section, animate it immediately
            if (targetSection && title.closest(hash)) {
                setTimeout(() => {
                    title.style.opacity = '1';
                    title.style.transform = 'translateY(0)';
                    title.style.transition = 'all 0.8s ease-out';
                }, 200);
                this.animatedElements.add(title);
                return;
            }
            
            title.style.opacity = '0';
            title.style.transform = 'translateY(30px)';
            title.style.transition = 'none';
            this.observer.observe(title);
        });

        // Handle cards and content for target section
        this.setupCardsAndContent(targetSection, hash);

        console.log(`👀 Observing elements. Target section: ${hash || 'none'}`);
    }

    setupCardsAndContent(targetSection, hash) {
        // Service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            if (targetSection && card.closest(hash)) {
                this.animateTargetCard(card, 'service');
                return;
            }
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.9)';
            card.style.transition = 'none';
            this.observer.observe(card);
        });

        // Project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            if (targetSection && card.closest(hash)) {
                this.animateTargetCard(card, 'project');
                return;
            }
            card.style.opacity = '0';
            card.style.transform = 'translateX(-50px)';
            card.style.transition = 'none';
            this.observer.observe(card);
        });

        // Team cards
        const teamCards = document.querySelectorAll('.team-card');
        teamCards.forEach(card => {
            if (targetSection && card.closest(hash)) {
                this.animateTargetCard(card, 'team');
                return;
            }
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px) rotate(3deg)';
            card.style.transition = 'none';
            this.observer.observe(card);
        });

        // About content
        const aboutContent = document.querySelectorAll('.about-content');
        aboutContent.forEach(content => {
            if (targetSection && content.closest(hash)) {
                setTimeout(() => {
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                    content.style.transition = 'all 0.8s ease-out';
                }, 300);
                this.animatedElements.add(content);
                return;
            }
            content.style.opacity = '0';
            content.style.transform = 'translateY(30px)';
            content.style.transition = 'none';
            this.observer.observe(content);
        });

        // About stats and values
        this.setupAboutElements(targetSection, hash);
        
        // Fade elements
        const fadeElements = document.querySelectorAll('.scroll-animate-fade');
        fadeElements.forEach(element => {
            if (targetSection && element.closest(hash)) {
                element.style.opacity = '1';
                element.style.transition = 'all 0.8s ease-out';
                this.animatedElements.add(element);
                return;
            }
            element.style.opacity = '0';
            element.style.transition = 'none';
            this.observer.observe(element);
        });
    }

    animateTargetCard(card, type) {
        const cards = card.parentElement.parentElement.querySelectorAll(`.${type}-card`);
        const index = Array.from(cards).indexOf(card);
        const delays = { service: 150, project: 150, team: 200 };
        const baseDelay = { service: 300, project: 300, team: 400 };
        
        setTimeout(() => {
            card.style.opacity = '1';
            if (type === 'service') {
                card.style.transform = 'translateY(0) scale(1)';
            } else if (type === 'project') {
                card.style.transform = 'translateX(0)';
            } else if (type === 'team') {
                card.style.transform = 'translateY(0) rotate(0deg)';
            }
            card.style.transition = 'all 0.8s ease-out';
        }, index * delays[type] + baseDelay[type]);
        
        this.animatedElements.add(card);
    }

    setupAboutElements(targetSection, hash) {
        // About stats
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            if (targetSection && item.closest(hash)) {
                const items = item.parentElement.parentElement.querySelectorAll('.stat-item');
                const index = Array.from(items).indexOf(item);
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';
                    item.style.transition = 'all 0.8s ease-out';
                }, index * 150 + 600);
                this.animatedElements.add(item);
                return;
            }
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px) scale(0.9)';
            item.style.transition = 'none';
            this.observer.observe(item);
        });

        // About values
        const valueItems = document.querySelectorAll('.value-item');
        valueItems.forEach(item => {
            if (targetSection && item.closest(hash)) {
                const items = item.parentElement.parentElement.querySelectorAll('.value-item');
                const index = Array.from(items).indexOf(item);
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.style.transition = 'all 0.8s ease-out';
                }, index * 200 + 800);
                this.animatedElements.add(item);
                return;
            }
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'none';
            this.observer.observe(item);
        });
    }

    refresh() {
        console.log('🔄 Refreshing scroll animations...');
        if (this.observer) {
            this.observer.disconnect();
        }
        this.animatedElements.clear();
        this.startObserving();
    }
}

// Global instance
window.scrollAnimationManager = new ScrollAnimationManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.scrollAnimationManager.refresh();
    }, 1000);
});

// Refresh when content is loaded
document.addEventListener('contentLoaded', () => {
    setTimeout(() => {
        window.scrollAnimationManager.refresh();
    }, 500);
});

// Refresh when language changes
document.addEventListener('languageChanged', () => {
    setTimeout(() => {
        window.scrollAnimationManager.refresh();
    }, 500);
});

console.log('🎬 Scroll Animation Manager loaded');
