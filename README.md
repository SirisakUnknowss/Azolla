# DeepTalk

A conversation-card app for people sitting across from each other. Pick a
relationship, choose how deep you want to go, and the app deals questions one
card at a time.

Built from the [Deeptalk Claude Design canvas](https://claude.ai/design/p/9ed50994-f48d-4824-8a66-1bba6ca0ca3f)
(`Deeptalk.dc.html`) as a React Native app for iOS and Android.

**Version 1.0.0** · iOS build 1 · Android versionCode 1 · also runs on the web

---

## What's in it

| Screen | What it does |
| --- | --- |
| **Play** (home) | Seven relationship decks, a live day-streak, and one daily question |
| **Setup** | Depth 1–10, three play modes, and the names at the table |
| **Session** | Swipeable question cards, turn timer, keep (★) and pass |
| **Kept** | Every question you starred, filed by relationship and level |
| **Packs** | Four themed decks, your own written questions, and session settings |

### Content

- **7 relationship decks** — New friend, Old friend, Best friend, Lover,
  Family, Colleague, Stranger (9 questions each).
- **4 themed packs** — First night out, Ten years later, After midnight,
  The repair pack (9 questions each).
- **Your own pack** — questions you write, playable like any other deck.
- **14 daily questions**, rotating on a fixed local-calendar cycle.

Every one of those, and every word of chrome, ships in **English and Thai**.

### Depth

Level 1–10 maps onto four bands — Warm-up, Getting real, Uncomfortably honest,
No going back. The level decides where in a deck the session opens, so a
level-9 night skips the small talk entirely.

---

## Languages

The app is bilingual: **EN / TH**, switched from the pill in the Play header or
from Language in Packs → Session. The choice is persisted, and a fresh install
opens in Thai if the device locale is Thai.

- `src/i18n/strings.ts` holds the chrome. `en` is the source of truth for the
  shape and `th` is typed against it, so a missing key is a compile error.
- `src/data/content.en.ts` and `content.th.ts` hold the questions. They mirror
  each other index for index — the nth question of a deck is the same question
  in both files.
- Ids never change with the language. Relationships, packs, modes and bands are
  keyed by stable ids (`Lover`, `after`, `pass`, `honest`), so persisted state
  is untouched by a switch, and a question kept in one language reads in the
  other. `src/data/questions.ts` is the index that makes that work; questions
  you wrote yourself are their own key and are never translated.
- Thai gets its own faces. Instrument Serif and DM Sans carry no Thai glyphs,
  and on Android a custom typeface has no fallback chain, so Thai set in them
  would render as empty boxes — the Thai side uses Noto Serif Thai and Noto
  Sans Thai instead, and both sets are bundled. Screens build their styles
  through `useStyles(makeStyles)`, which hands the sheet the active language's
  faces along with roomier leading (Thai stacks vowels and tone marks above and
  below the baseline) and drops the Latin uppercasing and wide letter-spacing.

Adding a third language is: one more file next to `content.th.ts`, one more
block in `strings.ts`, a face set in `theme/tokens.ts`, and the code in
`i18n/lang.ts`.

---

## Running it

```bash
npm install
npx expo run:ios
```

(For the browser, see [Web](#web) below — `npm run web`.)

```bash
npx expo run:android
```

`ios/` and `android/` are generated directories — they are not checked in.
`expo run:*` creates them on demand; `npm run prebuild` regenerates them from
scratch after any change to `app.json`.

### Two local gotchas on this machine

Both are environment issues, not project ones:

1. **CocoaPods needs a UTF-8 locale.** Without it `pod install` dies inside
   Ruby's unicode normalizer. Add to your shell profile:

```bash
export LANG=en_US.UTF-8
```

2. **A patched dependency.** `expo-modules-jsi@57.0.4` (the latest stable)
   fails to compile under Xcode 26.2 — Swift reports `ambiguous use of 'abs'`
   in `JavaScriptCodable+Date.swift`. `patches/expo-modules-jsi+57.0.4.patch`
   swaps the call for `Double.magnitude`, which is the same value with no
   overload resolution involved. `patch-package` runs from `postinstall`, so
   the patch applies on every install including EAS cloud builds. Drop it once
   upstream ships a fix.

3. **The Android NDK's clang shadows Xcode's.** `~/Library/Android/sdk/ndk/*/toolchains/llvm/prebuilt/darwin-x86_64/bin`
   sits ahead of `/usr/bin` on your `PATH`, so iOS builds pick the Android
   linker and fail with `ld64.lld: error: library not found for -lSystem`.
   Move the NDK entry after `/usr/bin` in your profile, or prefix iOS builds:

```bash
env PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin" npx expo run:ios
```

---

## Web

The same codebase runs in a browser — no separate build. This is the route for
a phase-one release where people open the app from a link (in LINE, for
example) instead of installing anything.

```bash
npm run web
```

```bash
npm run build:web
```

`build:web` writes a static site to `dist/` (~2.1 MB, fonts included) — an
`index.html`, one JS bundle and the assets. Any static host serves it: EAS
Hosting, Vercel, Netlify, Cloudflare Pages, S3. `web.output` is `single`, so
it is a plain SPA with no routing and no server needed.

What was checked in a browser at 375×812: every screen, the card swipe and
deal-in animation, the turn timer, the TH/EN switch, and persistence — web
storage is `localStorage`, so kept questions, your pack and the chosen language
survive a reload the same way they survive a relaunch on a phone.

### Opening it from LINE

A link opened in LINE runs in LINE's in-app browser, which is a normal WebView
— nothing extra is required for the app itself to work. Worth knowing before
you ship it there:

- **Haptics quietly stop.** `expo-haptics` maps to the Web Vibration API, which
  iOS Safari (and therefore LINE on iOS) does not implement. The calls are
  already guarded, so they no-op rather than throw.
- **Storage is per-browser.** Kept questions live in the in-app browser's
  `localStorage`. They do not follow the user to Safari or Chrome, and they are
  gone if the user clears LINE's browser data. Anything that has to survive
  that needs a backend.
- **The card swipe shares the screen with the browser's own gestures.** On iOS
  an edge swipe can be read as "go back" before the card sees it. Every card
  also has Pass and Next buttons, so the gesture is never the only way through.
- **Link previews and LIFF need an HTML template.** With `web.output: "single"`
  the shell comes from `public/index.html` if you add one — that is where the
  `og:` tags for a LINE share card go, and where the LIFF SDK `<script>` would
  go if you later want LINE Login, share-to-chat, or `liff.closeWindow()`.
  Without one, Expo generates the shell and injects `theme-color` and
  `description` from the `web` block of `app.json`.

---

## Release builds

Version lives in `app.json` (`expo.version`, `ios.buildNumber`,
`android.versionCode`) and is mirrored in `package.json`. Bump all of them
together for a new release.

Build profiles are in `eas.json`:

```bash
npm run build:ios
```

```bash
npm run build:android
```

```bash
npm run build:all
```

`production` produces an Android **app bundle** (.aab) for Play and a signed
archive for App Store Connect, and auto-increments the build number. `preview`
produces an installable **APK** and an internal-distribution iOS build.

Before the first cloud build you need an Expo account and one-time credential
setup:

```bash
npx eas login && npx eas build:configure
```

### Store metadata to fill in before submitting

- `ios.bundleIdentifier` and `android.package` are both `com.deeptalk.app` —
  change these to your own reverse-domain identifier before the first upload,
  because they cannot be changed afterwards.
- Privacy: the app collects nothing and makes no network calls. Everything —
  kept questions, your written pack, players, streak — lives in on-device
  storage only. Declare "no data collected" on both stores.
- `ITSAppUsesNonExemptEncryption` is already declared `false`.

---

## Layout

```
App.tsx                     Root: fonts, splash, and the screen state machine
src/
  data/
    decks.ts                Ids and taxonomy: relationships, hues, depth bands
    content.en.ts           English questions, blurbs, pack and band copy
    content.th.ts           The same, in Thai, index for index
    questions.ts            Language-independent identity for a question
  i18n/
    lang.ts                 The Lang type and the device-locale default
    strings.ts              Every word of chrome, in both languages
    index.ts                useI18n() — language, strings, content, type
  state/
    storage.ts              AsyncStorage schema, migration-tolerant reads
    store.tsx               App state + persistence, exposed via useStore()
  screens/                  Home, Setup, Session, Saved, Packs
  components/
    QuestionCard.tsx        The swipeable card (Reanimated + gesture handler)
    TabBar.tsx              Floating blurred pill bar
    LangToggle.tsx          The TH | EN segmented pill
  theme/
    tokens.ts               Colours, type, radii — lifted from the canvas
    useStyles.ts            Builds a screen's stylesheet for the active language
  util/                     Daily-question cycle, haptics wrappers
```

State that survives a relaunch: kept questions, your written pack, the names at
the table, session settings, the chosen language, the streak, and your last
setup choices. Live
session state (current card, timer) is deliberately in-memory.

---

## Where this differs from the design canvas

The canvas is a five-screen prototype with hardcoded state. These are the
places the shipping app had to go further:

- **Persistence.** The canvas resets on reload; the app stores everything
  locally and reconciles old blobs field-by-field on read.
- **The streak is real.** It was a hardcoded `6`; it now counts consecutive
  local calendar days on which a session was started.
- **The daily question is real.** The canvas rendered one fixed string and its
  CTA started an unrelated Lover session. The app rotates the question by day
  and deals it as the first card of the session.
- **Packs and custom questions are playable.** The canvas tracked pack
  selection and collected written questions but never used either as a deck.
  It also shipped no questions for the four packs — those are written here.
- **Session settings are user-facing.** `timerSeconds`, `showTimer` and
  `allowSkip` were canvas-editor props; they are now persisted settings under
  the Session section of the Packs tab.
- **The timer counts down and stops.** It counted up without bound; it now
  parks at 0:00 with one warning haptic, and pauses when the app backgrounds.
- **Safe areas replace hardcoded insets.** The canvas baked in a 74px status
  bar for a single device.
- **Accessibility.** Every control carries a role, label and state.
- **Two languages.** The canvas is English only. The app ships the whole of it
  in Thai as well, including the 113 questions, and switches live.
