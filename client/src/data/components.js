// Reusable UI Components Library

export const componentCategories = [
    { id: 'all', name: 'All Components', icon: '📦' },
    { id: 'headers', name: 'Headers', icon: '🎯' },
    { id: 'heroes', name: 'Hero Sections', icon: '🚀' },
    { id: 'features', name: 'Features', icon: '⭐' },
    { id: 'testimonials', name: 'Testimonials', icon: '💬' },
    { id: 'pricing', name: 'Pricing Tables', icon: '💰' },
    { id: 'forms', name: 'Contact Forms', icon: '📧' },
    { id: 'footers', name: 'Footers', icon: '📍' },
    { id: 'cta', name: 'Call to Action', icon: '🎯' },
    { id: 'cards', name: 'Cards', icon: '🃏' }
]

export const components = [
    // HEADERS
    {
        id: 'header-modern',
        name: 'Modern Navigation',
        category: 'headers',
        description: 'Clean navigation with logo and menu',
        thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a modern navigation header with logo on the left, menu items (Home, About, Services, Contact) in the center, and a CTA button on the right. Make it sticky on scroll with a subtle shadow. Use smooth transitions.'
    },
    {
        id: 'header-minimal',
        name: 'Minimal Header',
        category: 'headers',
        description: 'Minimalist header with centered logo',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a minimal header with centered logo and simple text links below it. Clean, spacious design with lots of whitespace. Elegant typography.'
    },
    {
        id: 'header-sidebar',
        name: 'Sidebar Navigation',
        category: 'headers',
        description: 'Fixed sidebar navigation',
        thumbnail: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a fixed sidebar navigation on the left side with logo at top, vertical menu items, and social icons at bottom. Modern, dark theme with smooth hover effects.'
    },

    // HERO SECTIONS
    {
        id: 'hero-fullscreen',
        name: 'Fullscreen Hero',
        category: 'heroes',
        description: 'Full-screen hero with background image',
        thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a fullscreen hero section with a stunning background image, large heading, subheading, and two CTA buttons (primary and secondary). Add a subtle overlay for text readability. Include a scroll-down indicator.'
    },
    {
        id: 'hero-split',
        name: 'Split Hero',
        category: 'heroes',
        description: 'Split layout with text and image',
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a split hero section with text content on the left (heading, description, CTA button) and a large image or illustration on the right. Modern, clean design with good spacing.'
    },
    {
        id: 'hero-video',
        name: 'Video Background Hero',
        category: 'heroes',
        description: 'Hero with video background',
        thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a hero section with video background (use placeholder), overlay, centered text content, and CTA button. Include play/pause control for the video.'
    },
    {
        id: 'hero-animated',
        name: 'Animated Hero',
        category: 'heroes',
        description: 'Hero with animated elements',
        thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add an animated hero section with fade-in text, sliding images, and floating elements. Use CSS animations for smooth effects. Modern gradient background.'
    },

    // FEATURES
    {
        id: 'features-grid',
        name: '3-Column Features',
        category: 'features',
        description: 'Grid layout with icons',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a features section with 3 columns, each with an icon, heading, and description. Use a clean grid layout with hover effects. Modern, professional design.'
    },
    {
        id: 'features-alternating',
        name: 'Alternating Features',
        category: 'features',
        description: 'Image-text alternating layout',
        thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add alternating feature sections where image and text swap sides. First feature: image left, text right. Second: text left, image right. Continue pattern. Add smooth scroll animations.'
    },
    {
        id: 'features-cards',
        name: 'Feature Cards',
        category: 'features',
        description: 'Card-based feature showcase',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add feature cards in a 2x3 grid. Each card has an icon, title, description, and "Learn More" link. Cards have subtle shadows and hover lift effects.'
    },

    // TESTIMONIALS
    {
        id: 'testimonials-slider',
        name: 'Testimonial Slider',
        category: 'testimonials',
        description: 'Carousel with customer reviews',
        thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a testimonial slider with customer photo, quote, name, and company. Include navigation arrows and dots. Auto-play with smooth transitions.'
    },
    {
        id: 'testimonials-grid',
        name: 'Testimonial Grid',
        category: 'testimonials',
        description: 'Grid of customer reviews',
        thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a 3-column testimonial grid with customer photos, quotes, names, and star ratings. Clean card design with subtle shadows.'
    },
    {
        id: 'testimonials-video',
        name: 'Video Testimonials',
        category: 'testimonials',
        description: 'Video testimonial showcase',
        thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add video testimonial section with video thumbnails, play buttons, customer names, and quotes. Grid layout with hover effects.'
    },

    // PRICING
    {
        id: 'pricing-3col',
        name: '3-Tier Pricing',
        category: 'pricing',
        description: 'Classic 3-column pricing table',
        thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a 3-column pricing table (Basic, Pro, Enterprise) with plan names, prices, feature lists, and CTA buttons. Highlight the middle plan as "Most Popular" with a badge and different styling.'
    },
    {
        id: 'pricing-toggle',
        name: 'Monthly/Yearly Toggle',
        category: 'pricing',
        description: 'Pricing with billing toggle',
        thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add pricing section with monthly/yearly toggle switch. Show 3 pricing tiers that update when toggle is switched. Add "Save 20%" badge for yearly plans.'
    },
    {
        id: 'pricing-comparison',
        name: 'Feature Comparison',
        category: 'pricing',
        description: 'Detailed feature comparison table',
        thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a detailed pricing comparison table with features listed on the left and checkmarks/crosses for each plan. Include expandable sections for feature categories.'
    },

    // CONTACT FORMS
    {
        id: 'form-simple',
        name: 'Simple Contact Form',
        category: 'forms',
        description: 'Basic contact form',
        thumbnail: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a simple contact form with fields for name, email, subject, and message. Include a submit button with hover effect. Add form validation styling.'
    },
    {
        id: 'form-split',
        name: 'Split Contact Section',
        category: 'forms',
        description: 'Form with contact info sidebar',
        thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a split contact section: form on the left (name, email, message) and contact information on the right (address, phone, email, social links). Modern card design.'
    },
    {
        id: 'form-newsletter',
        name: 'Newsletter Signup',
        category: 'forms',
        description: 'Email subscription form',
        thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a newsletter signup section with heading, description, email input field, and subscribe button. Centered design with gradient background.'
    },

    // FOOTERS
    {
        id: 'footer-4col',
        name: '4-Column Footer',
        category: 'footers',
        description: 'Multi-column footer with links',
        thumbnail: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a 4-column footer with logo/description in first column, and link groups (Products, Company, Resources) in other columns. Include social icons and copyright at bottom.'
    },
    {
        id: 'footer-minimal',
        name: 'Minimal Footer',
        category: 'footers',
        description: 'Simple centered footer',
        thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a minimal footer with centered logo, horizontal link list, social icons, and copyright text. Clean, spacious design with subtle divider.'
    },
    {
        id: 'footer-newsletter',
        name: 'Footer with Newsletter',
        category: 'footers',
        description: 'Footer with email signup',
        thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add footer with newsletter signup at top, followed by 3 columns of links, social icons, and copyright. Include email input with subscribe button.'
    },

    // CALL TO ACTION
    {
        id: 'cta-centered',
        name: 'Centered CTA',
        category: 'cta',
        description: 'Full-width centered call to action',
        thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a full-width CTA section with gradient background, centered heading, description, and two buttons (primary and secondary). Add subtle animation on scroll.'
    },
    {
        id: 'cta-split',
        name: 'Split CTA',
        category: 'cta',
        description: 'Two-column call to action',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a split CTA section with text content on left (heading, description) and CTA button on right. Modern design with background color contrast.'
    },
    {
        id: 'cta-banner',
        name: 'Banner CTA',
        category: 'cta',
        description: 'Sticky banner call to action',
        thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a sticky banner CTA at the bottom of the page with message, CTA button, and close button. Slides up on scroll with smooth animation.'
    },

    // CARDS
    {
        id: 'cards-blog',
        name: 'Blog Cards',
        category: 'cards',
        description: 'Blog post card grid',
        thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add a 3-column blog card grid with featured image, category tag, title, excerpt, author info, and read time. Hover effects with image zoom.'
    },
    {
        id: 'cards-team',
        name: 'Team Cards',
        category: 'cards',
        description: 'Team member showcase',
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add team member cards in a 4-column grid with photo, name, role, and social links. Cards flip on hover to show bio on the back.'
    },
    {
        id: 'cards-product',
        name: 'Product Cards',
        category: 'cards',
        description: 'E-commerce product cards',
        thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add product cards with image, title, price, rating stars, and "Add to Cart" button. Include sale badge and wishlist icon. Hover effects with shadow lift.'
    }
]

// Get components by category
export const getComponentsByCategory = (categoryId) => {
    if (categoryId === 'all') return components
    return components.filter(c => c.category === categoryId)
}

// Search components
export const searchComponents = (query) => {
    const lowerQuery = query.toLowerCase()
    return components.filter(c => 
        c.name.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery) ||
        c.category.toLowerCase().includes(lowerQuery)
    )
}
