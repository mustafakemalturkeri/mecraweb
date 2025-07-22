// Text Manager for Mecra Website
class TextManager {
    constructor() {
        this.texts = {};
        this.currentLanguage = 'en'; // Default to English
        this.isLoaded = false;
        this.loadPromise = null;
        this.availableLanguages = ['tr', 'en'];
    }

    // Get cache-busting parameter
    getCacheBuster() {
        return `?v=${Date.now()}&r=${Math.random()}`;
    }

    // Apply cache busting to image URLs
    getCacheBustedImageUrl(imagePath) {
        return `${imagePath}${this.getCacheBuster()}`;
    }

    // Apply cache busting to all images on the page
    applyCacheBustingToImages() {
        // Cache bust all img elements
        document.querySelectorAll('img').forEach(img => {
            if (img.src && !img.src.includes('?v=')) {
                const originalSrc = img.src.split('?')[0]; // Remove existing query params
                img.src = this.getCacheBustedImageUrl(originalSrc);
            }
        });

        // Cache bust background images in CSS
        document.querySelectorAll('*').forEach(element => {
            const style = window.getComputedStyle(element);
            const backgroundImage = style.backgroundImage;
            if (backgroundImage && backgroundImage !== 'none' && backgroundImage.includes('url(')) {
                const urlMatch = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (urlMatch && urlMatch[1] && !urlMatch[1].includes('?v=')) {
                    const originalUrl = urlMatch[1].split('?')[0];
                    element.style.backgroundImage = `url('${this.getCacheBustedImageUrl(originalUrl)}')`;
                }
            }
        });

        console.log('Cache busting applied to all images');
    }

