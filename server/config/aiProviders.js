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
        url: "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
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

// Gemini-specific handler
async function generateGeminiResponse(prompt, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`
    
    // Add stricter JSON formatting instruction with escape handling
    const enhancedPrompt = `${prompt}

CRITICAL JSON FORMATTING RULES:
1. Return ONLY valid JSON - no markdown, no explanations
2. Use this EXACT format:
{
  "message": "short confirmation text",
  "code": "complete HTML code"
}
3. ESCAPE all special characters in the code field:
   - Replace " with \\"
   - Replace newlines with \\n
   - Replace tabs with \\t
4. Keep the HTML code compact to avoid token limits
5. NO trailing commas
6. Ensure all strings are properly closed`
    
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: enhancedPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 8192,
                    responseMimeType: "application/json"
                }
            }),
        })

        if (!res.ok) {
            const err = await res.text()
            throw new Error(`Gemini error: ${err}`)
        }

        const data = await res.json()
        
        // Check for safety blocks or empty responses
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('Gemini returned no candidates. The prompt may have been blocked.')
        }
        
        const candidate = data.candidates[0]
        
        if (candidate.finishReason === 'SAFETY') {
            throw new Error('Gemini blocked the response due to safety filters.')
        }
        
        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            throw new Error('Gemini returned empty content.')
        }
        
        return candidate.content.parts[0].text
    } catch (error) {
        console.error('Gemini generation error:', error.message)
        throw new Error(`Gemini failed: ${error.message}. Try using OpenRouter or Groq instead.`)
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
