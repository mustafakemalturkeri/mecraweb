# Mecra Water and Environmental Technologies R&D Co. Inc. - Corporate Website

A modern, responsive corporate website for Mecra Water and Environment Technologies R&D Company, showcasing their services, projects, team, and innovations in water management and environmental engineering.

**This project also serves as a comprehensive template for building JSON-driven websites.** The entire content structure is managed through JSON files, making it easy to adapt for other companies or projects by simply modifying the content files without touching the core code.

## 🔧 Using as a Template

This website architecture is designed to be easily adaptable for other corporate websites. Here's how you can use it as a template:

### Quick Template Setup
1. **Fork or download** this repository
2. **Replace content** in `data/texts.json` and `data/texts_en.json` with your own
3. **Update images** in the `assets/img/` directory
4. **Modify colors/styling** in `assets/css/main.css` if needed
5. **Deploy** to your preferred hosting platform

### Content Customization
The JSON-based content system allows you to easily customize:
- **Company information** (name, description, contact details)
- **Navigation menu** items and links
- **Services** offered by your company
- **Team members** and their profiles
- **Projects/portfolio** items
- **About section** content (vision, mission, values)
- **Hero section** messaging and call-to-action buttons

### Template Benefits
- ✅ **No coding required** for content changes
- ✅ **Multilingual ready** - just add more JSON files
- ✅ **Responsive design** works on all devices
- ✅ **Modern web technologies** (Bootstrap 5, ES6+)
- ✅ **SEO optimized** structure
- ✅ **Performance optimized** loading
- ✅ **Easy deployment** to GitHub Pages or any static host

## 🌐 Live Website

