'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadData, saveData } from '@/lib/storage';
import type { AppData } from '@/lib/types';

export function useAppData() {
  const [data, setData] = useState<AppData>(() => loadData());

  useEffect(() => {
    setData(loadData());
  }, []);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'protein-tracker-data') {
        setData(loadData());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const updateData = useCallback((updater: (prev: AppData) => AppData) => {
    setData(prev => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  return { data, updateData };
}
