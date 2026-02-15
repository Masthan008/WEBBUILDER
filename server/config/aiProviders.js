import OpenAI from 'openai'

// AI Provider configurations
const providers = {
    openrouter: {
        name: "OpenRouter",
        url: "https://openrouter.ai/api/v1/chat/completions",
        model: "deepseek/deepseek-chat",
        apiKeyEnv: "OPENROUTER_API_KEY"
    },
    chatgpt: {
        name: "ChatGPT",
        url: "https://api.openai.com/v1/chat/completions",
        model: "gpt-4o-mini",
        apiKeyEnv: "OPENAI_API_KEY"
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
