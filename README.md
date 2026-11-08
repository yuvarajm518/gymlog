# GYMLOG v1.0.0

A personal, mobile-first workout journal. Dark charcoal + lime, no account required, no tracking scripts, no runtime dependencies, no build step.

## Put it on GitHub Pages

1. Extract this ZIP on your computer.
2. Create a GitHub repository named `gymlog` (a public repository is the simplest setup). Your code will be public; workout records stay in your browser. Never upload backup JSON files to the repository.
3. Upload the **contents** of this folder into the repository. `index.html` must be at the repository root, not inside another folder. Upload the extracted files, not the ZIP.
4. In repository **Settings → Pages**, select **Deploy from a branch**, branch **main**, folder **/(root)**, then Save.
5. Wait for the deployment to finish and open the URL shown in Pages. It will usually have the form `https://YOUR-USERNAME.github.io/gymlog/`.
6. On iPhone, open that URL in Safari, open Share, choose **Add to Home Screen**, enable **Open as Web App** if offered, then Add.
7. Open the installed app online once. After its files are cached, test opening and logging in airplane mode before relying on it at the gym.

Official setup references:
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://support.apple.com/en-ca/guide/iphone/iphea86e5236/27/ios/27

## First workout

Open Gym → Create plan, or Browse templates. Each plan has seven independently named days. Open a day, rename it if desired, add exercises, and configure sets, target reps, notes, and rest intervals. Start workout. Enter actual weight/reps and check off completed sets. Finish workout to add it to your calendar and progress charts.

The blank app contains 24 starter exercises and two optional editable routine structures, but **no fabricated workout history**. Custom exercise creation expands the library. Templates are organisational starting points, not personalised coaching.

Use Cardio for timed activity: select an activity, enter minutes and optionally distance, machine calories, speed, incline, resistance, and notes. Use Other with a custom session name for activities not listed.

## Features

- Home: Gym, Cardio, Calendar, Progress, Settings, and resume banner.
- Renameable plans and seven day blocks; duplicate/delete plans, mark rest days.
- Exercise search and muscle/equipment filters; custom exercises.
- Add/reorder/remove exercises; configure sets/reps/rest/notes.
- Weight/rep entry, previous-session values, one-tap completion/undo, optional rest timer.
- Automatic local saving of active workout edits, reload recovery.
- Calendar with Gym/Cardio markers; view/edit/delete sessions; log past dates.
- Graphs: maximum weight, volume, reps at a chosen weight. Filters: last 30 days, 3/6/12 calendar months, all time. Scope by stable day ID or all plans.
- kg/lb support: historical records retain original units, graphs convert to selected unit.
- JSON backup and validated restore (restore replaces current data after confirmation).
- PWA manifest, app icons, and service worker for offline assets on HTTPS/localhost.

## Data and calculation rules

- The app uses browser localStorage under `gymlog-v1`. Records are device/browser/origin-specific. There is no server backup or cross-device sync. Safari and an installed web app may have separate storage; test in the installed app from the beginning. Export/restore to move data.
- Browser data clearing or eviction can erase history. Export backups regularly and before changing devices, browser, hosting origin, or repository address. Do not log simultaneously in multiple tabs.
- Plans are reusable templates; sessions store snapshots with their own date and sets. Renaming a plan/day never breaks history. Duplicating a plan creates a fresh identity. Deleting a plan retains past sessions.
- Only checked/completed sets count toward charts. Default or copied values are suggestions until checked. Incomplete exercises remain in session details, marked with no completed sets.
- Total volume = entered weight × reps, summed across completed sets. For dumbbells, consistently enter one dumbbell's weight; the app does not double it. For bodyweight movements, enter 0 for added weight (body mass is not included). Assisted-weight machines need a consistent custom naming convention; this version does not model assistance.
- Graph points are spaced by session order, not proportional elapsed time. Session dates are displayed and each point/list row opens the actual sets. A single session shows one point, not an invented trend. Rep comparisons use the selected exact weight, with internal kg/lb conversion.
- Calendar dates are local dates, independent of a day block's name. "Monday" can be performed on Tuesday.
- Duration is elapsed wall-clock time until finished, including time away; manually edit it when necessary. For a historical workout, set both date and duration.
- Rest timer uses an absolute end time and recovers after app switching. Alerts are in-app only; background sound, vibration and lock-screen notifications are not implemented.
- Saved-session edits are applied when Save changes is pressed. Active workout entry is autosaved; unsaved edits to completed sessions are not recoverable after a reload.
- Offline use requires a successful first online load over HTTPS or localhost. The app does not require third-party fonts or scripts. On updates, bump the cache version in sw.js, reconnect online, then close and reopen all app windows.

## Local development

Do not double-click index.html: ES modules need an HTTP server.

With Python installed, in this extracted directory:

```sh
python -m http.server 8000
```

Open http://localhost:8000 on the same computer. For phone installation use the HTTPS GitHub Pages address.

Core checks (Node.js 20+):

```sh
npm test
```

No npm install is needed. Files: index.html (shell), style.css (design), app.js (UI), core.js (data/calculations/validation), sw.js (offline assets), manifest.webmanifest (installation), icons, tests.

## Validation and limits

- Nine automated tests cover backup roundtrip, real timestamps/timers, invalid backups, unique day IDs, completed-set calculations, exact-weight rep comparisons, rename-safe scope, unit conversions, date cutoff, and cardio values.
- Browser QA exercised template creation, workout entry, reload recovery, completion, calendar and graph display, and cardio saving. Desktop and a 375px embedded phone viewport were inspected.
- Not yet physically tested on an iPhone. Safari installation, offline mode, and backup file-picker/export interactions still need device testing. The browser preview used HTTP; service-worker installation requires HTTPS or localhost.
- This is a personal-use first release. Accounts, cloud sync, exercise demo videos, body measurements, social features, AI coaching, subscriptions and App Store packaging are not included.
