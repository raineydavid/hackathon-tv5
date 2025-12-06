# AI Model Fallback System

## Overview

The media discovery app now includes an intelligent **AI Model Fallback System** that automatically detects available API keys and uses the best available model for each task. This ensures the app works even if some API keys are missing.

## How It Works

### Model Priority

The system prioritizes models based on:
1. **API Key Availability** - Does the environment variable exist?
2. **Task Type** - Some models are better for specific tasks
3. **Performance** - Faster/cheaper models are preferred when multiple options exist

### Text Generation (Recommendations & Explanations)
Priority order:
1. ✅ **GPT-4o Mini** (OpenAI) - Fast, cost-effective
2. ✅ **Gemini 1.5 Flash** (Google) - Fast, efficient
3. ✅ **GPT-3.5 Turbo** (OpenAI) - Slower fallback

### Object Generation (Search Intent Parsing)
Priority order:
1. ✅ **Gemini 1.5 Flash** (Google) - Best for structured data
2. ✅ **GPT-4o Mini** (OpenAI) - Excellent alternative
3. ✅ **GPT-3.5 Turbo** (OpenAI) - Slower fallback

## Configuration

### Required Environment Variables

You need **at least one** of the following:

```env
# Google Generative AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here

# OpenAI (GPT models)
OPENAI_API_KEY=your_key_here
```

### Optional Configuration

Feature flags (optional, defaults to true):
```env
ENABLE_VIDEO_PLAYER=true
ENABLE_GEMINI_AUDIO=true
```

## Getting API Keys

### Google Generative AI (Gemini)
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy and paste into `.env`

**Free tier:** 60 requests per minute

### OpenAI
1. Visit: https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and paste into `.env`

**Free trial:** $5 credits (expires after 3 months)
**Pricing:** $0.15/1M tokens for GPT-3.5, $0.003/1K for GPT-4o mini

## Setup Examples

### Scenario 1: Only Gemini Available
```env
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyD6...
# OPENAI_API_KEY=  (commented out or not set)
```

**Result:**
- ✅ Text generation uses Gemini
- ✅ Object generation uses Gemini
- ✅ Video player + audio interaction works

### Scenario 2: Only OpenAI Available
```env
OPENAI_API_KEY=sk-...
# GOOGLE_GENERATIVE_AI_API_KEY=  (not set)
```

**Result:**
- ✅ Text generation uses OpenAI (GPT-4o Mini)
- ✅ Object generation uses OpenAI
- ✅ Video player + audio interaction works

### Scenario 3: Both Available (Recommended)
```env
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyD6...
OPENAI_API_KEY=sk-...
```

**Result:**
- ✅ Uses Google for object generation (better for structured data)
- ✅ Uses OpenAI for text generation (faster)
- ✅ Perfect fallback redundancy
- ✅ Best performance

## Checking Your Configuration

### Via API Endpoint
```bash
# Check what models are available
curl http://localhost:3000/api/ai-diagnostics

# Response example:
{
  "success": true,
  "models": {
    "textGeneration": [
      {
        "name": "gpt-4o-mini",
        "provider": "openai",
        "available": true,
        "requiresKey": "OPENAI_API_KEY"
      },
      {
        "name": "gemini-1.5-flash",
        "provider": "google",
        "available": false,
        "requiresKey": "GOOGLE_GENERATIVE_AI_API_KEY"
      }
    ],
    "objectGeneration": [ ... ]
  },
  "environment": {
    "hasOpenAIKey": true,
    "hasGoogleKey": false
  },
  "recommendations": [
    "💡 Consider adding GOOGLE_GENERATIVE_AI_API_KEY for better model fallback options"
  ]
}
```

### Via Logs
When the app starts (or makes an API request), check the console for:
```
📊 AI Model Configuration:
══════════════════════════════════════════════
📝 Text Generation Models:
  ✅ gpt-4o-mini            (openai)
  ❌ gemini-1.5-flash       (google)
  ✅ gpt-3.5-turbo          (openai)

📋 Object Generation Models:
  ✅ gemini-1.5-flash       (google)
  ❌ gpt-4o-mini            (openai)
  ✅ gpt-3.5-turbo          (openai)

🔑 Environment Variables:
  ✅ OPENAI_API_KEY
  ❌ GOOGLE_GENERATIVE_AI_API_KEY
══════════════════════════════════════════════
```

## Cost Optimization

### Using Free/Cheap Models
The system automatically prioritizes cost-effective models:

**Google Gemini (Free):**
- 60 requests per minute
- No cost
- Good for testing

**OpenAI GPT-4o Mini:**
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens
- Very cost-effective

**OpenAI GPT-3.5 Turbo:**
- ~$0.50 per 1M input tokens (fallback)
- More expensive than 4o-mini

### Recommended Setup for Cost
```env
# Best cost/performance ratio
GOOGLE_GENERATIVE_AI_API_KEY=free_key
# Use OpenAI as fallback only
OPENAI_API_KEY=paid_key_with_spending_limit
```

## Error Handling

### If All Models Fail
The app will:
1. Log which models were tried
2. Return a helpful error message
3. Suggest which API keys are needed

Example error:
```
❌ No text generation models available!
   Please set one of:
   - OPENAI_API_KEY
   - GOOGLE_GENERATIVE_AI_API_KEY
```

## Files Modified

### New Files
- `src/lib/model-fallback.ts` - Model fallback system
- `src/app/api/ai-diagnostics/route.ts` - Diagnostics endpoint

### Updated Files
- `src/lib/natural-language-search.ts` - Uses fallback models
- `src/app/api/gemini-audio/route.ts` - Uses fallback models

## Usage in Code

### In Components/API Routes
```typescript
import { getTextGenerationModel, getObjectGenerationModel } from '@/lib/model-fallback';
import { generateText, generateObject } from 'ai';

// Text generation (recommendations)
const { text } = await generateText({
  model: getTextGenerationModel() as any,
  prompt: '...',
});

// Object generation (structured data)
const { object } = await generateObject({
  model: getObjectGenerationModel() as any,
  schema: MySchema,
  prompt: '...',
});
```

## Troubleshooting

### "No models available" Error
**Problem:** Neither `OPENAI_API_KEY` nor `GOOGLE_GENERATIVE_AI_API_KEY` is set

**Solution:**
1. Get at least one API key (see "Getting API Keys" section)
2. Add it to `.env`
3. Restart the dev server: `npm run dev`

### Using Wrong Model
**Problem:** Expected GPT-4o but got GPT-3.5

**Solution:**
- Check logs to see which model was selected
- Verify API keys are set correctly in `.env`
- Make sure keys match the environment variables exactly

### High Costs
**Problem:** Using expensive models

**Solution:**
1. Check `/api/ai-diagnostics` endpoint
2. Prioritize cheap models (Gemini Flash, GPT-4o Mini)
3. Set spending limits on OpenAI account
4. Consider using only Gemini's free tier during development

## Future Improvements

- [ ] Runtime model switching via API
- [ ] Cost tracking dashboard
- [ ] Per-request model selection
- [ ] Model performance metrics
- [ ] Automatic model comparison for quality

## Support

For issues:
1. Check `/api/ai-diagnostics` endpoint
2. Review logs for model selection
3. Verify API keys are correct
4. Check API quotas/limits on provider dashboards
