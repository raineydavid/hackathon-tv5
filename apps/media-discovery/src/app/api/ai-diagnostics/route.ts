/**
 * AI Model Diagnostics API
 * GET /api/ai-diagnostics
 *
 * Returns information about available AI models and API key configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { getModelDiagnostics } from '@/lib/model-fallback';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const diagnostics = getModelDiagnostics();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      models: {
        textGeneration: diagnostics.textGeneration.map((m) => ({
          name: m.name,
          provider: m.provider,
          available: m.available,
          requiresKey: m.requiresKey,
          description: m.description,
        })),
        objectGeneration: diagnostics.objectGeneration.map((m) => ({
          name: m.name,
          provider: m.provider,
          available: m.available,
          requiresKey: m.requiresKey,
          description: m.description,
        })),
      },
      environment: {
        hasOpenAIKey: diagnostics.environment.hasOpenAIKey,
        hasGoogleKey: diagnostics.environment.hasGoogleKey,
      },
      recommendations: generateRecommendations(diagnostics),
    });
  } catch (error) {
    console.error('Diagnostics error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate diagnostics',
      },
      { status: 500 }
    );
  }
}

function generateRecommendations(
  diagnostics: ReturnType<typeof getModelDiagnostics>
): string[] {
  const recommendations: string[] = [];

  if (!diagnostics.environment.hasOpenAIKey && !diagnostics.environment.hasGoogleKey) {
    recommendations.push('⚠️ No AI API keys configured! Set GOOGLE_GENERATIVE_AI_API_KEY or OPENAI_API_KEY in your .env file');
  }

  if (!diagnostics.environment.hasOpenAIKey) {
    recommendations.push('💡 Consider adding OPENAI_API_KEY for better model fallback options');
  }

  if (!diagnostics.environment.hasGoogleKey) {
    recommendations.push('💡 Consider adding GOOGLE_GENERATIVE_AI_API_KEY as a primary model option');
  }

  const availableTextModels = diagnostics.textGeneration.filter((m) => m.available).length;
  if (availableTextModels === 0) {
    recommendations.push('❌ No text generation models available - natural language search will fail');
  } else if (availableTextModels === 1) {
    recommendations.push('⚠️ Only one text generation model available - consider adding another for redundancy');
  }

  const availableObjectModels = diagnostics.objectGeneration.filter((m) => m.available).length;
  if (availableObjectModels === 0) {
    recommendations.push('❌ No object generation models available - structured data extraction will fail');
  } else if (availableObjectModels === 1) {
    recommendations.push('⚠️ Only one object generation model available - consider adding another for redundancy');
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ All systems configured! Multiple model fallbacks available.');
  }

  return recommendations;
}
