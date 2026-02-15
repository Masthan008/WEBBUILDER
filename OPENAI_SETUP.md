# OpenAI API Setup Guide

## ⚠️ SECURITY WARNING
**The API key you shared in chat has been exposed and MUST be revoked immediately!**

## Steps to Set Up OpenAI API

### 1. Revoke the Exposed Key
1. Go to https://platform.openai.com/api-keys
2. Find the key starting with `sk-proj-MTs3H_7l...`
3. Click "Revoke" to disable it immediately

### 2. Generate a New Key
1. On the same page, click "Create new secret key"
2. Give it a name like "WebBuilder Production"
3. Copy the new key (it will only be shown once!)

### 3. Add to Environment Variables

#### Local Development
Update `server/.env`:
```env
OPENAI_API_KEY=sk-proj-YOUR_NEW_KEY_HERE
```

#### Production (Render)
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add new environment variable:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-proj-YOUR_NEW_KEY_HERE`
5. Click "Save Changes"

### 4. Model Information
- **Model**: GPT-4o Mini
- **Cost**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **Speed**: Fast (optimized for speed and cost)
- **Quality**: High quality, good for code generation

### 5. Alternative Free Models
If you want completely free options:
- **Groq**: Free tier with Llama 3.3 70B (already configured)
- **OpenRouter**: Has free models available
- **NVIDIA**: Free tier available

## Security Best Practices
1. ✅ Never commit API keys to Git
2. ✅ Never share API keys in chat or public forums
3. ✅ Use environment variables for all secrets
4. ✅ Rotate keys regularly
5. ✅ Set usage limits in OpenAI dashboard
6. ✅ Monitor usage to detect unauthorized access

## Testing
After adding the key, test it:
```bash
# In your backend directory
node -e "console.log(process.env.OPENAI_API_KEY)"
```

Should output your key (not "undefined")

## Current AI Providers
1. **OpenRouter** (Recommended) - DeepSeek Chat
2. **ChatGPT** (New) - GPT-4o Mini
3. **Groq** - Llama 3.3 70B
4. **NVIDIA** - DeepSeek v3.1 Terminus
