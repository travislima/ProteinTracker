import { z } from 'zod';

export const ProfileSchema = z.object({
  goal: z.number().min(1).max(1000),
  weight: z.number().optional(),
  age: z.number().optional(),
  sex: z.enum(['male', 'female']).optional(),
});

export const FoodEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  food: z.string(),
  protein: z.number(),
  confidence: z.enum(['high', 'medium', 'low']),
  timestamp: z.number(),
});

export const AppDataSchema = z.object({
  profile: ProfileSchema.nullable(),
  entries: z.array(FoodEntrySchema),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type FoodEntry = z.infer<typeof FoodEntrySchema>;
export type AppData = z.infer<typeof AppDataSchema>;

export const ClaudeEstimateResponseSchema = z.object({
  foods: z.array(z.object({
    name: z.string(),
    protein_grams: z.number(),
    confidence: z.enum(['high', 'medium', 'low']),
  })),
  total_protein: z.number(),
});

export type ClaudeEstimateResponse = z.infer<typeof ClaudeEstimateResponseSchema>;
