import { AppData, AppDataSchema, FoodEntry, Profile } from './types';

const STORAGE_KEY = 'protein-tracker-data';

function getDefaultData(): AppData {
  return { profile: null, entries: [] };
}

export function loadData(): AppData {
  if (typeof window === 'undefined') return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    const parsed = JSON.parse(raw);
    return AppDataSchema.parse(parsed);
  } catch {
    return getDefaultData();
  }
}

export function saveData(data: AppData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveProfile(profile: Profile): void {
  const data = loadData();
  data.profile = profile;
  saveData(data);
}

export function addEntry(entry: FoodEntry): void {
  const data = loadData();
  data.entries.push(entry);
  saveData(data);
}

export function deleteEntry(id: string): void {
  const data = loadData();
  data.entries = data.entries.filter(e => e.id !== id);
  saveData(data);
}

export function getEntriesForDate(date: string): FoodEntry[] {
  const data = loadData();
  return data.entries.filter(e => e.date === date);
}

export function hasProfile(): boolean {
  const data = loadData();
  return data.profile !== null;
}
