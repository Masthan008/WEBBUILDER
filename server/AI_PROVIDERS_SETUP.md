# AI Providers Setup

This application now supports multiple AI providers. Add the API keys you want to use to your `.env` file.

## Environment Variables

Add these to your `server/.env` file:

```env
# OpenRouter (Default - Recommended)
OPENROUTER_API_KEY=your_openrouter_key_here

# Google Gemini (Optional)
GEMINI_API_KEY=your_gemini_key_here

# Groq (Optional)
GROQ_API_KEY=your_groq_key_here

# NVIDIA (Optional)
NVIDIA_API_KEY=your_nvidia_key_here
```

## How to Get API Keys

### OpenRouter (Recommended - Default)
1. Visit: https://openrouter.ai/
2. Sign up and get your API key
3. Model used: `deepseek/deepseek-chat`

### Google Gemini
1. Visit: https://aistudio.google.com/app/apikey
2. Create a new API key
3. Model used: `gemini-1.5-flash`

### Groq
1. Visit: https://console.groq.com/
2. Sign up and create an API key
3. Model used: `llama-3.3-70b-versatile`

### NVIDIA
1. Visit: https://build.nvidia.com/
2. Sign up and get your API key
3. Model used: `meta/llama-3.1-70b-instruct`

## Notes

- You only need to add the API keys for the providers you want to use
- OpenRouter is set as the default provider
- Users can switch between available providers in the UI
- If a provider's API key is not set, it won't appear in the dropdown
