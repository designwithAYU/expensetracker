# Ledgerly — AI-Powered Expense Tracker

A fintech-grade personal expense tracker built with React (Vite), Tailwind CSS v4, Framer Motion, Recharts, and Zustand. No backend — everything is stored in your browser's Local Storage, with optional live AI (OpenAI/Gemini) for richer chat and reports.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## AI features

Ledgerly ships with a **local, rule-based AI engine** (`src/services/aiService.js`) that works fully offline:
- Automatic expense categorization from description keywords
- Natural language expense parsing ("Spent ₹350 on Pizza yesterday")
- A finance chat assistant that answers from your own stored data
- AI-generated monthly reports, budget optimization, spend prediction, and smart alerts

If you want richer, more natural language responses, go to **Settings → AI Provider** and add your own OpenAI or Google Gemini API key. The key is stored only in your browser's Local Storage and used to call the provider directly from the client (no backend, so treat it like any client-side key — don't use a production key with wide scopes).

## Project structure

```
src/
  components/   reusable UI: ui/, layout/, dashboard/, charts/, expense/, ai/, notifications/
  pages/        route-level views (Landing, Onboarding, Dashboard, AddExpense, ...)
  layouts/      AppLayout app shell (sidebar + topbar)
  context/      Zustand global store (context/store.js)
  hooks/        useTheme, useToast
  services/     aiService.js (AI logic)
  utils/        storage.js, format.js, analytics.js, pdfExport.js
  constants/    categories.js, currencies.js, iconMap.js
```

## Design

Palette: Vault Teal (#0F5C56), Gold Signal (#C9A227), Coral (#E15554), Ink (#0E1116) / Paper (#F6F4EF).
Type: Fraunces (display) + Inter (body) + JetBrains Mono (ledger data).
Signature element: the "Vault Dial" — a bank-vault-inspired circular financial health gauge.
