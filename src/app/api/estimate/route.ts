import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { ClaudeEstimateResponseSchema } from '@/lib/types';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a protein estimation assistant. The user will describe food they ate in natural language. Your job is to:

1. Parse the food description into individual food items
2. Estimate the protein content in grams for each item
3. Provide a confidence level for each estimate

Rules:
- Use standard serving sizes unless the user specifies quantities
- "a chicken breast" = ~31g protein (6oz cooked breast)
- "an egg" = ~6g protein
- "a glass of milk" = ~8g protein
- "Greek yogurt" = ~15g protein (per cup)
- "a protein bar" = ~20g protein
- "a slice of bread/toast" = ~3g protein
- Be conservative with estimates — round to nearest whole gram
- If the description is ambiguous (e.g., "some chicken"), use a medium serving and mark confidence as "medium"
- If you cannot identify a food item, still include it with 0g protein and "low" confidence
- Always respond with valid JSON matching the schema exactly

Respond ONLY with JSON in this exact format, no other text:
{
  "foods": [
    { "name": "Food Name", "protein_grams": 25, "confidence": "high" }
  ],
  "total_protein": 25
}`;

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Food description is required' },
        { status: 400 }
      );
    }

    if (description.length > 500) {
      return NextResponse.json(
        { error: 'Description too long (max 500 characters)' },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20250929',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: description.trim() }
      ],
    });

    const textBlock = message.content.find(block => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    const parsed = JSON.parse(textBlock.text);
    const validated = ClaudeEstimateResponseSchema.parse(parsed);

    return NextResponse.json(validated);
  } catch (error) {
    console.error('Estimation error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to estimate protein content' },
      { status: 500 }
    );
  }
}
