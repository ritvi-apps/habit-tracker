# Engineering at Habit Tracker

Builds Habit Tracker.

## Facts here

- Stack: Expo (React Native) with TypeScript and Expo Router, one code base for the web and Android, with pnpm ([.context/README.md](../../README.md), [tasks.md](../../tasks.md) T001).
- Habits are kept on the device: AsyncStorage on Android, localStorage on the web. No sign-in and no server ([tasks.md](../../tasks.md) T002, [.context/README.md](../../README.md)).
- Habits are stored by `src/habits/storage.ts` as one JSON list under the AsyncStorage key `habits.v1`. On the web AsyncStorage writes to `localStorage`, so there is one code path for both.

## Lives here

- `src/habits/storage.ts`: the habit list and its storage, with tests in `storage.test.ts`.
- `src/app/index.tsx`: the habit list screen.

## Open

- T003: tick-off and streaks, built on the habit list.