    // Load texts from JSON file
    async loadTexts(language = 'en') {
        if (this.loadPromise && this.currentLanguage === language) {
            return this.loadPromise;
        }

        this.loadPromise = new Promise(async (resolve, reject) => {
            try {
                const fileName = language === 'en' ? 'texts_en.json' : 'texts.json';
                const url = `data/${fileName}${this.getCacheBuster()}`;
                console.log('Loading texts from:', url);
                
                const response = await fetch(url);
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Failed to load texts: ${response.status}`);
                }
                
                this.texts = await response.json();
                console.log('Loaded texts:', this.texts);
                this.currentLanguage = language;
                this.isLoaded = true;
                
                console.log('Texts loaded successfully');
                resolve(this.texts);
            } catch (error) {
                console.error('Error loading texts:', error);
                reject(error);
            }
        });

        return this.loadPromise;
    }

    // Switch language
    async switchLanguage(language) {
        console.log('🔄 Switching language from', this.currentLanguage, 'to', language);
        
        if (!this.availableLanguages.includes(language)) {
            console.error('Language not supported:', language);
            return;
        }

        if (this.currentLanguage === language) {
            console.log('Already in target language, skipping');
            return;
        }

        // Force reload by resetting state
        this.isLoaded = false;
        this.loadPromise = null;
        this.texts = {};
        
        try {
            console.log('📥 Loading texts for language:', language);
            await this.loadTexts(language);
            
            console.log('📄 Updating page meta');
            this.updatePageMeta();
            
            // Trigger a custom event for language change
            const event = new CustomEvent('languageChanged', {
                detail: { language: language, texts: this.texts }
            });
            document.dispatchEvent(event);
            
            // Apply cache busting to images after language change
            setTimeout(() => {
                this.applyCacheBustingToImages();
            }, 100);
            
            console.log('✅ Language switched to:', language);
        } catch (error) {
            console.error('❌ Failed to switch language:', error);
            throw error;
        }
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Get available languages
    getAvailableLanguages() {
        return this.availableLanguages;
    }

    // Get text by path (e.g., "hero.title")
    getText(path, defaultValue = '') {
        if (!this.isLoaded) {
            console.warn('Texts not loaded yet for path:', path);
            return defaultValue;
        }

        if (!path) {
            console.warn('Empty path provided to getText');
            return defaultValue;
        }

        const keys = path.split('.');
        let current = this.texts;
        
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                console.warn(`Key '${key}' not found in path '${path}'. Available keys:`, current ? Object.keys(current) : 'none');
                return defaultValue;
            }
        }
        
        return current;
    }

    // Get content for a specific section (alias for getText for compatibility)
    getContent(section) {
        return this.getText(section);
    }

    // Apply texts to HTML elements
    applyTexts() {
        if (!this.isLoaded) {
            console.warn('Texts not loaded yet');
            return;
        }

        // Apply texts to elements with data-text attribute
        document.querySelectorAll('[data-text]').forEach(element => {
            const textPath = element.getAttribute('data-text');
            const text = this.getText(textPath);
            
            if (text) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });

        // Apply texts to elements with data-html attribute (for HTML content)
        document.querySelectorAll('[data-html]').forEach(element => {
            const textPath = element.getAttribute('data-html');
            const text = this.getText(textPath);
            
            if (text) {
                element.innerHTML = text;
            }
        });

        // Apply texts to elements with data-attr attribute (for attributes)
        document.querySelectorAll('[data-attr]').forEach(element => {
            const attrConfig = element.getAttribute('data-attr');
            const [attribute, textPath] = attrConfig.split(':');
            const text = this.getText(textPath);
            
            if (text) {
                element.setAttribute(attribute, text);
            }
        });

        console.log('Texts applied to HTML elements');
    }

    // Render navigation
    renderNavigation() {
        const nav = this.getText('navigation');
        if (!nav) return;

        const navbarBrand = document.querySelector('.navbar-brand span');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        if (navbarBrand) {
            navbarBrand.textContent = nav.brand;
        }

        const navItems = ['home', 'services', 'projects', 'team', 'patents'];
        navLinks.forEach((link, index) => {
            if (navItems[index] && nav[navItems[index]]) {
                link.textContent = nav[navItems[index]];
            }
        });
    }

    // Render hero section
    renderHero() {
        const hero = this.getText('hero');
        if (!hero) return;

        const heroHTML = `
            <div class="hero-content" data-aos="fade-up">
                <h1 class="hero-title">
                    ${hero.title} 
                    <span class="text-gradient">${hero.titleHighlight}</span>
                </h1>
                <p class="hero-subtitle">
                    ${hero.subtitle}
                </p>
                <div class="hero-buttons">
                    <a href="#team" class="btn btn-hero me-3">
                        <i class="fas fa-arrow-right me-2"></i>
                        ${hero.button1}
                    </a>
                    <a href="#footer" class="btn btn-outline-light btn-lg">
                        <i class="fas fa-envelope me-2"></i>
                        ${hero.button2}
                    </a>
                </div>
            </div>
        `;

        const heroImageHTML = `
            <div class="hero-image" data-aos="fade-left" data-aos-delay="600">
                <div class="hero-image-placeholder">
                    <img src="${this.getCacheBustedImageUrl('assets/img/hero-image.png')}" alt="Mecra Logo" class="img-fluid mb-3" style="max-width: 400px;">
                    <h3 class="text-white">${hero.logoText}</h3>
                    <p class="text-white-50">${hero.logoSubtext}</p>
                </div>
            </div>
        `;
        return { heroHTML, heroImageHTML };
    }

    // Render about section
    renderAbout() {
        const about = this.getText('about');
        if (!about) return;

        const valuesHTML = about.values.map(value => `
            <div class="col-md-4">
                <div class="value-item text-center">
                    <div class="value-icon">
                        <i class="${value.icon}"></i>
                    </div>
                    <h4>${value.title}</h4>
                    <p>${value.description}</p>
                </div>
            </div>
        `).join('');

        return {
            title: about.title,
            subtitle: about.subtitle,
            description: about.description,
            extendedDescription: about.extendedDescription,
            stats: about.stats,
            valuesTitle: about.valuesTitle,
            valuesHTML: valuesHTML
        };
    }

    // Render services section
    renderServices() {
        const services = this.getText('services');
        if (!services) return;

        const servicesHTML = services.items.map((service, index) => `
            <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
                <div class="card service-card h-100">
                    <div class="card-body">
                        <div class="service-icon">
                            <i class="${service.icon}"></i>
                        </div>
                        <h4 class="service-title">${service.title}</h4>
                        <p class="service-description">${service.description}</p>
                    </div>
                </div>
            </div>
        `).join('');

        const advantagesHTML = services.advantages.map(advantage => `
            <div class="col-md-3">
                <div class="advantage-item">
                    <div class="advantage-icon">
                        <i class="${advantage.icon}"></i>
                    </div>
                    <h5>${advantage.title}</h5>
                    <p>${advantage.description}</p>
                </div>
            </div>
        `).join('');

        return {
            title: services.title,
            subtitle: services.subtitle,
            servicesHTML: servicesHTML,
            advantagesTitle: services.advantagesTitle,
            advantagesHTML: advantagesHTML
        };
    }

    // Render projects section
    renderProjects() {
        const projects = this.getText('projects');
        if (!projects) return;

        const filterButtonsHTML = Object.entries(projects.filterButtons).map(([key, value]) => `
            <button class="filter-btn ${key === 'all' ? 'active' : ''}" data-filter="${key}">${value}</button>
        `).join('');

        const projectsHTML = projects.items.map((project, index) => `
            <div class="col-lg-4 col-md-6 mb-4 project-item" data-category="${project.category}" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
                <div class="project-card">
                    <div class="project-image">
                        <div class="project-placeholder">
                            <i class="${project.icon} fa-3x text-primary"></i>
                            <h5 class="mt-2">${project.iconTitle}</h5>
                        </div>
                        <div class="project-overlay">
                            <div class="project-info">
                                <h4>${project.title}</h4>
                                <p>${project.description}</p>
                                <a href="#" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#projectModal" 
                                   data-project-title="${project.title}"
                                   data-project-description="${project.details}">
                                    ${projects.detailsButton}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        return {
            title: projects.title,
            subtitle: projects.subtitle,
            filterButtonsHTML: filterButtonsHTML,
            projectsHTML: projectsHTML
        };
    }

    // Render team section
    renderTeam() {
        const team = this.getText('team');
        if (!team) return;

        const membersHTML = team.members.map((member, index) => `
            <div class="col-lg-5 mb-4" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
                <div class="team-card" onclick="openTeamModal(${index})" data-member-index="${index}">
                    <div class="team-image">
                        ${member.image ? 
                            `<img src="${this.getCacheBustedImageUrl(member.image)}" alt="${member.name}" class="team-member-img">` :
                            `<div class="team-icon-placeholder">
                                <i class="${member.icon}"></i>
                            </div>`
                        }
                        <div class="team-overlay">
                            <div class="social-links">
                                <a href="#" class="social-link"><i class="fab fa-linkedin"></i></a>
                                <a href="#" class="social-link"><i class="fas fa-envelope"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="team-info">
                        <h4>${member.name}</h4>
                        <p class="team-position">${member.position}</p>
                        <p class="team-description">${member.description}</p>
                    </div>
                </div>
            </div>
        `).join('');

        const cultureHTML = team.culture.map(item => `
            <div class="col-md-6">
                <div class="culture-item">
                    <div class="culture-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="culture-content">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                    </div>
                </div>
            </div>
        `).join('');

        return {
            title: team.title,
            subtitle: team.subtitle,
            membersHTML: membersHTML,
            cultureTitle: team.cultureTitle,
            cultureHTML: cultureHTML,
            joinTitle: team.joinTitle,
            joinDescription: team.joinDescription,
            joinButton: team.joinButton
        };
    }

    // Render footer
    renderFooter() {
        const footer = this.getText('footer');
        if (!footer) return;

        const footerHTML = `
            <div class="container">
                <div class="row">
                    <div class="col-md-6" style="text-align: justify;">
                        <img src="${this.getCacheBustedImageUrl(footer.footerImage)}" alt="${footer.companyName}">
                        <h5 style="text-align: justify;">${footer.companyName}</h5>
                        <p style="text-align: justify;">${footer.description}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>${footer.contactTitle}</h5>
                        <p>
                            <i class="fas fa-envelope"></i> <a href="mailto:${footer.email}" style="color: inherit; text-decoration: none;">${footer.email}</a><br>
                            <i class="fas fa-phone"></i> ${footer.phone}
                        </p>
                    </div>
                </div>
                <hr class="my-4">
                <div class="row">
                    <div class="col-md-12 text-center">
                        <p>&copy; ${footer.copyright}</p>
                    </div>
                </div>
            </div>
        `;

        return footerHTML;
    }

    // Update page title and meta
    updatePageMeta() {
        const site = this.getText('site');
        if (!site) return;

        document.title = site.title;
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', site.description);
        }
        
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', site.keywords);
        }
    }

    // Initialize text manager
    async init() {
        try {
            // Load texts with the saved language preference (currentLanguage is set in constructor)
            console.log(`🚀 Initializing TextManager with language: ${this.currentLanguage}`);
            await this.loadTexts(this.currentLanguage);
            this.updatePageMeta();
            this.renderNavigation();
            this.applyTexts();
            this.applyCacheBustingToImages();
            console.log('Text Manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Text Manager:', error);
        }
    }
}

// Create global instance
window.textManager = new TextManager();

// Also assign to mecraApp if it exists, or create it
if (typeof window.mecraApp === 'undefined') {
    window.mecraApp = {};
}
window.mecraApp.textManager = window.textManager;

console.log('🔧 TextManager instance created and assigned to global scope');

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📖 DOM ready, initializing TextManager...');
    window.textManager.init();
});

