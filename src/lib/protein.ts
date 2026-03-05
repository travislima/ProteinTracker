import { FoodEntry } from './types';

export function calculateRecommendedProtein(
  weight: number,
  age: number,
  sex: 'male' | 'female'
): number {
  let multiplier = 0.8;

  if (age >= 50) multiplier = 1.0;
  else if (age >= 30) multiplier = 0.9;

  if (sex === 'male') multiplier += 0.05;

  return Math.round(weight * multiplier);
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function calculateDailyTotal(entries: FoodEntry[]): number {
  return entries.reduce((sum, e) => sum + e.protein, 0);
}

export function calculateDailyCalories(entries: FoodEntry[]): number {
  return entries.reduce((sum, e) => sum + (e.calories || 0), 0);
}

export function getGoalPercentage(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
}
