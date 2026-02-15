// Image Generation Provider Configuration using Bytez AI

const imageModels = [
    "stabilityai/stable-diffusion-xl-base-1.0",
    "openai/dall-e-2",
    "openai/dall-e-3",
    "stable-diffusion-v1-5/stable-diffusion-v1-5",
    "google/imagen-4.0-ultra-generate-001",
    "google/imagen-4.0-generate-001"
]

// Default model for image generation
const defaultImageModel = "stabilityai/stable-diffusion-xl-base-1.0"

/**
 * Generate an image using Bytez AI
 * @param {string} prompt - Description of the image to generate
 * @param {string} model - Model to use (optional, defaults to Stable Diffusion XL)
 * @returns {Promise<string>} - Base64 encoded image or URL
 */
export const generateImage = async (prompt, model = defaultImageModel) => {
    const apiKey = process.env.BYTEZ_API_KEY
    
    if (!apiKey) {
        throw new Error('Bytez API key not found. Image generation requires BYTEZ_API_KEY.')
    }

    try {
        console.log(`Generating image with ${model}:`, prompt)

        const response = await fetch('https://api.bytez.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                response_format: "url"
            })
        })

        if (!response.ok) {
            const error = await response.text()
            console.error('Bytez image generation error:', error)
            throw new Error(`Image generation failed: ${response.status}`)
        }

        const data = await response.json()
        
        if (!data.data || data.data.length === 0) {
            throw new Error('No image generated')
        }

        // Return the image URL
        return data.data[0].url

    } catch (error) {
        console.error('Image generation error:', error.message)
        throw error
    }
}

/**
 * Generate multiple images for a website project
 * @param {Array<string>} prompts - Array of image descriptions
 * @param {string} model - Model to use
 * @returns {Promise<Array<string>>} - Array of image URLs
 */
export const generateMultipleImages = async (prompts, model = defaultImageModel) => {
    const images = []
    
    for (const prompt of prompts) {
        try {
            const imageUrl = await generateImage(prompt, model)
            images.push(imageUrl)
            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
            console.error(`Failed to generate image for prompt: ${prompt}`, error)
            // Use placeholder if generation fails
            images.push(`https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80`)
        }
    }
    
    return images
}

/**
 * Extract image requirements from user prompt
 * @param {string} userPrompt - User's website description
 * @returns {Array<string>} - Array of image prompts to generate
 */
export const extractImageRequirements = (userPrompt) => {
    const imagePrompts = []
    const lowerPrompt = userPrompt.toLowerCase()
    
    // Check if user wants images
    const wantsImages = 
        lowerPrompt.includes('image') ||
        lowerPrompt.includes('photo') ||
        lowerPrompt.includes('picture') ||
        lowerPrompt.includes('visual') ||
        lowerPrompt.includes('illustration') ||
        lowerPrompt.includes('generate images')
    
    if (!wantsImages) {
        return imagePrompts
    }

    // Extract context for image generation
    const context = userPrompt.substring(0, 200)
    
    // Generate standard image prompts based on website type
    if (lowerPrompt.includes('portfolio')) {
        imagePrompts.push(
            `Professional portfolio hero image, modern design, high quality`,
            `Creative workspace with laptop and design tools`,
            `Professional headshot placeholder, neutral background`
        )
    } else if (lowerPrompt.includes('restaurant') || lowerPrompt.includes('food')) {
        imagePrompts.push(
            `Delicious gourmet food plating, restaurant quality`,
            `Modern restaurant interior, elegant ambiance`,
            `Chef preparing food in professional kitchen`
        )
    } else if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('shop')) {
        imagePrompts.push(
            `Modern product photography, clean background`,
            `Shopping experience, online store concept`,
            `Product showcase, professional lighting`
        )
    } else if (lowerPrompt.includes('blog') || lowerPrompt.includes('article')) {
        imagePrompts.push(
            `Blog header image, modern and clean`,
            `Writing and content creation workspace`,
            `Digital publishing concept`
        )
    } else {
        // Generic website images
        imagePrompts.push(
            `Modern website hero image, professional and clean`,
            `Business concept, technology and innovation`,
            `Abstract background, gradient colors`
        )
    }
    
    return imagePrompts
}

export const availableImageModels = imageModels
export { defaultImageModel }
