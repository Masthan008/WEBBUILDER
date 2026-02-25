// Website Color Themes/Palettes

export const themes = [
    {
        id: "dark",
        name: "Dark Mode",
        description: "Modern dark theme with high contrast",
        colors: {
            primary: "#000000",
            secondary: "#1a1a1a",
            accent: "#ffffff",
            text: "#ffffff",
            textSecondary: "#a3a3a3",
            background: "#0a0a0a",
            border: "#333333"
        },
        preview: ["#000000", "#1a1a1a", "#ffffff"]
    },
    {
        id: "light",
        name: "Light Mode",
        description: "Clean light theme with soft colors",
        colors: {
            primary: "#ffffff",
            secondary: "#f5f5f5",
            accent: "#000000",
            text: "#000000",
            textSecondary: "#666666",
            background: "#fafafa",
            border: "#e5e5e5"
        },
        preview: ["#ffffff", "#f5f5f5", "#000000"]
    },
    {
        id: "ocean",
        name: "Ocean Blue",
        description: "Calm ocean-inspired blues",
        colors: {
            primary: "#0077be",
            secondary: "#00a8e8",
            accent: "#00d4ff",
            text: "#ffffff",
            textSecondary: "#b3e5fc",
            background: "#003d5c",
            border: "#0096c7"
        },
        preview: ["#0077be", "#00a8e8", "#00d4ff"]
    },
    {
        id: "sunset",
        name: "Sunset Glow",
        description: "Warm sunset colors",
        colors: {
            primary: "#ff6b6b",
            secondary: "#feca57",
            accent: "#ff9ff3",
            text: "#ffffff",
            textSecondary: "#ffe0e0",
            background: "#2d1b1b",
            border: "#ff8787"
        },
        preview: ["#ff6b6b", "#feca57", "#ff9ff3"]
    },
    {
        id: "forest",
        name: "Forest Green",
        description: "Natural forest greens",
        colors: {
            primary: "#2d6a4f",
            secondary: "#40916c",
            accent: "#95d5b2",
            text: "#ffffff",
            textSecondary: "#d8f3dc",
            background: "#1b4332",
            border: "#52b788"
        },
        preview: ["#2d6a4f", "#40916c", "#95d5b2"]
    },
    {
        id: "purple",
        name: "Royal Purple",
        description: "Elegant purple tones",
        colors: {
            primary: "#6a0dad",
            secondary: "#9d4edd",
            accent: "#c77dff",
            text: "#ffffff",
            textSecondary: "#e0aaff",
            background: "#3c096c",
            border: "#7b2cbf"
        },
        preview: ["#6a0dad", "#9d4edd", "#c77dff"]
    },
    {
        id: "minimal",
        name: "Minimal Gray",
        description: "Sophisticated grayscale",
        colors: {
            primary: "#2c2c2c",
            secondary: "#4a4a4a",
            accent: "#808080",
            text: "#ffffff",
            textSecondary: "#b3b3b3",
            background: "#1a1a1a",
            border: "#666666"
        },
        preview: ["#2c2c2c", "#4a4a4a", "#808080"]
    },
    {
        id: "candy",
        name: "Candy Pop",
        description: "Vibrant candy colors",
        colors: {
            primary: "#ff006e",
            secondary: "#fb5607",
            accent: "#ffbe0b",
            text: "#ffffff",
            textSecondary: "#ffccd5",
            background: "#8338ec",
            border: "#ff006e"
        },
        preview: ["#ff006e", "#fb5607", "#ffbe0b"]
    },
    {
        id: "midnight",
        name: "Midnight Blue",
        description: "Deep midnight blues",
        colors: {
            primary: "#03045e",
            secondary: "#023e8a",
            accent: "#0077b6",
            text: "#ffffff",
            textSecondary: "#90e0ef",
            background: "#01012b",
            border: "#0096c7"
        },
        preview: ["#03045e", "#023e8a", "#0077b6"]
    },
    {
        id: "autumn",
        name: "Autumn Leaves",
        description: "Warm autumn palette",
        colors: {
            primary: "#d62828",
            secondary: "#f77f00",
            accent: "#fcbf49",
            text: "#ffffff",
            textSecondary: "#ffd6a5",
            background: "#6a040f",
            border: "#dc2f02"
        },
        preview: ["#d62828", "#f77f00", "#fcbf49"]
    },
    {
        id: "neon",
        name: "Neon Nights",
        description: "Electric neon colors",
        colors: {
            primary: "#00ff41",
            secondary: "#00d9ff",
            accent: "#ff00ff",
            text: "#ffffff",
            textSecondary: "#b3ffb3",
            background: "#0a0a0a",
            border: "#00ff41"
        },
        preview: ["#00ff41", "#00d9ff", "#ff00ff"]
    },
    {
        id: "pastel",
        name: "Soft Pastel",
        description: "Gentle pastel tones",
        colors: {
            primary: "#a8dadc",
            secondary: "#f1faee",
            accent: "#e63946",
            text: "#1d3557",
            textSecondary: "#457b9d",
            background: "#f8f9fa",
            border: "#dee2e6"
        },
        preview: ["#a8dadc", "#f1faee", "#e63946"]
    }
]

// Apply theme to HTML code
export const applyThemeToCode = (htmlCode, theme) => {
    const colors = theme.colors
    
    // Create CSS variable replacements
    const cssVariables = `
    :root {
        --primary-color: ${colors.primary};
        --secondary-color: ${colors.secondary};
        --accent-color: ${colors.accent};
        --text-color: ${colors.text};
        --text-secondary: ${colors.textSecondary};
        --background-color: ${colors.background};
        --border-color: ${colors.border};
    }
    `
    
    // Find the style tag and inject variables at the beginning
    const styleRegex = /(<style[^>]*>)([\s\S]*?)(<\/style>)/i
    
    if (styleRegex.test(htmlCode)) {
        return htmlCode.replace(styleRegex, (match, openTag, content, closeTag) => {
            return `${openTag}${cssVariables}${content}${closeTag}`
        })
    } else {
        // If no style tag exists, create one
        const headRegex = /(<head[^>]*>)/i
        if (headRegex.test(htmlCode)) {
            return htmlCode.replace(headRegex, `$1<style>${cssVariables}</style>`)
        }
    }
    
    return htmlCode
}

// Extract dominant colors from HTML code (for preview)
export const extractColorsFromCode = (htmlCode) => {
    const colorRegex = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\)/g
    const matches = htmlCode.match(colorRegex) || []
    
    // Get unique colors
    const uniqueColors = [...new Set(matches)].slice(0, 5)
    return uniqueColors
}
