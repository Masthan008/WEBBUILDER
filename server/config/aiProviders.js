import OpenAI from 'openai'

// AI Provider configurations
const providers = {
    openrouter: {
        name: "OpenRouter",
        url: "https://openrouter.ai/api/v1/chat/completions",
        model: "deepseek/deepseek-chat",
        apiKeyEnv: "OPENROUTER_API_KEY"
    },
    gemini: {
        name: "Google Gemini",
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        model: "gemini-2.5-flash",
        apiKeyEnv: "GEMINI_API_KEY"
    },
    groq: {
        name: "Groq",
        url: "https://api.groq.com/openai/v1/chat/completions",
        model: "llama-3.3-70b-versatile",
        apiKeyEnv: "GROQ_API_KEY"
    },
    nvidia: {
        name: "NVIDIA DeepSeek",
        url: "https://integrate.api.nvidia.com/v1",
        model: "deepseek-ai/deepseek-v3.1-terminus",
        apiKeyEnv: "NVIDIA_API_KEY"
    }
}

export const generateResponse = async (prompt, provider = "openrouter") => {
    const config = providers[provider]
    
    if (!config) {
        throw new Error(`Unknown provider: ${provider}`)
    }

    const apiKey = process.env[config.apiKeyEnv]
    
    if (!apiKey) {
        throw new Error(`API key not found for ${config.name}`)
    }

    // Gemini has different request format
    if (provider === "gemini") {
        return await generateGeminiResponse(prompt, apiKey)
    }

    // NVIDIA needs special handling (non-streaming)
    if (provider === "nvidia") {
        return await generateNvidiaResponse(prompt, apiKey, config)
    }

    // OpenAI-compatible format (OpenRouter, Groq)
    try {
        const res = await fetch(config.url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    { role: "system", content: "You must return ONLY valid raw JSON." },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2,
                max_tokens: 4096,
                stream: false
            }),
        })

        if (!res.ok) {
            const err = await res.text()
            throw new Error(`${config.name} error: ${err}`)
        }

        const data = await res.json()
        return data.choices[0].message.content
    } catch (error) {
        console.error(`${config.name} fetch error:`, error.message)
        throw new Error(`${config.name} connection failed. Please try another model or check your internet connection.`)
    }
}

// Gemini-specific handler - completely rewritten for reliability
async function generateGeminiResponse(prompt, apiKey) {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
        
        // Simplified prompt focusing on JSON output
        const enhancedPrompt = `${prompt}

CRITICAL: You MUST respond with ONLY a valid JSON object in this EXACT format:
{
  "message": "Brief confirmation message here",
  "code": "Complete HTML code here"
}

Rules:
- NO markdown code blocks (no \`\`\`json or \`\`\`)
- NO explanations before or after the JSON
- NO extra text
- Just the raw JSON object
- Ensure all quotes are properly escaped in the HTML code`
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: enhancedPrompt
                }]
            }],
            generationConfig: {
                temperature: 0.1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_NONE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_NONE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_NONE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_NONE"
                }
            ]
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Gemini API error:', errorText)
            throw new Error(`Gemini API returned ${response.status}: ${errorText}`)
        }

        const data = await response.json()

        // Validate response structure
        if (!data.candidates || data.candidates.length === 0) {
            console.error('Gemini response:', JSON.stringify(data))
            throw new Error('Gemini returned no candidates. The content may have been filtered.')
        }

        const candidate = data.candidates[0]

        // Check for content filtering
        if (candidate.finishReason === 'SAFETY') {
            throw new Error('Gemini blocked the response due to safety filters. Try a different prompt.')
        }

        if (candidate.finishReason === 'RECITATION') {
            throw new Error('Gemini blocked the response due to recitation concerns. Try rephrasing.')
        }

        if (candidate.finishReason === 'MAX_TOKENS') {
            throw new Error('Gemini response was too long. Try a simpler prompt or use OpenRouter.')
        }

        // Extract content
        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            console.error('Gemini candidate:', JSON.stringify(candidate))
            throw new Error('Gemini returned empty content.')
        }

        const textContent = candidate.content.parts[0].text

        if (!textContent || textContent.trim().length === 0) {
            throw new Error('Gemini returned empty text content.')
        }

        console.log('Gemini response length:', textContent.length)
        console.log('Gemini response preview:', textContent.substring(0, 200))

        return textContent

    } catch (error) {
        console.error('Gemini generation error:', error.message)
        
        // Provide user-friendly error messages
        if (error.message.includes('API key')) {
            throw new Error('Invalid Gemini API key. Please check your configuration.')
        } else if (error.message.includes('quota')) {
            throw new Error('Gemini API quota exceeded. Try OpenRouter or Groq instead.')
        } else if (error.message.includes('safety') || error.message.includes('filtered')) {
            throw new Error('Content was filtered by Gemini. Try using OpenRouter or Groq instead.')
        } else if (error.message.includes('404')) {
            throw new Error('Gemini model not found. The API may have changed.')
        } else if (error.message.includes('MAX_TOKENS')) {
            throw new Error('Response too long. Try a simpler prompt or use OpenRouter.')
        }
        
        throw new Error(`Gemini failed: ${error.message}. Try OpenRouter or Groq instead.`)
    }
}

// NVIDIA-specific handler using OpenAI SDK (non-streaming for stability)
async function generateNvidiaResponse(prompt, apiKey, config) {
    try {
        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: config.url
        })

        // Add JSON formatting instruction
        const enhancedPrompt = `${prompt}

CRITICAL: Return ONLY valid JSON in this exact format:
{
  "message": "short confirmation",
  "code": "complete HTML code"
}
NO markdown, NO explanations.`

        const completion = await openai.chat.completions.create({
            model: config.model,
            messages: [
                { role: "system", content: "You are a code generator that returns ONLY valid JSON." },
                { role: "user", content: enhancedPrompt }
            ],
            temperature: 0.2,
            top_p: 0.7,
            max_tokens: 8192,
            stream: false
        })

        if (!completion.choices || completion.choices.length === 0) {
            throw new Error('NVIDIA returned no response')
        }

        return completion.choices[0].message.content
    } catch (error) {
        console.error('NVIDIA generation error:', error.message)
        
        // Provide more specific error messages
        if (error.message.includes('timeout')) {
            throw new Error('NVIDIA request timed out. Try using OpenRouter or Groq instead.')
        } else if (error.message.includes('rate limit')) {
            throw new Error('NVIDIA rate limit reached. Please use OpenRouter or Groq.')
        } else if (error.message.includes('404')) {
            throw new Error('NVIDIA model not available. Try OpenRouter or Groq instead.')
        }
        
        throw new Error(`NVIDIA failed: ${error.message}. Try OpenRouter or Groq instead.`)
    }
}

export const getAvailableProviders = () => {
    return Object.keys(providers).filter(key => {
        return process.env[providers[key].apiKeyEnv]
    }).map(key => ({
        id: key,
        name: providers[key].name,
        model: providers[key].model
    }))
}
