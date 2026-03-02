// AI Provider configurations
const providers = {
    openrouter: {
        name: "OpenRouter",
        url: "https://openrouter.ai/api/v1/chat/completions",
        model: "deepseek/deepseek-chat",
        apiKeyEnv: "OPENROUTER_API_KEY"
    },
    bytez: {
        name: "Bytez AI",
        url: "https://api.bytez.com/v1/chat/completions",
        model: "openai/gpt-4o",
        apiKeyEnv: "BYTEZ_API_KEY"
    },
    groq: {
        name: "Groq",
        url: "https://api.groq.com/openai/v1/chat/completions",
        model: "llama-3.3-70b-versatile",
        apiKeyEnv: "GROQ_API_KEY"
    },
    nvidia: {
        name: "NVIDIA DeepSeek",
        url: "https://integrate.api.nvidia.com/v1/chat/completions",
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

    // All providers use OpenAI-compatible format
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
                max_tokens: 8192,
                stream: false
            }),
        })

        if (!res.ok) {
            const err = await res.text()
            console.error(`${config.name} API error:`, res.status, err)
            throw new Error(`${config.name} error (${res.status}): ${err}`)
        }

        const data = await res.json()
        
        if (!data.choices || data.choices.length === 0) {
            throw new Error(`${config.name} returned no response`)
        }
        
        return data.choices[0].message.content
    } catch (error) {
        console.error(`${config.name} fetch error:`, error.message)
        
        // Provide helpful error messages
        if (error.message.includes('401')) {
            throw new Error(`${config.name} authentication failed. Please check your API key.`)
        } else if (error.message.includes('404')) {
            throw new Error(`${config.name} endpoint not found. Try using OpenRouter or Groq instead.`)
        } else if (error.message.includes('timeout')) {
            throw new Error(`${config.name} request timed out. Try using OpenRouter or Groq instead.`)
        } else if (error.message.includes('rate limit')) {
            throw new Error(`${config.name} rate limit reached. Please use OpenRouter or Groq.`)
        }
        
        throw new Error(`${config.name} connection failed: ${error.message}. Try OpenRouter or Groq instead.`)
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
