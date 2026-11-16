# Engineering at Habit Tracker

Builds Habit Tracker.

## Facts here

- Stack: Expo (React Native) with TypeScript and Expo Router, one code base for the web and Android, with pnpm ([.context/README.md](../../README.md), [tasks.md](../../tasks.md) T001).
- Habits are kept on the device: AsyncStorage on Android, localStorage on the web. No sign-in and no server ([tasks.md](../../tasks.md) T002, [.context/README.md](../../README.md)).
- Habits are stored by `src/habits/storage.ts` as one JSON list under the AsyncStorage key `habits.v1`. On the web AsyncStorage writes to `localStorage`, so there is one code path for both.
- Each habit has `doneDays`: the local days it was ticked, as `YYYY-MM-DD`. Habits saved before this field existed do not load; the app is an MVP with no users, so there is no reader for the old shape ([tasks.md](../../tasks.md) T003).
- Streak rule (`src/habits/streaks.ts`): the current streak counts days in a row ending today. If today is not ticked yet, it ends yesterday, so a streak stays alive until the end of the day after the last tick. To drop to 0 as soon as today is not ticked, change the start day in `currentStreak`. Date math runs in UTC on day keys, so daylight-saving changes cannot skip or repeat a day.

## Lives here

- `src/habits/storage.ts`: the habit list and its storage, with tests in `storage.test.ts`.
- `src/habits/streaks.ts`: day keys and streak counting, with tests in `streaks.test.ts`.
- `src/app/index.tsx`: the habit list screen, with Done/Undo for today and the streak line.

## Open

- T004: design, built on the habit list screen.
