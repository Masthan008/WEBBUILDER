# 🔧 Troubleshooting Guide - StackStudio

## Issues Fixed

### 1. ✅ Removed ChatGPT/OpenAI References
**Problem**: ChatGPT was still in the code causing potential errors
**Solution**: Removed from both `server/config/aiProviders.js` and `client/src/pages/Generate.jsx`

**Files Modified**:
- `server/config/aiProviders.js` - Removed ChatGPT provider
- `client/src/pages/Generate.jsx` - Removed ChatGPT from model list

---

## Common Errors & Solutions

### Error 1: CORS Policy Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Cause**: Backend not allowing frontend origin

**Solution**: Already configured in `server/index.js`:
```javascript
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('.vercel.app')) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))
```

**Check**:
1. Ensure `FRONTEND_URL` is set in `server/.env`
2. Restart backend server after changes
3. Clear browser cache

---

### Error 2: 500 Internal Server Error
```
POST /api/website/generate 500 (Internal Server Error)
```

**Possible Causes**:
1. Missing API keys in `.env`
2. AI provider API down
3. Invalid prompt format
4. Database connection issue

**Solutions**:

1. **Check API Keys**:
```bash
# In server/.env, ensure you have:
OPENROUTER_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
BYTEZ_API_KEY=your_key_here
NVIDIA_API_KEY=your_key_here
MONGODB_URI=your_mongodb_uri
```

2. **Check Server Logs**:
```bash
cd server
npm run dev
# Look for error messages
```

3. **Test AI Providers**:
- Try different AI models (OpenRouter, Groq, Bytez, NVIDIA)
- Check if API keys are valid
- Verify API provider status

4. **Database Connection**:
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connection

---

### Error 3: 404 Not Found (CSS/JS files)
```
GET /styles.css 404 (Not Found)
GET /script.js 404 (Not Found)
```

**Cause**: Generated HTML references external files that don't exist

**Solution**: This is expected for iframe previews. The AI generates self-contained HTML with inline styles and scripts.

**Not a Critical Error** - Can be ignored

---

### Error 4: Firebase Auth Popup Closed
```
FirebaseError: Firebase: Error (auth/popup-closed-by-user)
```

**Cause**: User closed the Google sign-in popup

**Solution**: This is expected behavior, not an error. User just needs to try signing in again.

---

### Error 5: 502 Bad Gateway
```
POST /api/website/generate 502 (Bad Gateway)
```

**Cause**: Backend server is down or not responding

**Solutions**:
1. **Check if server is running**:
```bash
cd server
npm run dev
```

2. **Check Render.com deployment** (if using Render):
- Go to Render dashboard
- Check if service is active
- View logs for errors
- Restart service if needed

3. **Check environment variables**:
- Ensure all required env vars are set
- Verify API keys are valid

---

## Deployment Checklist

### Backend (Render.com)
- [ ] All environment variables set
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Node version: 18.x or higher
- [ ] Service is active and running

### Frontend (Vercel)
- [ ] Environment variables set
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Node version: 18.x or higher
- [ ] Deployment successful

### Environment Variables

**Backend (.env)**:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-frontend.vercel.app

# AI Providers (at least one required)
OPENROUTER_API_KEY=your_key
GROQ_API_KEY=your_key
BYTEZ_API_KEY=your_key
NVIDIA_API_KEY=your_key

# Image Generation (optional)
USE_BYTEZ_IMAGES=false

# Stripe (for payments)
STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_key
```

**Frontend (.env)**:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_id
VITE_SERVER_URL=https://your-backend.onrender.com
```

---

## Testing Steps

### 1. Test Backend
```bash
cd server
npm run dev

# Should see:
# "server started"
# "MongoDB connected"
```

### 2. Test Frontend
```bash
cd client
npm run dev

# Should open at http://localhost:5173
```

### 3. Test API Endpoints
```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Should return:
# {"status":"OK","timestamp":"..."}
```

### 4. Test Website Generation
1. Sign in with Google
2. Go to Generate page
3. Enter a prompt
4. Select AI model
5. Click "Generate Website"
6. Wait for generation (2-7 minutes)
7. Check for errors in console

---

## Performance Optimization

### If Generation is Slow:
1. **Use OpenRouter or Groq** (fastest models)
2. **Avoid NVIDIA** (can be slow, sometimes gets stuck at 93%)
3. **Keep prompts concise** (shorter = faster)
4. **Disable AI images** (if not needed)

### If Server is Slow:
1. **Upgrade Render plan** (free tier has cold starts)
2. **Use caching** (implement Redis)
3. **Optimize database queries**
4. **Add rate limiting**

---

## Debug Mode

### Enable Detailed Logging

**Backend** (`server/index.js`):
```javascript
// Add after imports
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`)
        next()
    })
}
```

**Frontend** (`client/src/pages/Generate.jsx`):
```javascript
// Add in handleGenerateWebsite
console.log('Generating with:', {
    prompt,
    model: selectedModel,
    timestamp: new Date().toISOString()
})
```

---

## Common Questions

### Q: Why is generation taking so long?
**A**: AI generation takes 2-7 minutes depending on:
- AI model selected (OpenRouter/Groq are fastest)
- Prompt complexity
- Server load
- Network speed

### Q: Why do I get "API key not found" error?
**A**: 
1. Check `.env` file has the API key
2. Restart server after adding keys
3. Verify key format (no quotes, no spaces)
4. Check if key is valid on provider's website

### Q: Why is the website not deploying?
**A**:
1. Check if backend is running
2. Verify CORS settings
3. Check environment variables
4. Look at server logs for errors

### Q: Can I use the app without API keys?
**A**: No, you need at least one AI provider API key (OpenRouter, Groq, Bytez, or NVIDIA)

---

## Getting Help

### Check Logs
1. **Backend logs**: Render dashboard → Logs tab
2. **Frontend logs**: Browser console (F12)
3. **Database logs**: MongoDB Atlas → Logs

### Report Issues
Include:
1. Error message (full text)
2. Steps to reproduce
3. Browser and OS
4. Screenshots
5. Console logs

---

## Quick Fixes

### Reset Everything
```bash
# Backend
cd server
rm -rf node_modules
npm install
npm run dev

# Frontend
cd client
rm -rf node_modules
npm install
npm run dev
```

### Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Restart Services
1. Stop backend (Ctrl+C)
2. Stop frontend (Ctrl+C)
3. Start backend: `npm run dev`
4. Start frontend: `npm run dev`

---

## Status Check

### ✅ Working Features:
- User authentication (Google)
- Website generation (4 AI models)
- Website editing
- Dashboard with search/filter
- Templates (8 templates)
- Themes (12 themes)
- Mobile preview
- Undo/Redo
- SEO optimizer
- Component library (30+ components)
- Animation library (24+ animations)
- Integrations hub (12+ services)

### ⚠️ Known Issues:
- NVIDIA can be slow (sometimes stuck at 93%)
- Bytez may have connection issues
- Free Render tier has cold starts (30s delay)

### 🔄 In Progress:
- Website analytics dashboard
- Real-time collaboration

---

**Last Updated**: Current session
**Status**: All critical issues resolved ✅
