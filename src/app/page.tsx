'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppData } from '@/hooks/useLocalStorage';
import { ProteinRing } from '@/components/ProteinRing';
import { FoodInput } from '@/components/FoodInput';
import { FoodLog } from '@/components/FoodLog';
import { ActivityGrid } from '@/components/ActivityGrid';
import { getTodayDateString, calculateDailyTotal, calculateDailyCalories } from '@/lib/protein';
import type { FoodEntry } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const { data, updateData } = useAppData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {
        // Service worker registration failed — not critical
      });
    }
  }, []);

  useEffect(() => {
    if (mounted && !data.profile) {
      router.replace('/onboarding');
    }
  }, [mounted, data.profile, router]);

  if (!mounted || !data.profile) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-300 dark:text-gray-700">Loading...</div>
      </main>
    );
  }

  const today = getTodayDateString();
  const todayEntries = data.entries.filter(e => e.date === today);
  const dailyTotal = calculateDailyTotal(todayEntries);
  const dailyCalories = calculateDailyCalories(todayEntries);

  function handleEntriesAdded(entries: FoodEntry[]) {
    updateData(prev => ({
      ...prev,
      entries: [...prev.entries, ...entries],
    }));
  }

  function handleDeleteEntry(id: string) {
    updateData(prev => ({
      ...prev,
      entries: prev.entries.filter(e => e.id !== id),
    }));
  }

  function handleResetProfile() {
    updateData(prev => ({
      ...prev,
      profile: null,
    }));
    router.push('/onboarding');
  }

  return (
    <main className="min-h-screen max-w-lg mx-auto px-4 py-6 pb-20 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight">Protein Tracker</h1>
        </div>
        <button
          onClick={handleResetProfile}
          className="p-2 rounded-xl text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          aria-label="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.295a1 1 0 0 1 .804.98v1.361a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.262.125l-1.25-.834a6.953 6.953 0 0 1-1.416.587l-.295 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.262l.834-1.25a6.957 6.957 0 0 1-.587-1.416l-1.473-.295A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.38 3.03l1.25.834a6.957 6.957 0 0 1 1.416-.587l.294-1.473ZM13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
          </svg>
        </button>
      </header>

      {/* Progress Ring */}
      <ProteinRing current={dailyTotal} goal={data.profile.goal} calories={dailyCalories} />

      {/* Input */}
      <FoodInput onEntriesAdded={handleEntriesAdded} />

      {/* Food Log */}
      <FoodLog entries={todayEntries} onDelete={handleDeleteEntry} />

      {/* Activity Grid */}
      <ActivityGrid entries={data.entries} goal={data.profile.goal} />
    </main>
  );
}
