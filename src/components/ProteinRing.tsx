'use client';

import { getGoalPercentage } from '@/lib/protein';

interface ProteinRingProps {
  current: number;
  goal: number;
}

export function ProteinRing({ current, goal }: ProteinRingProps) {
  const percentage = getGoalPercentage(current, goal);
  const radius = 54;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const remaining = Math.max(goal - current, 0);

  return (
    <div className="flex flex-col items-center gap-3 animate-scale-in">
      <div className="relative">
        <svg viewBox="0 0 128 128" className="w-48 h-48 drop-shadow-lg">
          <defs>
            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="ring-gradient-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-gray-200/50 dark:text-white/5"
            strokeWidth={strokeWidth}
          />

          {/* Progress */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={percentage >= 100 ? "url(#ring-gradient-gold)" : "url(#ring-gradient)"}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 64 64)"
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tracking-tight">{current}</span>
          <span className="text-sm text-gray-400 dark:text-gray-500 -mt-0.5">of {goal}g</span>
        </div>
      </div>

      {/* Status text */}
      {percentage >= 100 ? (
        <div className="flex items-center gap-1.5 text-amber-500 font-medium text-sm animate-in">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
          </svg>
          Goal reached!
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {remaining}g remaining
        </p>
      )}
    </div>
  );
}
