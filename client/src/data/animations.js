// Animation Library - Pre-built animations for websites

export const animationCategories = [
    { id: 'all', name: 'All Animations', icon: '✨' },
    { id: 'entrance', name: 'Entrance', icon: '🎬' },
    { id: 'scroll', name: 'Scroll Effects', icon: '📜' },
    { id: 'hover', name: 'Hover Effects', icon: '👆' },
    { id: 'background', name: 'Backgrounds', icon: '🎨' },
    { id: 'text', name: 'Text Effects', icon: '📝' },
    { id: 'advanced', name: 'Advanced', icon: '🚀' }
]

export const animations = [
    // ENTRANCE ANIMATIONS
    {
        id: 'fade-in',
        name: 'Fade In',
        category: 'entrance',
        description: 'Smooth fade-in effect on page load',
        preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add fade-in animation to all main sections. Elements should start invisible (opacity: 0) and fade in smoothly (opacity: 1) over 0.8 seconds when the page loads. Use CSS animations with @keyframes.'
    },
    {
        id: 'slide-up',
        name: 'Slide Up',
        category: 'entrance',
        description: 'Elements slide up from bottom',
        preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add slide-up animation to sections. Elements should start 50px below their final position and slide up smoothly over 0.6 seconds. Add staggered delays (0.1s, 0.2s, 0.3s) for multiple elements.'
    },
    {
        id: 'zoom-in',
        name: 'Zoom In',
        category: 'entrance',
        description: 'Scale up from small to normal',
        preview: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add zoom-in animation to cards and images. Elements should start at scale(0.8) and zoom to scale(1) over 0.5 seconds with ease-out timing. Add subtle fade-in effect.'
    },
    {
        id: 'bounce-in',
        name: 'Bounce In',
        category: 'entrance',
        description: 'Playful bounce entrance',
        preview: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add bounce-in animation to buttons and CTAs. Use CSS keyframes to create a bouncing effect: scale from 0 to 1.1, then settle at 1. Duration: 0.8s with cubic-bezier easing.'
    },

    // SCROLL ANIMATIONS
    {
        id: 'scroll-fade',
        name: 'Scroll Fade In',
        category: 'scroll',
        description: 'Fade in elements on scroll',
        preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add scroll-triggered fade-in animations. Use Intersection Observer API to detect when elements enter viewport, then add a CSS class that fades them in. Elements should be invisible until scrolled into view.'
    },
    {
        id: 'scroll-slide',
        name: 'Scroll Slide',
        category: 'scroll',
        description: 'Slide in from sides on scroll',
        preview: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add scroll-triggered slide animations. Odd sections slide from left, even sections from right. Use Intersection Observer to trigger animations when 20% of element is visible. Smooth 0.8s transitions.'
    },
    {
        id: 'parallax-scroll',
        name: 'Parallax Scrolling',
        category: 'scroll',
        description: 'Background moves slower than content',
        preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add parallax scrolling effect to hero section background. Use JavaScript to move background image at 50% of scroll speed. Create depth illusion with smooth transform: translateY().'
    },
    {
        id: 'scroll-reveal',
        name: 'Progressive Reveal',
        category: 'scroll',
        description: 'Reveal content progressively',
        preview: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add progressive reveal animation. Content sections appear one by one as user scrolls. Each section slides up and fades in with 0.2s stagger delay. Use Intersection Observer for triggering.'
    },

    // HOVER EFFECTS
    {
        id: 'hover-lift',
        name: 'Lift on Hover',
        category: 'hover',
        description: 'Cards lift up with shadow',
        preview: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add hover lift effect to all cards. On hover, card should move up 8px (translateY(-8px)) and shadow should increase. Smooth 0.3s transition with ease-out timing.'
    },
    {
        id: 'hover-scale',
        name: 'Scale on Hover',
        category: 'hover',
        description: 'Zoom in on hover',
        preview: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add scale hover effect to images and buttons. Elements should scale to 1.05 on hover with smooth 0.3s transition. Add overflow: hidden to parent containers to prevent overflow.'
    },
    {
        id: 'hover-glow',
        name: 'Glow Effect',
        category: 'hover',
        description: 'Glowing border on hover',
        preview: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add glow effect to buttons and links. On hover, add a glowing box-shadow with brand color. Animate shadow spread and opacity. Duration: 0.3s with ease-in-out.'
    },
    {
        id: 'hover-tilt',
        name: '3D Tilt',
        category: 'hover',
        description: '3D perspective tilt effect',
        preview: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add 3D tilt effect to cards. Use transform: perspective() and rotateX/rotateY based on mouse position. Smooth transitions with transform-style: preserve-3d. Add subtle shadow for depth.'
    },

    // BACKGROUND ANIMATIONS
    {
        id: 'gradient-shift',
        name: 'Gradient Animation',
        category: 'background',
        description: 'Animated gradient background',
        preview: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add animated gradient background to hero section. Use CSS keyframes to shift gradient colors smoothly. Create 3-4 color stops that move continuously. Animation duration: 15s, infinite loop.'
    },
    {
        id: 'floating-shapes',
        name: 'Floating Shapes',
        category: 'background',
        description: 'Animated floating geometric shapes',
        preview: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add floating geometric shapes to background. Create 5-6 circles/squares with different sizes. Animate them floating up and down at different speeds using CSS keyframes. Use opacity and blur for depth.'
    },
    {
        id: 'particles',
        name: 'Particle Effect',
        category: 'background',
        description: 'Animated particle background',
        preview: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add particle animation to background. Create small dots that move slowly in random directions. Use CSS animations with different durations and delays. Keep it subtle with low opacity.'
    },
    {
        id: 'wave-animation',
        name: 'Wave Animation',
        category: 'background',
        description: 'Animated wave pattern',
        preview: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add animated wave pattern at section dividers. Use SVG waves with CSS animation to create flowing motion. Multiple layers with different speeds for depth. Smooth, continuous loop.'
    },

    // TEXT EFFECTS
    {
        id: 'typing-effect',
        name: 'Typing Animation',
        category: 'text',
        description: 'Text appears as if being typed',
        preview: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add typing animation to main heading. Text should appear character by character with blinking cursor. Use CSS animation with steps() timing function. Duration: 3s with 0.5s cursor blink.'
    },
    {
        id: 'text-reveal',
        name: 'Text Reveal',
        category: 'text',
        description: 'Text reveals from behind mask',
        preview: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add text reveal animation. Text is hidden behind a colored overlay that slides away to reveal the text. Use clip-path or transform with overflow hidden. Smooth 1s animation.'
    },
    {
        id: 'glitch-text',
        name: 'Glitch Effect',
        category: 'text',
        description: 'Digital glitch text effect',
        preview: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add glitch effect to heading. Create RGB split effect with pseudo-elements. Animate clip-path and transform for glitchy appearance. Trigger on hover or loop continuously. Duration: 0.3s.'
    },
    {
        id: 'gradient-text',
        name: 'Gradient Text',
        category: 'text',
        description: 'Animated gradient text',
        preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add animated gradient to text. Use background-clip: text with animated gradient background. Gradient should shift colors smoothly. Create eye-catching effect for headings. Animation: 3s infinite.'
    },

    // ADVANCED ANIMATIONS
    {
        id: 'morphing-shapes',
        name: 'Morphing Shapes',
        category: 'advanced',
        description: 'SVG shape morphing animation',
        preview: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add morphing shape animation using SVG. Create shapes that smoothly transform between different forms (circle to square to triangle). Use CSS or SMIL animation. Duration: 4s, infinite loop.'
    },
    {
        id: 'loading-skeleton',
        name: 'Skeleton Loading',
        category: 'advanced',
        description: 'Shimmer loading effect',
        preview: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add skeleton loading animation. Create placeholder boxes with shimmer effect that moves across. Use linear-gradient with animation. Perfect for loading states. Smooth, continuous animation.'
    },
    {
        id: 'page-transition',
        name: 'Page Transitions',
        category: 'advanced',
        description: 'Smooth page/section transitions',
        preview: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add smooth page transitions. When navigating between sections, add fade-out/fade-in effect with slide animation. Use CSS transitions and JavaScript for triggering. Duration: 0.5s.'
    },
    {
        id: 'stagger-animation',
        name: 'Stagger Animation',
        category: 'advanced',
        description: 'Sequential element animation',
        preview: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=400&q=80',
        prompt: 'Add stagger animation to list items or grid elements. Each item animates in sequence with 0.1s delay between them. Use CSS animation-delay or JavaScript for dynamic lists. Smooth fade-in and slide-up.'
    }
]

// Get animations by category
export const getAnimationsByCategory = (categoryId) => {
    if (categoryId === 'all') return animations
    return animations.filter(a => a.category === categoryId)
}

// Search animations
export const searchAnimations = (query) => {
    const lowerQuery = query.toLowerCase()
    return animations.filter(a => 
        a.name.toLowerCase().includes(lowerQuery) ||
        a.description.toLowerCase().includes(lowerQuery) ||
        a.category.toLowerCase().includes(lowerQuery)
    )
}

// Animation complexity levels
export const getAnimationComplexity = (animationId) => {
    const simple = ['fade-in', 'slide-up', 'hover-lift', 'hover-scale']
    const medium = ['zoom-in', 'bounce-in', 'scroll-fade', 'scroll-slide', 'hover-glow', 'gradient-shift']
    const advanced = ['parallax-scroll', 'hover-tilt', 'morphing-shapes', 'page-transition', 'stagger-animation']
    
    if (simple.includes(animationId)) return { level: 'Simple', color: 'green' }
    if (medium.includes(animationId)) return { level: 'Medium', color: 'yellow' }
    if (advanced.includes(animationId)) return { level: 'Advanced', color: 'red' }
    return { level: 'Medium', color: 'yellow' }
}
