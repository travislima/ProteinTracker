'use client';

import type { FoodEntry } from '@/lib/types';

interface ActivityGridProps {
  entries: FoodEntry[];
  goal: number;
}

const levelColors = [
  'bg-gray-100 dark:bg-white/[0.04]',
  'bg-emerald-200 dark:bg-emerald-500/20',
  'bg-emerald-300 dark:bg-emerald-500/40',
  'bg-emerald-400 dark:bg-emerald-500/60',
  'bg-emerald-500 dark:bg-emerald-400',
];

function generateDateRange(numDays: number): string[] {
  const dates: string[] = [];
  const today = new Date();

  const startDay = new Date(today);
  startDay.setDate(startDay.getDate() - numDays);

  while (startDay.getDay() !== 0) {
    startDay.setDate(startDay.getDate() - 1);
  }

  const current = new Date(startDay);
  while (current <= today) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function computeLevel(total: number, goal: number): 0 | 1 | 2 | 3 | 4 {
  if (total === 0) return 0;
  const pct = total / goal;
  if (pct < 0.5) return 1;
  if (pct < 0.8) return 2;
  if (pct < 1.0) return 3;
  return 4;
}

export function ActivityGrid({ entries, goal }: ActivityGridProps) {
  const days = generateDateRange(90);

  const dailyTotals: Record<string, number> = {};
  for (const entry of entries) {
    dailyTotals[entry.date] = (dailyTotals[entry.date] || 0) + entry.protein;
  }

  const cells = days.map(date => ({
    date,
    total: dailyTotals[date] || 0,
    level: computeLevel(dailyTotals[date] || 0, goal),
  }));

  const numWeeks = Math.ceil(cells.length / 7);
  const cellSize = 12;
  const gap = 3;
  const colWidth = cellSize + gap;

  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  cells.forEach((cell, i) => {
    const month = new Date(cell.date + 'T00:00:00').getMonth();
    if (month !== lastMonth) {
      lastMonth = month;
      const col = Math.floor(i / 7);
      const monthName = new Date(cell.date + 'T00:00:00').toLocaleString('default', { month: 'short' });
      monthLabels.push({ label: monthName, col });
    }
  });

  // Count streak days
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  const sortedDates = [...new Set(entries.map(e => e.date))].sort().reverse();
  for (const date of sortedDates) {
    const dayEntries = entries.filter(e => e.date === date);
    const dayTotal = dayEntries.reduce((sum, e) => sum + e.protein, 0);
    if (dayTotal >= goal && date <= today) {
      streak++;
    } else if (date < today) {
      break;
    }
  }

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Activity
        </h3>
        {streak > 0 && (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            {streak} day streak
          </span>
        )}
      </div>
      <div className="overflow-x-auto -mx-1 px-1">
        <div style={{ width: `${numWeeks * colWidth}px` }}>
          <div className="relative h-5 mb-1">
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="absolute text-[11px] text-gray-300 dark:text-gray-600"
                style={{ left: `${m.col * colWidth}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>
          <div
            className="grid gap-[3px]"
            style={{
              gridTemplateRows: 'repeat(7, 1fr)',
              gridAutoFlow: 'column',
              gridAutoColumns: `${cellSize}px`,
            }}
          >
            {cells.map(cell => (
              <div
                key={cell.date}
                className={`w-3 h-3 rounded-[3px] ${levelColors[cell.level]} transition-colors`}
                title={`${cell.date}: ${cell.total}g protein`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-gray-300 dark:text-gray-600">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div key={level} className={`w-2.5 h-2.5 rounded-[2px] ${levelColors[level]}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
