// SEO Analyzer Utility

export const analyzeSEO = (htmlCode) => {
    const issues = []
    const suggestions = []
    let score = 100

    // Parse HTML (basic parsing)
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlCode, 'text/html')

    // 1. Check for title tag
    const title = doc.querySelector('title')
    if (!title || !title.textContent.trim()) {
        issues.push({
            type: 'error',
            category: 'Title',
            message: 'Missing or empty <title> tag',
            impact: 'high',
            fix: 'Add a descriptive title tag in the <head> section'
        })
        score -= 15
    } else if (title.textContent.length < 30) {
        issues.push({
            type: 'warning',
            category: 'Title',
            message: 'Title tag is too short (less than 30 characters)',
            impact: 'medium',
            fix: 'Expand your title to 50-60 characters for better SEO'
        })
        score -= 5
    } else if (title.textContent.length > 60) {
        issues.push({
            type: 'warning',
            category: 'Title',
            message: 'Title tag is too long (more than 60 characters)',
            impact: 'medium',
            fix: 'Shorten your title to 50-60 characters'
        })
        score -= 5
    }

    // 2. Check for meta description
    const metaDescription = doc.querySelector('meta[name="description"]')
    if (!metaDescription || !metaDescription.getAttribute('content')?.trim()) {
        issues.push({
            type: 'error',
            category: 'Meta Tags',
            message: 'Missing meta description',
            impact: 'high',
            fix: 'Add <meta name="description" content="Your description"> in <head>'
        })
        score -= 15
    } else {
        const descLength = metaDescription.getAttribute('content').length
        if (descLength < 120) {
            issues.push({
                type: 'warning',
                category: 'Meta Tags',
                message: 'Meta description is too short',
                impact: 'medium',
                fix: 'Expand to 150-160 characters for better click-through rates'
            })
            score -= 5
        } else if (descLength > 160) {
            issues.push({
                type: 'warning',
                category: 'Meta Tags',
                message: 'Meta description is too long',
                impact: 'low',
                fix: 'Shorten to 150-160 characters to avoid truncation'
            })
            score -= 3
        }
    }

    // 3. Check for viewport meta tag (mobile-friendly)
    const viewport = doc.querySelector('meta[name="viewport"]')
    if (!viewport) {
        issues.push({
            type: 'error',
            category: 'Mobile',
            message: 'Missing viewport meta tag',
            impact: 'high',
            fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">'
        })
        score -= 10
    }

    // 4. Check for heading structure
    const h1Tags = doc.querySelectorAll('h1')
    if (h1Tags.length === 0) {
        issues.push({
            type: 'error',
            category: 'Headings',
            message: 'No <h1> heading found',
            impact: 'high',
            fix: 'Add one <h1> tag with your main page heading'
        })
        score -= 10
    } else if (h1Tags.length > 1) {
        issues.push({
            type: 'warning',
            category: 'Headings',
            message: `Multiple <h1> tags found (${h1Tags.length})`,
            impact: 'medium',
            fix: 'Use only one <h1> per page for better SEO'
        })
        score -= 5
    }

    // 5. Check for images without alt text
    const images = doc.querySelectorAll('img')
    const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt'))
    if (imagesWithoutAlt.length > 0) {
        issues.push({
            type: 'warning',
            category: 'Images',
            message: `${imagesWithoutAlt.length} image(s) missing alt text`,
            impact: 'medium',
            fix: 'Add descriptive alt attributes to all images for accessibility and SEO'
        })
        score -= Math.min(imagesWithoutAlt.length * 2, 10)
    }

    // 6. Check for meta charset
    const charset = doc.querySelector('meta[charset]')
    if (!charset) {
        issues.push({
            type: 'warning',
            category: 'Meta Tags',
            message: 'Missing charset declaration',
            impact: 'low',
            fix: 'Add <meta charset="UTF-8"> in <head>'
        })
        score -= 3
    }

    // 7. Check for Open Graph tags (social sharing)
    const ogTitle = doc.querySelector('meta[property="og:title"]')
    const ogDescription = doc.querySelector('meta[property="og:description"]')
    const ogImage = doc.querySelector('meta[property="og:image"]')
    
    if (!ogTitle || !ogDescription || !ogImage) {
        suggestions.push({
            type: 'info',
            category: 'Social Media',
            message: 'Add Open Graph tags for better social media sharing',
            fix: 'Add og:title, og:description, and og:image meta tags'
        })
        score -= 5
    }

    // 8. Check for semantic HTML
    const semanticTags = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer']
    const usedSemanticTags = semanticTags.filter(tag => doc.querySelector(tag))
    
    if (usedSemanticTags.length < 3) {
        suggestions.push({
            type: 'info',
            category: 'HTML Structure',
            message: 'Use more semantic HTML5 tags',
            fix: 'Use <header>, <nav>, <main>, <footer> for better structure'
        })
        score -= 3
    }

    // 9. Check for internal links
    const links = doc.querySelectorAll('a[href]')
    const internalLinks = Array.from(links).filter(link => {
        const href = link.getAttribute('href')
        return href && href.startsWith('#')
    })
    
    if (links.length > 0 && internalLinks.length === 0) {
        suggestions.push({
            type: 'info',
            category: 'Links',
            message: 'No internal links found',
            fix: 'Add internal links to improve navigation and SEO'
        })
    }

    // 10. Check for language attribute
    const htmlTag = doc.querySelector('html')
    if (!htmlTag || !htmlTag.getAttribute('lang')) {
        issues.push({
            type: 'warning',
            category: 'Accessibility',
            message: 'Missing language attribute on <html> tag',
            impact: 'low',
            fix: 'Add lang="en" (or appropriate language) to <html> tag'
        })
        score -= 3
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score)

    // Generate summary
    const errorCount = issues.filter(i => i.type === 'error').length
    const warningCount = issues.filter(i => i.type === 'warning').length
    const infoCount = suggestions.length

    return {
        score,
        grade: getGrade(score),
        issues,
        suggestions,
        summary: {
            errors: errorCount,
            warnings: warningCount,
            info: infoCount,
            total: errorCount + warningCount + infoCount
        }
    }
}

const getGrade = (score) => {
    if (score >= 90) return { letter: 'A', color: 'green', label: 'Excellent' }
    if (score >= 80) return { letter: 'B', color: 'blue', label: 'Good' }
    if (score >= 70) return { letter: 'C', color: 'yellow', label: 'Fair' }
    if (score >= 60) return { letter: 'D', color: 'orange', label: 'Poor' }
    return { letter: 'F', color: 'red', label: 'Critical' }
}

// Generate SEO improvement prompt for AI
export const generateSEOPrompt = (analysis) => {
    const criticalIssues = analysis.issues.filter(i => i.impact === 'high')
    
    if (criticalIssues.length === 0) {
        return "Optimize the website's SEO by improving meta tags, headings, and image alt text."
    }

    const fixes = criticalIssues.map(issue => issue.fix).join('. ')
    return `Improve SEO: ${fixes}. Keep all existing content and styling.`
}
