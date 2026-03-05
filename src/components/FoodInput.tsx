'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { getTodayDateString } from '@/lib/protein';
import type { FoodEntry, ClaudeEstimateResponse } from '@/lib/types';

interface FoodInputProps {
  onEntriesAdded: (entries: FoodEntry[]) => void;
}

export function FoodInput({ onEntriesAdded }: FoodInputProps) {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isListening, isSupported, transcript, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: text }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to estimate protein');
      }

      const data: ClaudeEstimateResponse = await res.json();
      const today = getTodayDateString();
      const entries: FoodEntry[] = data.foods.map(food => ({
        id: uuidv4(),
        date: today,
        food: food.name,
        protein: food.protein_grams,
        calories: food.calories,
        confidence: food.confidence,
        timestamp: Date.now(),
      }));

      onEntriesAdded(entries);
      setInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleMicToggle() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <div className="flex-1 relative group">
          <input
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setError(null); }}
            placeholder="What did you eat?"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 pr-12 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-base placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 disabled:opacity-50 transition-all"
          />
          {isSupported && (
            <button
              type="button"
              onClick={handleMicToggle}
              disabled={isSubmitting}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400'
                  : 'text-gray-300 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-600 dark:hover:text-gray-400 dark:hover:bg-white/5'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening && (
                <span className="absolute inset-0 rounded-xl animate-ping bg-red-500/20" />
              )}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 relative">
                <path d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4Z" />
                <path d="M6 10a1 1 0 0 0-2 0 8 8 0 0 0 7 7.93V21H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-3.07A8 8 0 0 0 20 10a1 1 0 1 0-2 0 6 6 0 0 1-12 0Z" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !input.trim()}
          className="px-5 py-3.5 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.97] transition-all disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center min-w-[64px]"
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
          )}
        </button>
      </form>

      {isListening && (
        <div className="flex items-center gap-2 px-1 animate-fade-in">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-sm text-red-500/80">Listening...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/5 border border-red-500/10 animate-in">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500 shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
