# AGENTS.md — Hiragana Lernapp

> Context for AI coding agents working on this project. Mostly English; German where the domain requires it.

---

## Project Identity

A **single-page React app** for learning Japanese Hiragana.
Built as a companion for the **VHS Düsseldorf** Japanese course **A1.1.1** using the textbook *Minna no Nihongo* (みんなの日本語).

- **Public URL (GitHub Pages)**: https://holgergp.github.io/hiragana-vhs/
- **Netlify deploys**: branch previews + production from `main`

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | **React 19** (no routing library) |
| Build tool | **Vite 8** with `@vitejs/plugin-react` |
| Styling | **Vanilla CSS-in-JS** — a single `<style>` block inside `App.jsx` (no CSS Modules, no Tailwind, no styled-components) |
| Formatter | **Prettier** |
| Tests | None yet |

---

## Project Structure

```
├── public/               (static assets — currently empty)
├── src/
│   ├── App.jsx           # Tab router, header, styles, Overview component, wrong-count state
│   ├── data.js           # HIRAGANA_DATA, WORD_DATA, GROUP_LABELS
│   ├── quizUtils.js      # Pure functions: shuffle, getWrongOptions, pickWeighted
│   ├── main.jsx          # Entry point — renders <App /> in StrictMode
│   └── components/
│       ├── Quiz.jsx      # Hiragana character quiz (char2rom / rom2char)
│       └── WordQuiz.jsx  # Hiragana word quiz (char2rom / rom2char)
├── index.html            # HTML shell — lang="de"
├── vite.config.js        # Vite config with conditional base path
├── netlify.toml          # Netlify build settings + SPA redirect
├── .github/workflows/
│   └── deploy.yml        # GitHub Pages deployment workflow
└── package.json
```

---

## Data Model

Hiragana characters are stored as a flat array `HIRAGANA_DATA` in `data.js`:

```js
{ char: "あ", rom: "a", group: "vowels", lesson: 1 }
```

- `char` — the Hiragana character
- `rom` — Hepburn romanization (e.g. "shi", "tsu", "fu")
- `group` — the row key (e.g. "k", "s", "t", "g", "z", ...)
- `lesson` — `1` (basic characters) or `2` (dakuten / handakuten)

`GROUP_LABELS` maps group keys to German + Japanese labels (e.g. `k: "か行 (K)"`).

When modifying data:
- Keep the array sorted by lesson, then by the traditional Gojūon order.
- Always update `GROUP_LABELS` when adding new groups.

---

## Architecture

### State Management
- Pure React `useState` / `useCallback` — no Redux, no Context API.
- Top-level tabs: `overview`, `quiz-char`, `quiz-rom`, `quiz-word-char`, `quiz-word-rom`.

### Components
- `App` — tab router, header, navigation, styles, `wrongCounts` state
- `Overview` — grid view, lesson filter pills, grouped sections
- `Quiz` — parameterized for both directions (`mode="char2rom"` | `"rom2char"`)
- `WordQuiz` — word quiz parameterized for both directions

### Styling Approach
All CSS is a single template string injected via `<style>{css}</style>` in `App`.
- Dark theme (`#0d0d0f` background, `#e8e4dc` text)
- Accent color: **gold** (`#b8860b`)
- Fonts: Google Fonts `Noto Sans JP` + `DM Serif Display`
- Responsive grid with `clamp()` and `auto-fill`

If you change styles, keep the existing visual language (dark, minimal, gold accents). Do **not** introduce a CSS-in-JS library or external CSS files unless explicitly asked.

---

## Important Behaviors

1. **Quiz wrong options** — `getWrongOptions()` picks 2 distractors from the same filtered pool. Always ensure the pool has ≥ 3 items or the function will silently return fewer options.
2. **Score reset on filter change** — changing the lesson filter inside a quiz resets the score to zero and generates a new question.
3. **Shuffle uses Fisher-Yates** — questions and options are shuffled in-place on a copy of the array.
4. **Weighted quiz selection ("Spaced-Repetition light")** — When the user answers incorrectly, the component calls `onRegisterMiss(key)`, which increments a counter in the shared `wrongCounts` map held by `App`. Before drawing the next question, `pickWeighted()` assigns every item a base weight of `1` plus its current miss count. A character missed twice therefore has weight `3` vs. `1` for an unmissed character, making it three times more likely to appear again. The map is shared across all four quiz tabs, so a miss in *Aussprache → Zeichen* also raises the priority in *Zeichen → Aussprache*. `Quiz` keys the map by `item.char`; `WordQuiz` keys it by `item.word`, so the two pools never interfere.
5. **No persistent storage** — scores and `wrongCounts` are lost on page reload (by design, for now).