// Global service modal functions
function openServiceModal(serviceIndex) {
    console.log('Opening service modal for service:', serviceIndex);
    
    // Try different ways to access textManager
    let textManager = null;
    if (window.textManager && window.textManager.isLoaded) {
        textManager = window.textManager;
    } else if (window.mecraApp && window.mecraApp.textManager) {
        textManager = window.mecraApp.textManager;
    }
    
    if (!textManager) {
        console.error('TextManager not available');
        return;
    }
    
    const services = textManager.getText('services');
    if (!services || !services.items || !services.items[serviceIndex]) {
        console.error('Service not found:', serviceIndex);
        return;
    }
    
    const service = services.items[serviceIndex];
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('serviceModal');
    if (!modal) {
        modal = createServiceModal();
        document.body.appendChild(modal);
    }
    
    // Populate modal with service data
    populateServiceModal(modal, service);
    
    // Show modal
    document.body.classList.add('modal-open');
    modal.classList.add('active');
    
    // Reset scroll position to top
    setTimeout(() => {
        const modalBody = modal.querySelector('.service-modal-body');
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
        modal.scrollTop = 0;
    }, 100);
    
    // Focus trap for accessibility
    modal.focus();
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

function createServiceModal() {
    const modal = document.createElement('div');
    modal.id = 'serviceModal';
    modal.className = 'service-modal';
    modal.tabIndex = -1;
    
    modal.innerHTML = `
        <div class="service-modal-content">
            <div class="service-modal-header">
                <button class="service-modal-close" onclick="closeServiceModal()" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="service-modal-icon" id="serviceModalIcon">
                    <!-- Icon will be populated dynamically -->
                </div>
                <h2 class="service-modal-title" id="serviceModalTitle"></h2>
            </div>
            <div class="service-modal-body" style="text-align: justify;">
                <div class="service-modal-description" id="serviceModalDescription"></div>
            </div>
            <div class="service-modal-footer">
                <button class="service-modal-close-btn" onclick="closeServiceModal()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeServiceModal();
        }
    });
    
    // Close modal with Escape key
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeServiceModal();
        }
    });
    
    return modal;
}

function populateServiceModal(modal, service) {
    // Update icon
    const iconContainer = modal.querySelector('#serviceModalIcon');
    iconContainer.innerHTML = `<i class="${service.icon}"></i>`;
    
    // Update title
    modal.querySelector('#serviceModalTitle').textContent = service.title;
    
    // Update description
    modal.querySelector('#serviceModalDescription').innerHTML = service.description;
    
    // Update close button text based on language
    const commonData = window.textManager ? window.textManager.getText('common') : null;
    let closeButtonText = 'Close'; // default
    if (commonData && commonData.close) {
        closeButtonText = commonData.close;
    } else {
        let currentLang = 'en'; // default
        if (window.textManager && window.textManager.getCurrentLanguage) {
            currentLang = window.textManager.getCurrentLanguage();
        } else if (window.mecraApp && window.mecraApp.textManager && window.mecraApp.textManager.getCurrentLanguage) {
            currentLang = window.mecraApp.textManager.getCurrentLanguage();
        }
        closeButtonText = currentLang === 'en' ? 'Close' : 'Kapat';
    }
    modal.querySelector('.service-modal-close-btn').textContent = closeButtonText;
}

// Global team modal functions
function openTeamModal(memberIndex) {
    console.log('Opening team modal for member:', memberIndex);
    
    // Try different ways to access textManager
    let textManager = null;
    if (window.textManager && window.textManager.isLoaded) {
        textManager = window.textManager;
    } else if (window.mecraApp && window.mecraApp.textManager) {
        textManager = window.mecraApp.textManager;
    }
    
    if (!textManager) {
        console.error('TextManager not available');
        return;
    }
    
    const team = textManager.getText('team');
    if (!team || !team.members || !team.members[memberIndex]) {
        console.error('Team member not found:', memberIndex);
        return;
    }
    
    const member = team.members[memberIndex];
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('teamModal');
    if (!modal) {
        modal = createTeamModal();
        document.body.appendChild(modal);
    }
    
    // Populate modal with member data
    populateTeamModal(modal, member);
    
    // Show modal first
    document.body.classList.add('modal-open');
    modal.classList.add('active');
    
    // Reset scroll position to top after modal is shown (with a small delay to ensure DOM is ready)
    setTimeout(() => {
        const modalBody = modal.querySelector('.team-modal-body');
        if (modalBody) {
            modalBody.scrollTop = 0;
            console.log('Modal scroll reset to top');
        }
        
        // Also reset any scrollable content within the modal
        const modalContent = modal.querySelector('.team-modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
        
        // Reset the main modal scroll
        modal.scrollTop = 0;
    }, 100);
    
    // Focus trap for accessibility
    modal.focus();
}

function closeTeamModal() {
    const modal = document.getElementById('teamModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

function createTeamModal() {
    const modal = document.createElement('div');
    modal.id = 'teamModal';
    modal.className = 'team-modal';
    modal.tabIndex = -1;
    
    modal.innerHTML = `
        <div class="team-modal-content">
            <div class="team-modal-header">
                <button class="team-modal-close-top" onclick="closeTeamModal()" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="team-modal-avatar" id="teamModalAvatar">
                    <!-- Avatar will be populated dynamically -->
                </div>
                <h2 class="team-modal-name" id="teamModalName"></h2>
                <p class="team-modal-position" id="teamModalPosition"></p>
            </div>
            <div class="team-modal-body">
                <div class="team-modal-bio" id="teamModalBio"></div>
                <div class="team-modal-contact" id="teamModalContact">
                    <!-- Contact links will be populated dynamically -->
                </div>
            </div>
            <div class="team-modal-footer">
                <button class="team-modal-close-bottom" onclick="closeTeamModal()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeTeamModal();
        }
    });
    
    // Close modal with Escape key
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeTeamModal();
        }
    });
    
    return modal;
}

