import { NextRequest, NextResponse } from 'next/server';
import { ClaudeEstimateResponseSchema } from '@/lib/types';

const SYSTEM_PROMPT = `You are a nutrition estimation assistant. The user will describe food they ate in natural language. Your job is to:

1. Parse the food description into individual food items
2. Estimate the protein content in grams and calorie count for each item
3. Provide a confidence level for each estimate

Rules:
- Use standard serving sizes unless the user specifies quantities
- "a chicken breast" = ~31g protein, ~280 cal (6oz cooked breast)
- "an egg" = ~6g protein, ~78 cal
- "a glass of milk" = ~8g protein, ~150 cal
- "Greek yogurt" = ~15g protein, ~130 cal (per cup)
- "a protein bar" = ~20g protein, ~200 cal
- "a slice of bread/toast" = ~3g protein, ~80 cal
- Be conservative with estimates — round to nearest whole number
- If the description is ambiguous (e.g., "some chicken"), use a medium serving and mark confidence as "medium"
- If you cannot identify a food item, still include it with 0g protein, 0 calories and "low" confidence
- Always respond with valid JSON matching the schema exactly

Respond ONLY with JSON in this exact format, no other text:
{
  "foods": [
    { "name": "Food Name", "protein_grams": 25, "calories": 280, "confidence": "high" }
  ],
  "total_protein": 25,
  "total_calories": 280
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

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: description.trim() },
        ],
        temperature: 0.1,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error:', response.status, errorData);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content;

    if (!text) {
      throw new Error('No text response from Groq');
    }

    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsed = JSON.parse(cleaned);
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
