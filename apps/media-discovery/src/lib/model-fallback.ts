/**
 * AI Model Fallback System
 * Gracefully handles missing API keys by falling back to available models
 */

import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

// Support legacy/alternate env var name `GOOGLE_AI_API_KEY` in addition to
// the canonical `GOOGLE_GENERATIVE_AI_API_KEY`. This lets projects that
// previously used the older name continue to work without forcing env edits.
function hasGoogleKey(): boolean {
  return !!(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY);
}

function whichGoogleKey(): string | null {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return 'GOOGLE_GENERATIVE_AI_API_KEY';
  if (process.env.GOOGLE_AI_API_KEY) return 'GOOGLE_AI_API_KEY';
  return null;
}

// Define available models in priority order (with fallbacks)
export const MODEL_CONFIGS = {
  // Text generation models (for recommendations, descriptions)
  textGeneration: [
    {
      name: 'gpt-4o-mini',
      provider: 'openai',
      model: () => openai('gpt-4o-mini'),
      requiresKey: 'OPENAI_API_KEY',
      isAvailable: () => !!process.env.OPENAI_API_KEY,
      description: 'OpenAI GPT-4o Mini - Fast and cost-effective',
    },
    {
      name: 'gemini-1.5-flash',
      provider: 'google',
      model: () => google('gemini-1.5-flash'),
      requiresKey: 'GOOGLE_GENERATIVE_AI_API_KEY|GOOGLE_AI_API_KEY',
      isAvailable: () => hasGoogleKey(),
      description: 'Google Gemini 1.5 Flash - Fast and efficient',
    },
    {
      name: 'gpt-3.5-turbo',
      provider: 'openai',
      model: () => openai('gpt-3.5-turbo'),
      requiresKey: 'OPENAI_API_KEY',
      isAvailable: () => !!process.env.OPENAI_API_KEY,
      description: 'OpenAI GPT-3.5 Turbo - Fallback OpenAI model',
    },
  ],

  // Object generation models (for structured data extraction)
  objectGeneration: [
    {
      name: 'gemini-1.5-flash',
      provider: 'google',
      model: () => google('gemini-1.5-flash'),
      requiresKey: 'GOOGLE_GENERATIVE_AI_API_KEY|GOOGLE_AI_API_KEY',
      isAvailable: () => hasGoogleKey(),
      description: 'Google Gemini 1.5 Flash - Excellent for structured data',
    },
    {
      name: 'gpt-4o-mini',
      provider: 'openai',
      model: () => openai('gpt-4o-mini'),
      requiresKey: 'OPENAI_API_KEY',
      isAvailable: () => !!process.env.OPENAI_API_KEY,
      description: 'OpenAI GPT-4o Mini - Fallback for object generation',
    },
    {
      name: 'gpt-3.5-turbo',
      provider: 'openai',
      model: () => openai('gpt-3.5-turbo'),
      requiresKey: 'OPENAI_API_KEY',
      isAvailable: () => !!process.env.OPENAI_API_KEY,
      description: 'OpenAI GPT-3.5 Turbo - Last resort fallback',
    },
  ],
};

/**
 * Get the best available model for text generation
 * Falls back to next available model if primary is not configured
 */
export function getTextGenerationModel() {
  for (const modelConfig of MODEL_CONFIGS.textGeneration) {
    if (modelConfig.isAvailable()) {
      console.log(`✅ Using model: ${modelConfig.name} (${modelConfig.provider})`);
      return modelConfig.model();
    }
  }

  // No models available
  console.error('❌ No text generation models available!');
  console.error('   Please set one of:');
  MODEL_CONFIGS.textGeneration.forEach((config) => {
    console.error(`   - ${config.requiresKey}`);
  });

  // Fallback to Gemini (will fail with proper error message if key missing)
  return google('gemini-1.5-flash');
}

/**
 * Get the best available model for object generation (structured data)
 * Falls back to next available model if primary is not configured
 */
export function getObjectGenerationModel() {
  for (const modelConfig of MODEL_CONFIGS.objectGeneration) {
    if (modelConfig.isAvailable()) {
      console.log(`✅ Using model: ${modelConfig.name} (${modelConfig.provider})`);
      return modelConfig.model();
    }
  }

  // No models available
  console.error('❌ No object generation models available!');
  console.error('   Please set one of:');
  MODEL_CONFIGS.objectGeneration.forEach((config) => {
    console.error(`   - ${config.requiresKey}`);
  });

  // Fallback to Gemini (will fail with proper error message if key missing)
  return google('gemini-1.5-flash');
}

/**
 * Get diagnostic info about available models
 */
export function getModelDiagnostics() {
  const diagnostics = {
    textGeneration: MODEL_CONFIGS.textGeneration.map((config) => ({
      name: config.name,
      provider: config.provider,
      available: config.isAvailable(),
      requiresKey: config.requiresKey,
      description: config.description,
    })),
    objectGeneration: MODEL_CONFIGS.objectGeneration.map((config) => ({
      name: config.name,
      provider: config.provider,
      available: config.isAvailable(),
      requiresKey: config.requiresKey,
      description: config.description,
    })),
    environment: {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasGoogleKey: hasGoogleKey(),
      whichGoogleKey: whichGoogleKey(),
    },
  };

  return diagnostics;
}

/**
 * Log available models for debugging
 */
export function logAvailableModels() {
  console.log('\n📊 AI Model Configuration:');
  console.log('═'.repeat(50));

  const diagnostics = getModelDiagnostics();

  console.log('\n📝 Text Generation Models:');
  diagnostics.textGeneration.forEach((model) => {
    const status = model.available ? '✅' : '❌';
    console.log(`  ${status} ${model.name.padEnd(20)} (${model.provider})`);
  });

  console.log('\n📋 Object Generation Models:');
  diagnostics.objectGeneration.forEach((model) => {
    const status = model.available ? '✅' : '❌';
    console.log(`  ${status} ${model.name.padEnd(20)} (${model.provider})`);
  });

  console.log('\n🔑 Environment Variables:');
  console.log(`  ${diagnostics.environment.hasOpenAIKey ? '✅' : '❌'} OPENAI_API_KEY`);
  console.log(`  ${diagnostics.environment.hasGoogleKey ? '✅' : '❌'} GOOGLE_GENERATIVE_AI_API_KEY`);

  console.log('═'.repeat(50) + '\n');
}