function populateTeamModal(modal, member) {
    // Update avatar
    const avatarContainer = modal.querySelector('#teamModalAvatar');
    const hasImageExtension = member.icon && (member.icon.includes('.jpg') || member.icon.includes('.jpeg') || member.icon.includes('.png'));
    
    if (hasImageExtension) {
        avatarContainer.innerHTML = `<img src="assets/img/${member.icon}" alt="${member.name}">`;
    } else {
        avatarContainer.innerHTML = `<div class="team-modal-avatar-placeholder"><i class="${member.icon || 'fas fa-user'}"></i></div>`;
    }
    
    // Update name and position
    modal.querySelector('#teamModalName').textContent = member.name;
    modal.querySelector('#teamModalPosition').innerHTML = member.position;
    
    // Update biography
    const bioText = member.detailedBio || member.description || 'No detailed biography available.';
    modal.querySelector('#teamModalBio').innerHTML = bioText;
    
    // Update contact links
    const contactContainer = modal.querySelector('#teamModalContact');
    let contactHTML = '';
    
    if (member.linkedin) {
        contactHTML += `
            <a href="${member.linkedin}" target="_blank" class="team-modal-contact-link">
                <i class="fab fa-linkedin"></i>
                LinkedIn
            </a>
        `;
    }
    
    if (member.github) {
        contactHTML += `
            <a href="${member.github}" target="_blank" class="team-modal-contact-link">
                <i class="fab fa-github"></i>
                GitHub
            </a>
        `;
    }
    
    if (member.email) {
        contactHTML += `
            <a href="mailto:${member.email}" class="team-modal-contact-link">
                <i class="fas fa-envelope"></i>
                Email
            </a>
        `;
    }
    
    contactContainer.innerHTML = contactHTML;
    
    // Update close button text based on language
    let currentLang = 'en'; // default
    if (window.textManager && window.textManager.getCurrentLanguage) {
        currentLang = window.textManager.getCurrentLanguage();
    } else if (window.mecraApp && window.mecraApp.textManager && window.mecraApp.textManager.getCurrentLanguage) {
        currentLang = window.mecraApp.textManager.getCurrentLanguage();
    }
    const closeButtonText = currentLang === 'en' ? 'Close' : 'Kapat';
    modal.querySelector('.team-modal-close-bottom').textContent = closeButtonText;
}

