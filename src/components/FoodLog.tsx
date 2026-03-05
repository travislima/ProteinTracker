'use client';

import type { FoodEntry } from '@/lib/types';

interface FoodLogProps {
  entries: FoodEntry[];
  onDelete: (id: string) => void;
}

const confidenceBadge = {
  high: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  low: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export function FoodLog({ entries, onDelete }: FoodLogProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-10 animate-fade-in">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-300 dark:text-gray-600">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-gray-400 dark:text-gray-500 font-medium">No food logged yet</p>
        <p className="text-sm text-gray-300 dark:text-gray-600 mt-0.5">Type what you ate to get started</p>
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Today
        </h3>
        <span className="text-sm text-gray-400 dark:text-gray-500">
          {entries.length} {entries.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      <div className="space-y-2">
        {sorted.map(entry => (
          <div
            key={entry.id}
            className="group flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] hover:border-gray-200 dark:hover:border-white/10 transition-all animate-in"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${confidenceBadge[entry.confidence]}`}>
                {entry.protein}g
              </span>
              <div className="min-w-0">
                <span className="text-gray-700 dark:text-gray-300 truncate block">{entry.food}</span>
                {entry.calories > 0 && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">{entry.calories} cal</span>
                )}
              </div>
            </div>
            <button
              onClick={() => onDelete(entry.id)}
              className="shrink-0 ml-2 p-1.5 rounded-lg text-gray-300 dark:text-gray-700 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/5 transition-all"
              aria-label={`Delete ${entry.food}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 1 .7.797l-.5 6a.75.75 0 0 1-1.497-.124l.5-6a.75.75 0 0 1 .797-.672ZM12.2 7.72a.75.75 0 0 1 .797.672l.5 6a.75.75 0 1 1-1.497.124l-.5-6a.75.75 0 0 1 .7-.797ZM10 7.75a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
