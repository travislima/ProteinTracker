'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveProfile } from '@/lib/storage';
import { calculateRecommendedProtein } from '@/lib/protein';

type Step = 'choice' | 'direct' | 'calculator' | 'result';

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('choice');
  const [goal, setGoal] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [recommended, setRecommended] = useState(0);
  const [error, setError] = useState('');

  function handleDirectSubmit(e: React.FormEvent) {
    e.preventDefault();
    const g = parseInt(goal);
    if (!g || g < 20 || g > 500) {
      setError('Enter a goal between 20g and 500g');
      return;
    }
    saveProfile({ goal: g });
    router.push('/');
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    const w = parseFloat(weight);
    const a = parseInt(age);
    if (!w || w < 50 || w > 500) {
      setError('Enter a weight between 50 and 500 lbs');
      return;
    }
    if (!a || a < 13 || a > 120) {
      setError('Enter an age between 13 and 120');
      return;
    }
    const rec = calculateRecommendedProtein(w, a, sex);
    setRecommended(rec);
    setStep('result');
  }

  function handleUseRecommended() {
    saveProfile({
      goal: recommended,
      weight: parseFloat(weight),
      age: parseInt(age),
      sex,
    });
    router.push('/');
  }

  const inputClass = "mt-1.5 w-full py-3.5 px-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all";
  const primaryBtnClass = "w-full py-4 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 text-white font-semibold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.98] transition-all";
  const secondaryBtnClass = "w-full py-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-semibold text-lg hover:bg-gray-50 dark:hover:bg-white/10 active:scale-[0.98] transition-all";

  return (
    <div className="w-full max-w-md space-y-8 animate-scale-in">
      {/* Logo / Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
            <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Protein Tracker</h1>
        <p className="text-gray-400 dark:text-gray-500">
          Track your daily protein with AI
        </p>
      </div>

      {step === 'choice' && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-center text-gray-500 dark:text-gray-400 mb-2">How would you like to set your goal?</p>
          <button
            onClick={() => { setStep('direct'); setError(''); }}
            className={primaryBtnClass}
          >
            I know my goal
          </button>
          <button
            onClick={() => { setStep('calculator'); setError(''); }}
            className={secondaryBtnClass}
          >
            Help me figure it out
          </button>
        </div>
      )}

      {step === 'direct' && (
        <form onSubmit={handleDirectSubmit} className="space-y-5 animate-fade-in">
          <label className="block">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Daily protein goal (grams)
            </span>
            <input
              type="number"
              value={goal}
              onChange={e => { setGoal(e.target.value); setError(''); }}
              placeholder="e.g. 150"
              className={inputClass}
              autoFocus
            />
          </label>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className={primaryBtnClass}>
            Set Goal
          </button>
          <button
            type="button"
            onClick={() => { setStep('choice'); setError(''); }}
            className="w-full py-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm"
          >
            Back
          </button>
        </form>
      )}

      {step === 'calculator' && (
        <form onSubmit={handleCalculate} className="space-y-5 animate-fade-in">
          <label className="block">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Body weight (lbs)
            </span>
            <input
              type="number"
              value={weight}
              onChange={e => { setWeight(e.target.value); setError(''); }}
              placeholder="e.g. 180"
              className={inputClass}
              autoFocus
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</span>
            <input
              type="number"
              value={age}
              onChange={e => { setAge(e.target.value); setError(''); }}
              placeholder="e.g. 28"
              className={inputClass}
            />
          </label>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Sex</span>
            <div className="mt-1.5 flex gap-3">
              <button
                type="button"
                onClick={() => setSex('male')}
                className={`flex-1 py-3.5 rounded-2xl font-semibold text-lg transition-all active:scale-[0.97] ${
                  sex === 'male'
                    ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setSex('female')}
                className={`flex-1 py-3.5 rounded-2xl font-semibold text-lg transition-all active:scale-[0.97] ${
                  sex === 'female'
                    ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10'
                }`}
              >
                Female
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className={primaryBtnClass}>
            Calculate
          </button>
          <button
            type="button"
            onClick={() => { setStep('choice'); setError(''); }}
            className="w-full py-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm"
          >
            Back
          </button>
        </form>
      )}

      {step === 'result' && (
        <div className="space-y-6 text-center animate-scale-in">
          <div className="py-6 px-4 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">Recommended daily intake</p>
            <p className="text-6xl font-bold tracking-tight bg-gradient-to-b from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              {recommended}g
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">protein per day</p>
          </div>
          <button onClick={handleUseRecommended} className={primaryBtnClass}>
            Use this goal
          </button>
          <button
            onClick={() => { setGoal(String(recommended)); setStep('direct'); }}
            className="w-full py-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm"
          >
            Adjust manually
          </button>
        </div>
      )}
    </div>
  );
}