// Global project modal functions
function openProjectModal(projectType, projectIndex) {
    console.log('Opening project modal for project:', projectType, projectIndex);
    
    // Try different ways to access textManager
    let textManager = null;
    if (window.textManager && window.textManager.isLoaded) {
        textManager = window.textManager;
    } else if (window.mecraApp && window.mecraApp.textManager) {
        textManager = window.mecraApp.textManager;
    }
    
    if (!textManager) {
        console.error('TextManager not available');
        return;
    }
    
    const projects = textManager.getText('projects');
    if (!projects) {
        console.error('Projects data not found');
        return;
    }
    
    let project = null;
    if (projectType === 'flagship' && projects.flagshipProjects && projects.flagshipProjects.items) {
        project = projects.flagshipProjects.items[projectIndex];
    } else if (projectType === 'reference' && projects.keyReferences && projects.keyReferences.items) {
        project = projects.keyReferences.items[projectIndex];
    }
    
    if (!project) {
        console.error('Project not found:', projectType, projectIndex);
        return;
    }
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('projectModal');
    if (!modal) {
        modal = createProjectModal();
        document.body.appendChild(modal);
    }
    
    // Populate modal with project data
    populateProjectModal(modal, project);
    
    // Show modal
    document.body.classList.add('modal-open');
    modal.classList.add('active');
    
    // Reset scroll position to top
    setTimeout(() => {
        const modalBody = modal.querySelector('.project-modal-body');
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
        modal.scrollTop = 0;
    }, 100);
    
    // Focus trap for accessibility
    modal.focus();
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

function createProjectModal() {
    const modal = document.createElement('div');
    modal.id = 'projectModal';
    modal.className = 'project-modal';
    modal.tabIndex = -1;
    
    modal.innerHTML = `
        <div class="project-modal-content">
            <div class="project-modal-header">
                <button class="project-modal-close" onclick="closeProjectModal()" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="project-modal-icon" id="projectModalIcon">
                    <!-- Icon will be populated dynamically -->
                </div>
                <h2 class="project-modal-title" id="projectModalTitle"></h2>
            </div>
            <div class="project-modal-body">
                <p class="project-modal-description" id="projectModalDescription" style="text-align: justify;"></p>
                <div class="project-modal-details" id="projectModalDetails" style="text-align: justify;"></div>
            </div>
            <div class="project-modal-footer">
                <button class="project-modal-close-btn" onclick="closeProjectModal()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProjectModal();
        }
    });
    
    // Close modal with Escape key
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProjectModal();
        }
    });
    
    return modal;
}

function populateProjectModal(modal, project) {
    // Update icon
    const iconContainer = modal.querySelector('#projectModalIcon');
    iconContainer.innerHTML = `<i class="${project.icon}"></i>`;
    
    // Update title
    modal.querySelector('#projectModalTitle').textContent = project.title;
    
    // Update description
    modal.querySelector('#projectModalDescription').textContent = project.description;
    
    // Update details (if available)
    const detailsContainer = modal.querySelector('#projectModalDetails');
    if (project.details) {
        detailsContainer.innerHTML = project.details;
        detailsContainer.style.display = 'block';
    } else {
        detailsContainer.style.display = 'none';
    }
    
    // Update close button text based on language
    const commonData = window.textManager ? window.textManager.getText('common') : null;
    let closeButtonText = 'Close'; // default
    if (commonData && commonData.close) {
        closeButtonText = commonData.close;
    } else {
        let currentLang = 'en'; // default
        if (window.textManager && window.textManager.getCurrentLanguage) {
            currentLang = window.textManager.getCurrentLanguage();
        } else if (window.mecraApp && window.mecraApp.textManager && window.mecraApp.textManager.getCurrentLanguage) {
            currentLang = window.mecraApp.textManager.getCurrentLanguage();
        }
        closeButtonText = currentLang === 'en' ? 'Close' : 'Kapat';
    }
    modal.querySelector('.project-modal-close-btn').textContent = closeButtonText;
}

// Legacy function for backward compatibility
function showProjectDetails(title, details) {
    console.log('Legacy showProjectDetails called, redirecting to new modal system');
    const project = { title, details, icon: 'fas fa-project-diagram' };
    
    let modal = document.getElementById('projectModal');
    if (!modal) {
        modal = createProjectModal();
        document.body.appendChild(modal);
    }
    
    populateProjectModal(modal, project);
    
    document.body.classList.add('modal-open');
    modal.classList.add('active');
    
    setTimeout(() => {
        const modalBody = modal.querySelector('.project-modal-body');
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
        modal.scrollTop = 0;
    }, 100);
    
    modal.focus();
}

// Make functions globally available
window.openServiceModal = openServiceModal;
window.closeServiceModal = closeServiceModal;
window.openTeamModal = openTeamModal;
window.closeTeamModal = closeTeamModal;
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.showProjectDetails = showProjectDetails;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextManager;
}
