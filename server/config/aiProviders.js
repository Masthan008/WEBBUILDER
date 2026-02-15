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
        name: "NVIDIA Kimi",
        url: "https://integrate.api.nvidia.com/v1/chat/completions",
        model: "moonshotai/kimi-k2.5",
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

    // OpenAI-compatible format (OpenRouter, Groq, NVIDIA)
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
                max_tokens: 16384
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
    
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: "You must return ONLY valid raw JSON.\n\n" + prompt
                }]
            }],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 8192
            }
        }),
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`Gemini error: ${err}`)
    }

    const data = await res.json()
    return data.candidates[0].content.parts[0].text
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
