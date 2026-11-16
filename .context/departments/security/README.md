# Security at Habit Tracker

Keeps Habit Tracker's code and data safe.

## Facts here

- No sign-in and no server: habits stay on the device ([.context/README.md](../../README.md)).
- The repo is public. `.archon/.env` holds no secret, only a marker for loop runs (`.archon/.env`).
- `.gitignore` keeps `.env.local` out of git.

## Lives here

- Nothing yet.

## Open

- No dependency audit yet; it starts when T001 adds `package.json`.
