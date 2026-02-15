# Bytez AI Setup Guide

## What is Bytez?

Bytez is an AI platform that provides access to various AI models including GPT-4o through a unified API. It's designed for developers who want to use multiple AI models with a single API key.

## Features

- Access to GPT-4o (OpenAI's most powerful model)
- OpenAI-compatible API format
- Potentially better pricing than direct OpenAI
- Unified access to multiple models

## Setup Instructions

### 1. Get Your Bytez API Key

1. Go to https://bytez.com (or the Bytez platform you're using)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key (it will look like: `bytez_xxxxxxxxxxxxx`)

### 2. Add to Environment Variables

#### Local Development
Update `server/.env`:
```env
BYTEZ_API_KEY=bytez_your_actual_key_here
```

#### Production (Render)
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add new environment variable:
   - Key: `BYTEZ_API_KEY`
   - Value: `bytez_your_actual_key_here`
5. Click "Save Changes"

### 3. Model Information

**Current Configuration:**
- **Model**: `openai/gpt-4o`
- **Provider**: Bytez AI
- **API Format**: OpenAI-compatible
- **Quality**: Highest quality (GPT-4o is OpenAI's most advanced model)

### 4. API Endpoint

The configuration uses:
```javascript
{
    name: "Bytez AI",
    url: "https://api.bytez.com/v1/chat/completions",
    model: "openai/gpt-4o",
    apiKeyEnv: "BYTEZ_API_KEY"
}
```

**Note:** If the Bytez API endpoint is different, update the `url` in `server/config/aiProviders.js`

### 5. Available Models on Bytez

Bytez typically supports multiple models. You can change the model by updating the `model` field:

```javascript
// In server/config/aiProviders.js
bytez: {
    name: "Bytez AI",
    url: "https://api.bytez.com/v1/chat/completions",
    model: "openai/gpt-4o",  // Change this to other models
    apiKeyEnv: "BYTEZ_API_KEY"
}
```

Common models available:
- `openai/gpt-4o` - Most powerful
- `openai/gpt-4o-mini` - Faster and cheaper
- `anthropic/claude-3-opus` - If supported
- `meta/llama-3-70b` - If supported

### 6. Testing

After adding the key, test it:

```bash
# In your backend directory
node -e "console.log(process.env.BYTEZ_API_KEY)"
```

Should output your key (not "undefined")

### 7. Cost Considerations

- Check Bytez pricing page for current rates
- GPT-4o is typically more expensive than GPT-4o-mini
- Monitor your usage in the Bytez dashboard
- Set usage limits if available

## Current AI Providers in StackStudio

1. **OpenRouter** (Recommended) - DeepSeek Chat
2. **Bytez AI** (New) - GPT-4o
3. **ChatGPT** - GPT-4o Mini
4. **Groq** - Llama 3.3 70B
5. **NVIDIA** - DeepSeek v3.1 Terminus

## Troubleshooting

### Error: "API key not found for Bytez AI"
- Make sure `BYTEZ_API_KEY` is set in your `.env` file
- Restart your server after adding the key
- Check for typos in the environment variable name

### Error: "Bytez connection failed"
- Verify the API endpoint URL is correct
- Check if your API key is valid
- Ensure you have credits/quota available on Bytez

### Error: "Model not found"
- Verify the model name format (e.g., `openai/gpt-4o`)
- Check Bytez documentation for available models
- Some models may require specific subscription tiers

## Security Best Practices

1. ✅ Never commit API keys to Git
2. ✅ Never share API keys publicly
3. ✅ Use environment variables for all secrets
4. ✅ Rotate keys regularly
5. ✅ Monitor usage for unauthorized access

## Support

If you need help with Bytez:
- Check Bytez documentation
- Contact Bytez support
- Review API response errors for specific issues
