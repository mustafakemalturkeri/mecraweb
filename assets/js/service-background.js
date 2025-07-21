// Service Card Background Image Handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('🖼️ Service background handler loaded');
    
    // Service kartlarını bul ve background imageleri ayarla
    const serviceCards = document.querySelectorAll('.service-card[data-bg-image]');
    console.log(`🔍 Found ${serviceCards.length} service cards with background images`);
    
    serviceCards.forEach((card, index) => {
        const bgImage = card.getAttribute('data-bg-image');
        console.log(`🎯 Card ${index}: ${bgImage}`);
        
        if (bgImage && bgImage.trim() !== '') {
            // Test if image exists
            const img = new Image();
            img.onload = function() {
                console.log(`✅ Image loaded successfully: ${bgImage}`);
            };
            img.onerror = function() {
                console.error(`❌ Failed to load image: ${bgImage}`);
            };
            img.src = bgImage;
            
            // Hover event'lerini ekle
            card.addEventListener('mouseenter', function() {
                console.log(`🎯 Hovering card with image: ${bgImage}`);
                this.style.backgroundImage = `url('${bgImage}')`;
                this.style.backgroundSize = 'cover';
                this.style.backgroundPosition = 'center';
                this.style.backgroundRepeat = 'no-repeat';
                this.classList.add('has-background-image');
                console.log(`🎨 Applied background: ${this.style.backgroundImage}`);
            });
            
            card.addEventListener('mouseleave', function() {
                console.log(`👋 Left card, removing background`);
                this.style.backgroundImage = '';
                this.style.backgroundSize = '';
                this.style.backgroundPosition = '';
                this.style.backgroundRepeat = '';
                this.classList.remove('has-background-image');
            });
        } else {
            console.warn(`⚠️ No background image for card ${index}`);
        }
    });
});
