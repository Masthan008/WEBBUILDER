// Image Generation - DUAL PROVIDER SYSTEM (Bytez + Pollinations)

const imageModels = {
    // Bytez AI Models (requires API key, paid)
    bytez: [
        "stabilityai/stable-diffusion-xl-base-1.0",
        "openai/dall-e-2",
        "openai/dall-e-3",
        "stable-diffusion-v1-5/stable-diffusion-v1-5",
        "google/imagen-4.0-ultra-generate-001",
        "google/imagen-4.0-generate-001"
    ],
    // Pollinations AI Models (FREE, no API key needed!)
    pollinations: [
        "flux",
        "flux-realism",
        "flux-anime",
        "flux-3d",
        "turbo"
    ]
}

const defaultBytezModel = "stable-diffusion-v1-5/stable-diffusion-v1-5"
const defaultPollinationsModel = "flux"

/**
 * Generate image using Pollinations AI - FREE & INSTANT
 * No API key needed, instant URL generation
 * @param {string} prompt - Description of the image
 * @param {string} model - Model to use (default: flux)
 * @returns {string} - Image URL (instant)
 */
export const generatePollinationsImage = (prompt, model = defaultPollinationsModel) => {
    console.log(`[Pollinations] Generating with ${model}`)
    
    const cleanPrompt = prompt.trim().substring(0, 500)
    const encodedPrompt = encodeURIComponent(cleanPrompt)
    
    // Pollinations URL with parameters
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=800&model=${model}&nologo=true&enhance=true`
    
    console.log(`[Pollinations] Generated URL instantly`)
    return url
}

/**
 * Generate image using Bytez AI - PAID
 * Requires BYTEZ_API_KEY
 * @param {string} prompt - Description of the image
 * @param {string} model - Model to use
 * @returns {Promise<string>} - Image URL
 */
export const generateBytezImage = async (prompt, model = defaultBytezModel) => {
    const apiKey = process.env.BYTEZ_API_KEY
    
    if (!apiKey) {
        throw new Error('Bytez API key not found')
    }

    try {
        console.log(`[Bytez] Generating with ${model}`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 60000)

        const response = await fetch('https://api.bytez.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                response_format: "url"
            }),
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            const error = await response.text()
            console.error('[Bytez] API error:', response.status)
            throw new Error(`Bytez error: ${response.status}`)
        }

        const data = await response.json()
        
        if (!data.data || data.data.length === 0) {
            throw new Error('No image generated')
        }

        console.log('[Bytez] Generated successfully')
        return data.data[0].url

    } catch (error) {
        console.error('[Bytez] Error:', error.message)
        throw error
    }
}

/**
 * Generate multiple images - DUAL PROVIDER with smart fallback
 * @param {Array<string>} prompts - Array of image descriptions
 * @param {string} provider - 'pollinations' (free, default) or 'bytez' (paid)
 * @returns {Promise<Array<string>>} - Array of image URLs
 */
export const generateMultipleImages = async (prompts, provider = 'pollinations') => {
    const limitedPrompts = prompts.slice(0, 3) // Max 3 images
    
    console.log(`[Image Gen] Generating ${limitedPrompts.length} images using ${provider}`)
    
    if (provider === 'pollinations') {
        // Pollinations: Instant, no API calls
        const images = limitedPrompts.map(prompt => 
            generatePollinationsImage(prompt, defaultPollinationsModel)
        )
        console.log(`[Pollinations] Generated ${images.length} images instantly (FREE)`)
        return images
    } else {
        // Bytez: Parallel generation with Pollinations fallback
        const imagePromises = limitedPrompts.map(async (prompt) => {
            try {
                return await generateBytezImage(prompt, defaultBytezModel)
            } catch (error) {
                console.error(`[Bytez] Failed, using Pollinations fallback`)
                return generatePollinationsImage(prompt, defaultPollinationsModel)
            }
        })
        
        const images = await Promise.all(imagePromises)
        console.log(`[Image Gen] Generated ${images.length} images`)
        return images
    }
}

/**
 * Extract image requirements from user prompt
 * @param {string} userPrompt - User's website description
 * @returns {Array<string>} - Array of image prompts (max 3)
 */
export const extractImageRequirements = (userPrompt) => {
    const imagePrompts = []
    const lowerPrompt = userPrompt.toLowerCase()
    
    // Check if user wants AI images
    const wantsImages = 
        lowerPrompt.includes('ai image') ||
        lowerPrompt.includes('ai-generated') ||
        lowerPrompt.includes('generate image') ||
        lowerPrompt.includes('custom image') ||
        lowerPrompt.includes('create image')
    
    if (!wantsImages) {
        return imagePrompts
    }

    // Generate prompts based on website type
    if (lowerPrompt.includes('portfolio')) {
        imagePrompts.push(
            `Professional portfolio hero image, modern minimalist design`,
            `Creative workspace with laptop, clean aesthetic`
        )
    } else if (lowerPrompt.includes('restaurant') || lowerPrompt.includes('food')) {
        imagePrompts.push(
            `Gourmet food plating, professional photography`,
            `Modern restaurant interior, elegant design`
        )
    } else if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('shop')) {
        imagePrompts.push(
            `Product photography, clean white background`,
            `Modern shopping experience, minimalist design`
        )
    } else if (lowerPrompt.includes('blog')) {
        imagePrompts.push(
            `Blog header image, modern clean design`,
            `Writing workspace, minimalist aesthetic`
        )
    } else {
        imagePrompts.push(
            `Modern website hero image, professional clean design`,
            `Abstract gradient background, modern colors`
        )
    }
    
    return imagePrompts
}

export const availableImageModels = imageModels
export { defaultBytezModel, defaultPollinationsModel }