The website is hosted on GitHub Pages using our own domain: [https://mecra.tech](https://mecra.tech)

## 🚀 Features

- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Multilingual Support**: Turkish (TR) and English (EN) language options
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Interactive Components**: 
  - Service detail modals
  - Project showcases
  - Team member profiles
  - Contact forms
- **Performance Optimized**: Optimized images and efficient loading
- **SEO Friendly**: Proper meta tags and semantic HTML structure

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup structure
- **CSS3**: Custom styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Modern JavaScript features
- **Bootstrap 5.3.2**: Responsive framework
- **Font Awesome 6.4.0**: Icon library
- **AOS (Animate On Scroll)**: Animation library

### Fonts
- **Montserrat**: Primary font family from Google Fonts

### Hosting
- **GitHub Pages**: Static site hosting

## 📁 Project Structure

```
mecraweb/
├── assets/
│   ├── css/
│   │   └── main.css           # Main stylesheet
│   ├── img/                   # Image assets
│   │   ├── logo.png
│   │   ├── hero-image.png
│   │   ├── services-*.png
│   │   ├── reference-*.png
│   │   └── team photos
│   └── js/
│       ├── main.js            # Main JavaScript functionality
│       ├── content-manager.js # Content generation and management
│       ├── content-loader.js  # Dynamic content loading
│       ├── text-manager.js    # Language management
│       ├── scroll-animations.js # Scroll animations
│       └── service-background.js # Service card backgrounds
├── data/
│   ├── texts.json            # Turkish content
│   └── texts_en.json         # English content
├── text_to_json/            # Content conversion tools
├── index.html               # Main HTML file
├── CNAME                    # GitHub Pages custom domain
└── README.md               # This file
```

## 🎨 Design Features

### Color Scheme
- Primary: Deep teal/blue tones
- Secondary: Complementary accent colors
- Background: Clean whites and subtle grays

### Typography
- **Primary Font**: Montserrat (Google Fonts)
- **Weights**: 100-900 (thin to black)
- **Styles**: Regular and italic variants

### Animations
- Smooth scroll navigation
- Fade-in animations on scroll
- Hover effects on interactive elements
- Hero section animations

## 🌍 Multilingual System

The website supports Turkish and English languages through a JSON-based content management system. **This architecture makes it perfect for creating multilingual websites for any business or organization.**

- **Turkish**: `data/texts.json`
- **English (Default)**: `data/texts_en.json`

### Adding More Languages
To add additional languages (e.g., German, French, Spanish):
1. Create a new JSON file: `data/texts_de.json`, `data/texts_fr.json`, etc.
2. Copy the structure from `texts_en.json`
3. Translate all content values
4. Add the language button to the navigation in `index.html`
5. Update the language switcher in `text-manager.js`

### Content Structure
Each language file contains structured content for:
- Site metadata (title, description, keywords)
- Navigation menu items
- Hero section (title, subtitle, buttons)
- Services (descriptions, icons, details)
- Projects (Flagship and References with images)
- Team information (names, positions, photos, contact)
- About section (vision, mission, values)
- Footer content (contact info, copyright)

### Template Adaptation Guide
When using this as a template for your own website:

1. **Replace Company Information**:
   ```json
   "site": {
     "title": "Your Company Name",
     "description": "Your company description",
     "keywords": "your, relevant, keywords"
   }
   ```

2. **Update Navigation**:
   ```json
   "navigation": {
     "brand": "YourBrand",
     "items": [
       {"href": "#home", "text": "Home"},
       {"href": "#about", "text": "About"},
       // Add your menu items
     ]
   }
   ```

3. **Customize Services**:
   ```json
   "services": {
     "title": "Our Services",
     "items": [
       {
         "title": "Your Service",
         "description": "Service description",
         "icon": "fas fa-your-icon"
       }
     ]
   }
   ```

4. **Add Your Team**:
   ```json
   "team": {
     "members": [
       {
         "name": "Team Member Name",
         "position": "Position",
         "description": "Bio",
         "icon": "photo.jpg",
         "linkedin": "linkedin-url",
         "email": "email@company.com"
       }
     ]
   }
   ```

## 📱 Responsive Design

The website is fully responsive with breakpoints for:
- **Mobile**: < 768px
- **Tablet**: 768px - 992px
- **Desktop**: > 992px

### Mobile Features
- Collapsible navigation menu
- Touch-friendly interactions
- Optimized images and loading
- Mobile-specific animations

## 🔧 Development

### Prerequisites
- Modern web browser
- Code editor (VS Code recommended)
- Local web server (for development)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/mustafakemalturkeri/mecraweb.git
   cd mecraweb
   ```

2. Open with a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using VS Code Live Server extension
   # Right-click index.html → "Open with Live Server"
   ```

3. Open `http://localhost:8000` in your browser

### File Organization

#### JavaScript Modules
- **main.js**: Core functionality, event handlers, utilities
- **content-manager.js**: HTML generation for different sections
- **content-loader.js**: Dynamic content loading and section management
- **text-manager.js**: Language switching and text management
- **scroll-animations.js**: Scroll-based animations
- **service-background.js**: Dynamic background management for service cards

#### CSS Structure
- Organized with clear sections for different components
- CSS custom properties for consistent theming
- Media queries for responsive design
- Animation keyframes for smooth transitions

## 🚀 Deployment

The website is automatically deployed to GitHub Pages:

1. Push changes to the `main` branch
2. GitHub Actions automatically builds and deploys
3. Changes are live at the custom domain

### Custom Domain
The website uses a custom domain configured via the `CNAME` file.

## 📊 Performance

### Optimizations
- **Image Optimization**: Compressed images for faster loading
- **CSS Minification**: Optimized stylesheets
- **JavaScript Efficiency**: Modern ES6+ features and efficient DOM manipulation
- **Lazy Loading**: Content loaded as needed
- **CDN Usage**: Bootstrap and Font Awesome loaded from CDN

### Loading Strategy
- Critical CSS inlined
- Non-critical resources loaded asynchronously
- Images optimized for web delivery

## 🎯 Sections Overview

### Hero Section
- Company introduction
- Call-to-action buttons
- Animated elements

### Team Section
- Team member profiles
- Professional photos
- Contact information

### Services Section
- Service categories with icons
- Detailed service descriptions
- Interactive service cards

### Projects Section
- **Flagship Projects**: Major company projects
- **Key References**: Notable client references
- Project details and achievements

### About Section
- Company vision and mission
- Core values
- Company background

### Footer
- Contact information
- Company details
- Copyright information

## 🔄 Content Management

### Using as a Website Template

This project is designed to be easily adaptable as a template for other corporate websites. The JSON-based content system means you can create a completely new website by only modifying the content files.

#### Step-by-Step Template Customization:

1. **Content Replacement**:
   - Edit `data/texts.json` (primary language)
   - Edit `data/texts_en.json` (English version)
   - Follow the existing JSON structure
   - Replace all text content with your company's information

2. **Image Replacement**:
   - Replace images in `assets/img/` with your company's images
   - Keep the same filenames or update references in JSON files
   - Optimize images for web (recommended: WebP format, compressed)

3. **Styling Customization** (Optional):
   - Modify `assets/css/main.css` for brand colors
   - Update CSS custom properties for consistent theming
   - Adjust fonts if needed

4. **Domain Configuration**:
   - Update `CNAME` file with your domain
   - Configure DNS settings for your domain

### Adding New Content
1. Edit the appropriate JSON file (`texts.json` or `texts_en.json`)
2. Follow the existing structure
3. Test both language versions
4. Commit and push changes

### Image Management
- Place images in the `assets/img/` directory
- Use descriptive filenames
- Optimize images before adding
- Update references in JSON files

### Template Examples
This template structure is suitable for:
- **Corporate websites** (like this Mecra example)
- **Consulting firms** - replace services with consulting areas
- **Tech companies** - emphasize products and technology
- **Creative agencies** - showcase portfolio and team creativity
- **Professional services** - lawyers, doctors, architects
- **Non-profit organizations** - highlight mission and impact
- **Startups** - focus on innovation and team
- **Educational institutions** - programs, faculty, facilities

### Content Types Supported
The template handles these content types out of the box:
- ✅ Company/organization information
- ✅ Service/product listings with detailed descriptions
- ✅ Team member profiles with photos and contact info
- ✅ Project/portfolio showcases
- ✅ Client testimonials and references
- ✅ Contact forms and information
- ✅ Multi-page navigation
- ✅ Social media integration
- ✅ SEO-optimized content structure

## 🐛 Browser Compatibility

Compatible with:
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile browsers**: iOS Safari, Chrome Mobile

## 📞 Contact & Support

For technical issues or questions about the website:
- **Repository**: [GitHub Issues](https://github.com/mustafakemalturkeri/mecraweb/issues)
- **Company Website**: [Mecra Tech](https://mecra.tech)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### License Summary
- ✅ **Commercial use** - Use this template for commercial projects
- ✅ **Modification** - Modify and adapt the code as needed
- ✅ **Distribution** - Share and distribute the template
- ✅ **Private use** - Use for private/internal projects
- ℹ️ **Attribution required** - Include the original copyright notice
- ℹ️ **No warranty** - Software is provided "as is"

This permissive license allows you to use this template freely for any purpose, including commercial projects, while maintaining attribution to the original creators.

## 🙏 Acknowledgments

- **Bootstrap Team**: For the excellent CSS framework
- **Font Awesome**: For the comprehensive icon library
- **AOS Library**: For smooth scroll animations
- **Google Fonts**: For the Montserrat font family

---

**Mecra Su ve Çevre Teknolojileri ARGE A.Ş.**  
Leading solutions in water management and environmental engineering
