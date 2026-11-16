# Tasks — Habit Tracker

## Now

1. [ ] T001 Scaffold the app: Expo with TypeScript and Expo Router, web and Android, with pnpm. Add lint (Biome), type checks and Vitest, and list each as a check in `.archon/checks.json`. Done when `pnpm typecheck`, `pnpm lint` and `pnpm test` pass and `npx expo export --platform web` builds.
2. [ ] T002 Habits: add a habit by name, rename it, delete it; the list is kept on the device (AsyncStorage on Android, localStorage on the web). Tests for the storage.
3. [ ] T003 Today: tick a habit done for today or untick it; each habit shows its current streak (days in a row up to today) and its best streak. Tests for the streak counting, including a missed day and a habit added today.
4. [ ] T004 Design: one clean screen in light and dark, readable at phone width, with an empty state that says how to start.
5. [ ] T005 Publish the web build to Cloudflare Pages (free plan) at a ritvi-apps address; release waits at the release gate.
