# Protein Tracker

A simple, no-friction protein tracker that uses AI to estimate protein from natural language. Just type or say what you ate — "double chicken burger", "3 eggs and toast", "a Greek yogurt" — and it handles the rest.

Built as a simpler alternative to apps like MyFitnessPal and Cal AI. No barcode scanning, no photo logging, no complex meal databases. Just tell it what you ate and it tracks your protein.

## Features

- **Natural language input** — Type what you ate in plain English, AI estimates the protein
- **Voice input** — Tap the mic and speak instead of typing (Chrome/Edge)
- **Daily progress ring** — Visual progress toward your daily protein goal
- **Activity grid** — GitHub-style streak tracker showing your consistency over the last 3 months
- **Smart onboarding** — Set your own goal or let the app calculate one based on your body weight, age, and sex
- **Offline-first** — All data stored locally in your browser, no account needed

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Claude Haiku 4.5** for protein estimation (~$0.0007 per query)
- **Web Speech API** for voice-to-text
- **localStorage** for data persistence

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/travislima/ProteinTracker.git
   cd ProteinTracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your API key:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## How It Works

1. On first visit, you set a daily protein goal (or the app calculates one for you)
2. Throughout the day, type or speak what you ate
3. Claude Haiku parses your food description and estimates protein content
4. Your daily progress updates in real-time with a visual ring
5. The activity grid tracks whether you hit your goal each day

## Project Structure

```
src/
  app/
    page.tsx                    # Dashboard
    onboarding/page.tsx         # First-time setup
    api/estimate/route.ts       # Claude API endpoint
  components/
    ProteinRing.tsx             # Circular progress indicator
    FoodInput.tsx               # Text + voice input
    FoodLog.tsx                 # Daily food entries
    ActivityGrid.tsx            # Streak tracker
    OnboardingFlow.tsx          # Goal setup wizard
  lib/
    types.ts                    # Zod schemas + types
    storage.ts                  # localStorage helpers
    protein.ts                  # Protein calculations
  hooks/
    useLocalStorage.ts          # Reactive localStorage hook
    useSpeechRecognition.ts     # Web Speech API hook
```

## Roadmap

- [ ] Database backend (Supabase) for cross-device sync
- [ ] User accounts and authentication
- [ ] Edit logged entries
- [ ] Weekly/monthly protein stats and trends
- [ ] PWA support for mobile home screen
- [ ] Native mobile app (React Native)

## License

MIT
