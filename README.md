# Gotham: The Night Is Listening
    npm install
    npm run dev:full  # web (http://localhost:5173) + account server (port 8787), with sync
    npm run dev       # web only; progress stays in this browser
    npm test          # unit tests: puzzles, deductions, storage, sync merge
    npm run build     # type-check (client + server) and build into dist/
    npm start         # build, then serve the game AND the API from one server

## Accounts and sync
- server/server.ts: Node http + SQLite (better-sqlite3). Users, sessions and progress tables; database file server/gotham.db (git-ignored).
- Passwords: scrypt with a per-user salt. Sessions: random token in an HttpOnly, SameSite=Lax cookie; only a hash is stored. Login/register are rate limited per IP.
- Progress merges instead of overwriting: best score per mission, union of deductions, so two devices never erase each other. The server re-validates everything it receives.
- Not synced on purpose: the mid-mission resume save, and sound settings (per device).
- "Reset progress" in the Batcomputer also erases the account copy. Logging out clears this device's copy.

## Deploy
Any host that runs Node: set the start command to `npm start`; it uses the PORT the host provides and serves the built game plus the API from one origin (cookies just work). Put DB_PATH on a persistent disk (SQLite lives in a file), and set COOKIE_SECURE=1 if HTTPS is terminated before the server. Static-only hosts (Netlify drop, GitHub Pages) still run the game, but accounts stay offline and progress stays in the browser.

## Structure
src/game (types, missions, casefile, deduce, storage, account, sound, hooks) · src/shared/progress.ts (validation + merge, used by browser and server) · src/components · server/ · hash routes #/batcomputer/map|case|board|missions
