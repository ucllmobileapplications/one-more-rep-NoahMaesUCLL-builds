# One More Rep

**Tap to lift. Every rep in a set gets heavier. Every 10th rep is a Boss Rep.**

One More Rep is a one-thumb incremental gym game made in Unity by Noah Maes for the course Mobile Applications [MBI51j] at UCLL (2026-27). This repository only holds the published game. The source code is in the course's private repository.

## Play in the browser (PWA)

**https://ucllmobileapplications.github.io/one-more-rep-NoahMaesUCLL-builds/**

- Runs in a recent browser with WebGL 2, on a phone or a computer. On a computer it shows as a phone-shaped column.
- Install it like an app:
  - **Android (Chrome):** menu (three dots) > **Install app** or **Add to Home screen**.
  - **iPhone (Safari):** Share > **Add to Home Screen**.
  - **Computer (Chrome or Edge):** the install icon in the address bar.
- After the first visit it also works offline. Progress is saved in the browser, on that device.
- The **Records** tab shows the **world leaderboard**, stored in a hosted database (see below). It needs a connection; offline it shows the last list it loaded.

The web version is in [`docs/`](docs/): `index.html`, `manifest.json`, the service worker `ServiceWorker.js`, the icons in `TemplateData/` and the Unity game files in `Build/`. GitHub Pages serves it from that folder.

## Database (world leaderboard)

The leaderboard lives in **Supabase** (hosted PostgreSQL, region Central EU / Frankfurt). There is no login: players are anonymous, with a random id per device and a generated name such as "Lifter 4821".

- **Check that it is up:** [this link](https://rmfcopbmyphpfkykgztk.supabase.co/rest/v1/rpc/top_lifters?p_limit=10&apikey=sb_publishable_lSqaRwLZQnIbusElcOe9kw_qqAXxiHj) returns the current top 10 as JSON, straight from the database.
- The game only uses Supabase's public (publishable) key, which can call three database functions (send a best, read the top 10, read your rank) and nothing else; the table itself is locked by Row Level Security.
- Free Supabase projects pause after a week without activity, so the workflow [`keep-database-awake.yml`](.github/workflows/keep-database-awake.yml) reads the leaderboard every six hours.

## Android app (APK)

**[OneMoreRep.apk](https://github.com/ucllmobileapplications/one-more-rep-NoahMaesUCLL-builds/raw/main/OneMoreRep.apk)** (version 0.1.0, built 9 Nov 2026, 57.7 MB)

1. Open the link on an Android phone (Android 7.1 or newer) and download the file.
2. Open the downloaded `OneMoreRep.apk`. If Android asks, allow your browser or file manager to install unknown apps.
3. Start **One More Rep** from your home screen and tap anywhere on the gym to push the bar.

The app is signed with a debug key, so Play Protect may warn that it comes from an unknown developer. It needs no account, has no ads, and works offline. Progress is saved on the phone; the world leaderboard needs a connection.