---

## Deployment & Base Path

`vite.config.js` switches the `base` path based on the environment:

```js
const base = process.env.NETLIFY ? '/' : '/hiragana-vhs/'
```

- **GitHub Pages**: requires `/hiragana-vhs/` base path.
- **Netlify**: uses root `/`.

Never hard-code either path in the source — always rely on Vite's `base` resolution.

### CI/CD
- **GitHub Pages**: `.github/workflows/deploy.yml` triggers on every push to `main` (Node 20, `npm ci`, upload `dist/`).
- **Netlify**: automatic via `netlify.toml` (Node 22, same build command, SPA redirect `/* → /index.html`).

Branch previews are enabled on Netlify.

---

## Language & Copy

The UI is in **German** because the target learners are German-speaking VHS students.

- Keep German labels, button text, and quiz feedback.
- Japanese terms (Lektion, Zeichen, Aussprache) are used naturally in German context.
- If adding new copy, prefer clear, concise German. Use Japanese script only for actual Hiragana/Katakana/Kanji content.

---

## Adding New Features — Guidelines

1. **Keep it in App.jsx** unless the file exceeds ~800 lines. Only then extract to `src/components/`.
2. **No new dependencies** unless there is a strong justification. The app intentionally has zero runtime deps besides React.
3. **No tests yet** — if you add a test framework, choose Vite-native tooling (e.g. Vitest) and keep config minimal.
4. **Respect the existing color palette** when adding UI elements.
5. **Accessibility**: maintain `button` elements for interactive items, keep keyboard focus visible, and ensure adequate color contrast (current design targets WCAG AA for large text).

---

## Common Tasks

| Task | Notes |
|---|---|
| Add new Hiragana / Katakana | Extend `HIRAGANA_DATA` in `data.js`, add group to `GROUP_LABELS`, update lesson filter options if needed. |
| Change styling | Edit the `css` template string in `App.jsx`. |
| Add a new quiz mode | Parameterize `Quiz` further or add a new tab in `App`. |
| Add routing | **Don't** — this is a simple 3-tab SPA. |
| Add persistence | Use `localStorage` sparingly; discuss with user first. |

---

## Known Issues / Tech Debt

1. **No test coverage** — no unit or integration tests exist. Adding Vitest (Vite-native) is the preferred path if tests are introduced. The extracted `quizUtils.js` is now pure and test-ready.
2. **Giant CSS template string** — all styles live in one unscoped template literal in `App.jsx`. There is no CSS nesting, no auto-prefixing beyond Vite's defaults, and no dead-code elimination for unused rules.
3. **Hardcoded lesson filters** — filter values like `["all", "1", "2"]` are duplicated in `Overview` and `Quiz`. A single source of truth would prevent drift.
4. **Silent edge case in quiz generation** — `getWrongOptions()` can return fewer than 2 distractors if the filtered pool has < 3 items. This is not surfaced to the user.
5. **No persistent storage** — progress and scores are lost on every reload. A `localStorage` layer has been discussed but not implemented.
6. **Keys derived from content** — `opt.char + opt.rom` is used as a React key in `Quiz`. This is currently safe because the tuple is unique, but it is brittle if duplicates are ever introduced.
7. **No runtime error boundaries** — an unhandled exception will crash the entire app (white screen) because there is no `<ErrorBoundary>`.
8. **Accessibility gaps** — focus management after answering a quiz question is not implemented, and ARIA labels are missing on several interactive elements.
9. **Prettier but no linting** — there is no ESLint config, so code-style issues beyond formatting are not caught automatically.

---

## Contact / Context

Maintainer: **Holger Grosse-Plankermann** (personal side project).
Course context: VHS Düsseldorf, Minna no Nihongo A1.1.1.

If a task seems to conflict with the course structure or the Minna no Nihongo lesson order, ask the user before reorganizing the `lesson` property or `HIRAGANA_DATA` array.
