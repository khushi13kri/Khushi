# OREVON

**Intelligent Oral Care** — a personalized oral-care companion built with Expo, React Native, and TypeScript.

This is the V1 mobile app: Assessment → Care Score → Personal Plan → Home, Routine, Learn, Profile, and a rule-based OREVON AI. See `AGENTS.md` for the Expo SDK version note.

## Run it locally

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. In the terminal output, choose how to open it:
   - **Web** — press `w`
   - **iOS simulator** — press `i` (macOS only)
   - **Android emulator** — press `a`
   - **Your phone** — see below

## Try it on your phone

1. Install **Expo Go** from the App Store (iOS) or Google Play (Android).
2. Run `npx expo start` on your computer.
3. Scan the QR code shown in the terminal:
   - **iOS**: open the Camera app and point it at the code.
   - **Android**: open Expo Go and use its built-in scanner.

Your phone and computer need to be on the **same Wi-Fi network** for this to work.

If they're not on the same network (e.g. you're testing over cellular, or on a restricted network), start the server with a tunnel instead:

```bash
npx expo start --tunnel
```

This routes the connection through the internet instead of your local network, so a shared Wi-Fi connection isn't required. It's slower to connect but works from anywhere.

## Current limitations (V1)

- **No backend yet** — all data (your assessment answers, routine logs, preferences, chat history) lives in memory and resets when the app reloads. Supabase-backed persistence is planned for a later version.
- **OREVON AI is rule-based, not a live LLM** — it matches your message against Learn content and always defers to a dentist for anything urgent or diagnosis-shaped. See the roadmap below for the planned LLM upgrade.

## Roadmap

**V1 (current):**
Assessment → Care Score → Personal Plan → Routine → Learn → rule-based OREVON AI

**V2:**
Persistent user data + routine history → real LLM → personalized OREVON AI using appropriate user context, with privacy/consent considerations.

**V3:**
Product Intelligence → personalized product recommendations → OREVON Shop.

**V4:**
OREVON-owned oral-care products and broader oral-care ecosystem.

Nothing beyond V1 is implemented yet — no Product Intelligence, product catalog, shopping, payments, Supabase, or live LLM integration.

## Project structure

```
src/
  app/            expo-router screens (file-based routing)
    main/         the 5-tab app: Home, Routine, AI, Learn, Profile
  components/      shared UI (design system components live in components/ui)
  constants/       design system tokens (colors, spacing, typography)
  lib/             Score Engine, Plan Engine, Assessment questions, Learn content
  state/           in-memory app state (Context)
```
