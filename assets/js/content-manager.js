// Content Management System for Mecra Website
class ContentManager {
    constructor() {
        // Constructor is now clean - all content comes from texts.json
        this.isInitialized = false;
        this.init();
    }

    async init() {
        console.log('ContentManager: Starting initialization...');
        
        // Wait for textManager to be ready with timeout
        let attempts = 0;
        const maxAttempts = 100;
        
        while ((!window.textManager || !window.textManager.isLoaded) && attempts < maxAttempts) {
            if (attempts % 10 === 0) {
                console.log(`ContentManager: Waiting for TextManager... Attempt ${attempts + 1}/${maxAttempts}`);
                console.log('- TextManager available:', !!window.textManager);
                console.log('- TextManager loaded:', !!window.textManager?.isLoaded);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.textManager || !window.textManager.isLoaded) {
            console.error('❌ ContentManager: TextManager not ready after maximum attempts');
            return;
        }
        
        // Additional safety delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        this.isInitialized = true;
        console.log('✅ ContentManager: Initialized and ready');
    }

    // Get content for a specific section from texts.json
    getContent(section) {
        if (!window.textManager) return null;
        return window.textManager.getText(section);
    }

    // Get current texts (alias for compatibility)
    get currentTexts() {
        if (!window.textManager) return {};
        return window.textManager.texts;
    }

    // Generate HTML for hero section
    generateHeroHTML() {
        const heroData = window.textManager.getText('hero');
        if (!heroData) return '';
        
        return `
            <section class="hero-section">
                <div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7">
                            <div class="hero-content">
                                <h1 class="hero-title">${heroData.title} <span class="hero-title-highlight">${heroData.titleHighlight}</span></h1>
                                <p class="hero-subtitle">${heroData.subtitle}</p>
                                <p class="hero-description" style="text-align: justify;">${heroData.description}</p>
                                <div class="hero-buttons">
                                    <a href="#team" class="btn-hero primary">
                                        ${heroData.button1} <i class="fas fa-arrow-right btn-hero-icon"></i>
                                    </a>
                                    <a href="#footer" class="btn-hero secondary">
                                        ${heroData.button2} <i class="fas fa-envelope btn-hero-icon"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Scroll Down Indicator -->
                <div class="scroll-indicator">
                    <a href="#team" class="scroll-down">
                        <i class="fas fa-chevron-down"></i>
                    </a>
                </div>
            </section>
        `;
    }

    // Generate HTML for services
    generateServicesHTML() {
        const servicesData = window.textManager.getText('services');
        if (!servicesData || !servicesData.items) {
            return '';
        }
        
        let html = `
            <h2 class="section-title">${servicesData.title}</h2>
            <p class="mb-5 scroll-animate-fade" style="text-align: justify;">${servicesData.subtitle}</p>
            <div class="row">
        `;
        
        servicesData.items.forEach((service, index) => {
            console.log(`🔧 Service ${index}:`, service.title, 'Background:', service.backgroundImage);
            html += `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card service-card service-card-clickable h-100" data-service-index="${index}" data-bg-image="${service.backgroundImage || ''}" onclick="openServiceModal(${index})">
                        <div class="card-body">
                            <div class="service-icon">
                                <i class="${service.icon}"></i>
                            </div>
                            <h4 class="service-title">${service.title}</h4>
                            <button class="service-details-btn" onclick="event.stopPropagation(); openServiceModal(${index})">
                                ${this.getDetailsButtonText()}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        
        return html;
    }

    // Get details button text based on language
    getDetailsButtonText() {
        const commonData = window.textManager.getText('common');
        if (commonData && commonData.details) {
            return commonData.details;
        }
        // Fallback
        let currentLang = 'en'; // default
        if (window.textManager && window.textManager.getCurrentLanguage) {
            currentLang = window.textManager.getCurrentLanguage();
        }
        return currentLang === 'en' ? 'Details' : 'Detaylar';
    }

    // Generate Projects HTML
    generateProjectsHTML() {
        console.log('🔥 generateProjectsHTML called!');
        const projects = this.currentTexts.projects;
        console.log('🔥 Projects data:', projects);
        
        if (!projects) {
            console.error('❌ No projects data found!');
            return '<div class="container"><h2>Projects data not found</h2></div>';
        }
        
        // Generate flagship projects - use same structure as Services
        const flagshipHTML = projects.flagshipProjects.items.map((project, index) => {
            return `
                <div class="col-lg-6 mb-4">
                    <div class="card service-card service-card-clickable h-100" data-bg-image="${project.backgroundImage || ''}" data-project-type="flagship" data-project-index="${index}" onclick="openProjectModal('flagship', ${index})">
                        <div class="card-body">
                            <div class="service-icon">
                                <i class="${project.icon}"></i>
                            </div>
                            <h4 class="service-title">${project.title}</h4>
                            <button class="service-details-btn" onclick="event.stopPropagation(); openProjectModal('flagship', ${index})">
                                ${this.getDetailsButtonText()}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Generate key references (3 columns for 9 items) - use same structure as Services
        const referencesHTML = projects.keyReferences.items.map((project, index) => {
            return `
                <div class="col-lg-4 mb-4">
                    <div class="card service-card service-card-clickable h-100" data-bg-image="${project.backgroundImage || ''}" data-project-type="reference" data-project-index="${index}" onclick="openProjectModal('reference', ${index})">
                        <div class="card-body">
                            <div class="service-icon">
                                <i class="${project.icon}"></i>
                            </div>
                            <h4 class="service-title">${project.title}</h4>
                            <button class="service-details-btn" onclick="event.stopPropagation(); openProjectModal('reference', ${index})">
                                ${this.getDetailsButtonText()}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="container">
                <div class="text-center mb-5">
                    <h2 class="section-title">${projects.title}</h2>
                    <p class="section-subtitle" style="text-align: justify;">${projects.subtitle}</p>
                </div>
                
                <!-- Flagship Projects Section -->
                <div class="mb-5">
                    <div class="text-center mb-4">
                        <h3 class="subsection-title">${projects.flagshipProjects.title}</h3>
                        <p class="subsection-subtitle" style="text-align: justify;">${projects.flagshipProjects.subtitle}</p>
                    </div>
                    <div class="row">
                        ${flagshipHTML}
                    </div>
                </div>
                
                <!-- Key References Section -->
                <div class="mb-5">
                    <div class="text-center mb-4">
                        <h3 class="subsection-title">${projects.keyReferences.title}</h3>
                        <p class="subsection-subtitle" style="text-align: justify;">${projects.keyReferences.subtitle}</p>
                    </div>
                    <div class="row">
                        ${referencesHTML}
                    </div>
                </div>
            </div>
        `;
    }

    // Generate HTML for team members
    generateTeamHTML() {
        const teamData = window.textManager.getText('team');
        console.log('Team data:', teamData);
        if (!teamData || !teamData.members) {
            console.warn('No team data found');
            return '';
        }
        
        let html = `
            <h2 class="section-title">${teamData.title}</h2>
            <p class="mb-5 scroll-animate-fade" style="text-align: justify;">${teamData.subtitle}</p>
            <div class="row justify-content-center">
        `;
        
        teamData.members.forEach((member, index) => {
            console.log('Processing team member:', member.name, 'Icon:', member.icon);
            const hasImageExtension = member.icon && (member.icon.includes('.jpg') || member.icon.includes('.jpeg') || member.icon.includes('.png'));
            console.log('Has image extension:', hasImageExtension);
            
            html += `
                <div class="col-lg-5 col-md-6 col-sm-8 mb-4">
                    <div class="team-card" onclick="openTeamModal(${index})" data-member-index="${index}" style="cursor: pointer;">
                        <div class="team-image">
                            ${hasImageExtension ? 
                                `<img src="assets/img/${member.icon}" alt="${member.name}" class="img-fluid">` : 
                                `<div class="team-icon-placeholder">
                                    <i class="${member.icon || 'fas fa-user'} fa-4x"></i>
                                </div>`
                            }
                            <div class="team-overlay">
                                <div class="social-links">
                                    <a href="${member.linkedin || '#'}" class="social-link" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();"><i class="fab fa-linkedin"></i></a>
                                    ${member.github ? `<a href="${member.github}" class="social-link" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();"><i class="fab fa-github"></i></a>` : ''}
                                    <a href="${member.email ? 'mailto:' + member.email : '#'}" class="social-link" onclick="event.stopPropagation();"><i class="fas fa-envelope"></i></a>
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
            `;
        });
        
        html += `</div>`;
        
        console.log('Generated team HTML:', html);
        return html;
    }

    // Generate HTML for about section
    generateAboutHTML() {
        const aboutData = window.textManager.getText('about');
        if (!aboutData) {
            return '';
        }
        
        let html = `
            <div class="about-content">
                <h2 class="section-title">${aboutData.title}</h2>
                <!--<div class="text-center">
                    <img src="assets/img/logo.png" alt="Logo" class="img-fluid mb-12" style="max-width: 100px; height: auto;">
                </div>
                <h3 class="about-subtitle scroll-animate-fade text-center" style="color: var(--color-primary);">${aboutData.subtitle}</h3>
                <p class="lead scroll-animate-fade text-center" style="color: var(--color-primary);">${aboutData.description}</p>-->
                <p class="scroll-animate-fade" style="text-align: justify;">${aboutData.extendedDescription}</p>

                <div class="about-values">
                    <h4 class="section-title scroll-animate-fade text-center">${aboutData.visionTitle}</h4>
                    <p class="scroll-animate-fade" style="text-align: justify;">${aboutData.vision}</p>
                    <h4 class="section-title scroll-animate-fade text-center">${aboutData.missionTitle}</h4>
                    <p class="scroll-animate-fade" style="text-align: justify;">${aboutData.mission}</p>
                    <h4 class="about-subtitle scroll-animate-fade text-center">${aboutData.valuesTitle}</h4>
                    <div class="row">
        `;
        
        aboutData.values.forEach(value => {
            // Only render values that have icon and title (skip any navigation links)
            if (value.icon && value.title) {
                html += `
                    <div class="col-md-4 mb-3">
                        <div class="value-item text-center">
                            <i class="${value.icon} fa-2x mb-2" style="color: var(--primary-color);"></i>
                            <h5>${value.title}</h5>
                        </div>
                    </div>
                `;
            }
        });
        
        html += `
                    </div>
                </div>
            </div>
        `;
        
        return html;
    }

    // Generate HTML for Why Mecra section
    generateWhyMecraHTML() {
        const whyMecraData = window.textManager.getText('whyMecra');
        if (!whyMecraData) {
            return '';
        }
        
        let html = `
            <div class="why-mecra-content">
                <h2 class="section-title text-center">${whyMecraData.title}</h2>
                <p class="mb-5 scroll-animate-fade" style="text-align: justify;">${whyMecraData.subtitle}</p>
                <div class="row">
        `;
        
        whyMecraData.items.forEach((item, index) => {
            html += `
                <div class="col-lg-2 col-md-4 col-sm-6 mb-4">
                    <div class="why-mecra-item text-center h-100">
                        <div class="why-mecra-icon mb-3">
                            <i class="${item.icon} fa-3x" style="color: var(--primary-color);"></i>
                        </div>
                        <h5 class="why-mecra-title">${item.title}</h5>
                        <p class="why-mecra-description" style="text-align: justify;">${item.description}</p>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }

    // Generate HTML for patents section
    generatePatentsHTML() {
        console.log('Generating patents HTML...');
        
        if (!window.textManager || !window.textManager.isLoaded) {
            console.warn('TextManager not ready in generatePatentsHTML');
            return '<div class="patents-placeholder"><p>Loading patents information...</p></div>';
        }
        
        const patentsData = window.textManager.getText('patents');
        console.log('Patents data:', patentsData);
        
        if (!patentsData) {
            console.warn('Patents data not found');
            return '<div class="patents-placeholder"><p>Patents information not available</p></div>';
        }
        
        let html = `
            <div class="text-center mb-5" data-aos="fade-up">
                <h2 class="section-title">${patentsData.title}</h2>
                <p class="section-subtitle" style="text-align: justify;">${patentsData.subtitle}</p>
            </div>
            <div class="row">
        `;
        
        // Generate patent items
        patentsData.items.forEach((item, index) => {
            html += `
                <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="patent-item text-center h-100 p-4 border rounded">
                        <div class="patent-image mb-3">
                            <img src="${item.image}" alt="${item.title}" class="img-fluid rounded" style="max-height: 200px; object-fit: cover;">
                        </div>
                        <h5 class="patent-subtitle mb-3">${item.title}</h5>
                    </div>
                </div>
            `;
        });
        
        html += `
            </div>
        `;
        
        return html;
    }

    // Generate HTML for why-mecra section
    generateWhyMecraHTML() {
        console.log('Generating why-mecra HTML...');
        
        if (!window.textManager || !window.textManager.isLoaded) {
            console.warn('TextManager not ready in generateWhyMecraHTML');
            return '<div class="why-mecra-placeholder"><p>Loading why mecra information...</p></div>';
        }
        
        const whyMecraData = window.textManager.getText('whyMecra');
        console.log('Why Mecra data:', whyMecraData);
        
        if (!whyMecraData) {
            console.warn('Why Mecra data not found');
            return '<div class="why-mecra-placeholder"><p>Why Mecra information not available</p></div>';
        }
        
        let html = `
            <div class="text-center mb-5" data-aos="fade-up">
                <h2 class="section-title">${whyMecraData.title}</h2>
                <p class="section-subtitle" style="text-align: justify;">${whyMecraData.subtitle}</p>
            </div>
            <div class="row">
        `;
        
        // Generate why-mecra items
        whyMecraData.items.forEach((item, index) => {
            html += `
                <div class="col-lg-6 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="why-mecra-item text-center h-100">
                        <div class="why-mecra-icon mb-3">
                            <i class="${item.icon} fa-3x" style="color: var(--primary-color);"></i>
                        </div>
                        <h5 class="why-mecra-title">${item.title}</h5>
                        <p class="why-mecra-description" style="text-align: justify;">${item.description}</p>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }

}

// Initialize content manager
const contentManager = new ContentManager();

// Export for use in other scripts
window.ContentManager = ContentManager;
window.contentManager = contentManager;

// Console helper for content management
console.log('Content Manager loaded. All content is managed via texts.json');
console.log('Usage: contentManager.getContent("section_name")');
